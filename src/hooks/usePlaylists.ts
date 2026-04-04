import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Playlist {
  id: string;
  name: string;
  category: string;
  items?: PlaylistItem[];
}

export interface PlaylistItem {
  id: string;
  playlist_id: string;
  episode_name: string;
  show_name: string;
  episode_description?: string | null;
  external_url?: string | null;
  image_url?: string | null;
  reason?: string | null;
  position: number;
  listened: boolean;
  created_at: string;
}

const DEFAULT_PLAYLISTS = [
  { name: "Philosophy", category: "philosophy" },
  { name: "Literature", category: "literature" },
  { name: "Comedy", category: "comedy" },
];

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initPlaylists = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Check existing playlists
    const { data: existing } = await supabase
      .from("playlist_queues")
      .select("*")
      .eq("user_id", session.user.id);

    if (!existing || existing.length === 0) {
      // Create default playlists
      const toInsert = DEFAULT_PLAYLISTS.map((p) => ({
        user_id: session.user.id,
        name: p.name,
        category: p.category,
      }));
      await supabase.from("playlist_queues").insert(toInsert);
    }
  }, []);

  const loadPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const { data: playlistData } = await supabase
        .from("playlist_queues")
        .select("*")
        .order("created_at");

      if (!playlistData) return;

      // Load items for each playlist
      const { data: items } = await supabase
        .from("playlist_items")
        .select("*")
        .order("position");

      const mapped = playlistData.map((p: any) => ({
        ...p,
        items: (items || []).filter((i: any) => i.playlist_id === p.id),
      }));

      setPlaylists(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToPlaylist = useCallback(async (
    playlistId: string,
    episode: {
      episode_name: string;
      show_name: string;
      episode_description?: string | null;
      external_url?: string | null;
      image_url?: string | null;
      reason?: string | null;
      recommendation_id?: string;
    }
  ) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get current max position
    const { data: existing } = await supabase
      .from("playlist_items")
      .select("position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: false })
      .limit(1);

    const nextPos = existing && existing.length > 0 ? (existing[0] as any).position + 1 : 0;

    const { error } = await supabase.from("playlist_items").insert({
      playlist_id: playlistId,
      user_id: session.user.id,
      episode_name: episode.episode_name,
      show_name: episode.show_name,
      episode_description: episode.episode_description || null,
      external_url: episode.external_url || null,
      image_url: episode.image_url || null,
      reason: episode.reason || null,
      source_recommendation_id: episode.recommendation_id || null,
      position: nextPos,
    });

    if (error) {
      toast({ title: "Failed to add", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added to playlist!" });
      await loadPlaylists();
    }
  }, [toast, loadPlaylists]);

  const removeFromPlaylist = useCallback(async (itemId: string) => {
    await supabase.from("playlist_items").delete().eq("id", itemId);
    await loadPlaylists();
  }, [loadPlaylists]);

  const markListened = useCallback(async (itemId: string) => {
    await supabase.from("playlist_items").update({ listened: true }).eq("id", itemId);
    await loadPlaylists();
  }, [loadPlaylists]);

  useEffect(() => {
    initPlaylists().then(loadPlaylists);
  }, [initPlaylists, loadPlaylists]);

  return { playlists, loading, addToPlaylist, removeFromPlaylist, markListened, loadPlaylists };
}
