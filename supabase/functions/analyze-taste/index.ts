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

    const { listening_data, feedback_history } = await req.json();

    // Get existing taste profile
    const { data: existingProfile } = await supabase
      .from("taste_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const previousProfile = existingProfile?.profile_data || {};
    const analysisCount = (existingProfile?.analysis_count || 0) + 1;

    const systemPrompt = `You are a podcast taste analyst. Analyze the user's podcast listening history and any feedback they've given on previous recommendations. Build a cumulative taste profile that gets more refined with each analysis.

${existingProfile ? `This is analysis #${analysisCount}. Here is their previous taste profile to refine:\n${JSON.stringify(previousProfile)}` : "This is the first analysis for this user."}

Return a JSON object using tool calling with these fields:
- topics: array of topics they enjoy (ranked by interest level)
- preferred_formats: array (e.g., "interview", "narrative", "solo commentary", "panel discussion")
- preferred_length: string (e.g., "short (< 30 min)", "medium (30-60 min)", "long (60+ min)")
- tone_preferences: array (e.g., "educational", "comedic", "serious", "conversational")
- key_interests: array of specific subjects or themes
- avoid_topics: array of topics they seem to dislike (based on negative feedback)
- listening_patterns: object with any patterns noticed
- confidence_score: number 0-1 indicating how confident you are in this profile`;

    const userPrompt = `Here is the listening data to analyze:

Recently played podcast episodes:
${JSON.stringify(listening_data.recently_played || [], null, 2)}

Shows they follow:
${JSON.stringify(listening_data.followed_shows || [], null, 2)}

${feedback_history ? `Feedback on previous recommendations:\n${JSON.stringify(feedback_history, null, 2)}` : "No feedback history yet."}`;

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
            name: "save_taste_profile",
            description: "Save the analyzed taste profile",
            parameters: {
              type: "object",
              properties: {
                topics: { type: "array", items: { type: "string" } },
                preferred_formats: { type: "array", items: { type: "string" } },
                preferred_length: { type: "string" },
                tone_preferences: { type: "array", items: { type: "string" } },
                key_interests: { type: "array", items: { type: "string" } },
                avoid_topics: { type: "array", items: { type: "string" } },
                listening_patterns: { type: "object" },
                confidence_score: { type: "number" },
              },
              required: ["topics", "preferred_formats", "preferred_length", "tone_preferences", "key_interests", "confidence_score"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_taste_profile" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI analysis failed [${status}]`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const profileData = toolCall ? JSON.parse(toolCall.function.arguments) : {};

    // Upsert taste profile
    const { error: upsertError } = await supabase
      .from("taste_profiles")
      .upsert({
        user_id: user.id,
        profile_data: profileData,
        listening_history_snapshot: listening_data,
        analysis_count: analysisCount,
        last_analyzed_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) throw new Error(`Failed to save profile: ${upsertError.message}`);

    return new Response(JSON.stringify({ profile: profileData, analysis_count: analysisCount }), {
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
