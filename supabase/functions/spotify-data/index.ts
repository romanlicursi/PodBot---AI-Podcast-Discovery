import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getValidToken(supabase: any, userId: string, clientId: string, clientSecret: string) {
  const { data: tokenData } = await supabase
    .from("spotify_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!tokenData) throw new Error("No Spotify connection found");

  if (new Date(tokenData.expires_at) > new Date()) {
    return tokenData.access_token;
  }

  const refreshResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokenData.refresh_token,
    }),
  });

  const newTokens = await refreshResponse.json();
  const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString();

  await supabase
    .from("spotify_tokens")
    .update({
      access_token: newTokens.access_token,
      expires_at: expiresAt,
      ...(newTokens.refresh_token && { refresh_token: newTokens.refresh_token }),
    })
    .eq("user_id", userId);

  return newTokens.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID")!;
    const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) throw new Error("Invalid user");

    const accessToken = await getValidToken(supabase, user.id, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

    // Fetch recently played episodes
    const recentlyPlayed = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50&type=episode",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Fetch user's saved shows
    const savedShows = await fetch(
      "https://api.spotify.com/v1/me/shows?limit=50",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const recentData = recentlyPlayed.ok ? await recentlyPlayed.json() : { items: [] };
    const showsData = savedShows.ok ? await savedShows.json() : { items: [] };

    // Filter for podcast episodes and extract completion data
    const podcastHistory = (recentData.items || [])
      .filter((item: any) => item.track?.type === "episode")
      .map((item: any) => {
        const durationMs = item.track.duration_ms || 0;
        const resumePointMs = item.track.resume_point?.resume_position_ms || 0;
        const fullyPlayed = item.track.resume_point?.fully_played || false;
        const completionPct = fullyPlayed ? 1.0 : (durationMs > 0 ? resumePointMs / durationMs : 0);

        return {
          episode_name: item.track.name,
          show_name: item.track.show?.name || "Unknown Show",
          show_id: item.track.show?.id,
          episode_id: item.track.id,
          description: item.track.description?.substring(0, 300),
          played_at: item.played_at,
          duration_ms: durationMs,
          resume_position_ms: resumePointMs,
          fully_played: fullyPlayed,
          completion_pct: Math.round(completionPct * 100) / 100,
          image_url: item.track.images?.[0]?.url || item.track.show?.images?.[0]?.url,
        };
      });

    // Save completion data to episode_completions table
    for (const ep of podcastHistory) {
      await supabase
        .from("episode_completions")
        .upsert({
          user_id: user.id,
          episode_name: ep.episode_name,
          show_name: ep.show_name,
          episode_id: ep.episode_id,
          duration_ms: ep.duration_ms,
          progress_ms: ep.resume_position_ms,
          completion_pct: ep.completion_pct,
          last_played_at: ep.played_at,
        }, { onConflict: "user_id,episode_name,show_name" });
    }

    const followedShows = (showsData.items || []).map((item: any) => ({
      name: item.show.name,
      id: item.show.id,
      description: item.show.description?.substring(0, 300),
      publisher: item.show.publisher,
      total_episodes: item.show.total_episodes,
      image_url: item.show.images?.[0]?.url,
      genres: item.show.genres || [],
    }));

    return new Response(JSON.stringify({
      recently_played: podcastHistory,
      followed_shows: followedShows,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
