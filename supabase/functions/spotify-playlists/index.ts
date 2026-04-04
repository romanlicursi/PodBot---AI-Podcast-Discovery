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

  if (!tokenData) throw new Error("No Spotify connection found. Please reconnect Spotify with playlist permissions.");

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

  if (!refreshResponse.ok) {
    const errText = await refreshResponse.text();
    console.error("Token refresh failed:", errText);
    throw new Error("Spotify token refresh failed. Please reconnect Spotify.");
  }

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
    const { action, playlist_id, episode_uri } = await req.json();

    if (action === "get_playlists") {
      console.log("Fetching playlists for user:", user.id);
      const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Spotify playlists API error:", response.status, errBody);
        if (response.status === 403) {
          throw new Error("Playlist access denied. Please reconnect Spotify to grant playlist permissions.");
        }
        throw new Error(`Failed to fetch playlists (${response.status})`);
      }

      const data = await response.json();
      const playlists = (data.items || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image_url: p.images?.[0]?.url,
        track_count: p.tracks?.total || 0,
        is_collaborative: p.collaborative,
        owner: p.owner?.display_name,
      }));

      return new Response(JSON.stringify({ playlists }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_to_playlist") {
      if (!playlist_id || !episode_uri) {
        throw new Error("playlist_id and episode_uri are required");
      }

      console.log("Adding to playlist:", playlist_id, "uri:", episode_uri);
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [episode_uri] }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Add to playlist failed:", response.status, errText);
        throw new Error(`Failed to add to playlist (${response.status})`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("spotify-playlists error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
