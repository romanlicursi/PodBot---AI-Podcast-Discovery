import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) throw new Error("Invalid user");

    // Get taste profile
    const { data: tasteProfile } = await supabase
      .from("taste_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!tasteProfile) throw new Error("No taste profile found. Please analyze your listening history first.");

    // Get previous feedback to inform recommendations
    const { data: feedback } = await supabase
      .from("recommendation_feedback")
      .select("*, recommendations(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const likedShows = feedback
      ?.filter((f: any) => f.feedback === "liked")
      .map((f: any) => f.recommendations?.show_name) || [];
    const dislikedShows = feedback
      ?.filter((f: any) => f.feedback === "disliked")
      .map((f: any) => f.recommendations?.show_name) || [];

    const systemPrompt = `You are a podcast recommendation engine. Based on the user's taste profile and feedback history, recommend specific podcast episodes they would love.

CRITICAL RULES:
- Recommend REAL podcasts and episodes that actually exist
- Mix recommendations between shows they already follow and NEW shows they'd enjoy
- At least 40% of recommendations should be from NEW shows they don't follow yet
- Each recommendation should include a specific, compelling reason
- Score each recommendation 0-1 based on how well it matches their profile
- Avoid recommending shows they've disliked`;

    const userPrompt = `Taste Profile:
${JSON.stringify(tasteProfile.profile_data, null, 2)}

Shows they currently follow:
${JSON.stringify((tasteProfile.listening_history_snapshot as any)?.followed_shows?.map((s: any) => s.name) || [], null, 2)}

Shows they've liked in recommendations: ${JSON.stringify(likedShows)}
Shows they've disliked in recommendations: ${JSON.stringify(dislikedShows)}

Please recommend 8-12 specific podcast episodes.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "save_recommendations",
            description: "Save the podcast episode recommendations",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      episode_name: { type: "string" },
                      episode_description: { type: "string" },
                      show_name: { type: "string" },
                      reason: { type: "string" },
                      is_new_show: { type: "boolean" },
                      score: { type: "number" },
                    },
                    required: ["episode_name", "show_name", "reason", "is_new_show", "score"],
                  },
                },
              },
              required: ["recommendations"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_recommendations" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI recommendation failed [${status}]`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const recs = toolCall ? JSON.parse(toolCall.function.arguments).recommendations : [];

    // Save recommendations to DB
    const toInsert = recs.map((r: any) => ({
      user_id: user.id,
      episode_name: r.episode_name,
      episode_description: r.episode_description || null,
      show_name: r.show_name,
      reason: r.reason,
      is_new_show: r.is_new_show,
      score: r.score,
    }));

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("recommendations")
        .insert(toInsert);
      if (insertError) throw new Error(`Failed to save recommendations: ${insertError.message}`);
    }

    // Fetch the saved recommendations with IDs
    const { data: savedRecs } = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);

    return new Response(JSON.stringify({ recommendations: savedRecs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
