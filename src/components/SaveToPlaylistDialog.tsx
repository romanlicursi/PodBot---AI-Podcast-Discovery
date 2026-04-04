import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Loader2, CheckCircle2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  track_count: number;
  owner: string;
}

interface SaveToPlaylistDialogProps {
  open: boolean;
  onClose: () => void;
  episode: {
    id: string;
    episode_name: string;
    show_name: string;
    episode_id?: string | null;
  } | null;
}

export function SaveToPlaylistDialog({ open, onClose, episode }: SaveToPlaylistDialogProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchPlaylists();
      setSaved(null);
      setSearch("");
    }
  }, [open]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("spotify-playlists", {
        body: { action: "get_playlists" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlaylists(data.playlists || []);
    } catch (err: any) {
      const msg = err.message || "Unknown error";
      if (msg.includes("reconnect") || msg.includes("permission")) {
        toast({ title: "Reconnect Spotify needed", description: "Please disconnect and reconnect Spotify to grant playlist permissions.", variant: "destructive" });
      } else {
        toast({ title: "Failed to load playlists", description: msg, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlist: SpotifyPlaylist) => {
    if (!episode) return;
    setSaving(playlist.id);

    try {
      const episodeUri = episode.episode_id
        ? `spotify:episode:${episode.episode_id}`
        : null;

      if (!episodeUri) {
        toast({ title: "Can't add", description: "This episode doesn't have a Spotify ID to add.", variant: "destructive" });
        setSaving(null);
        return;
      }

      const { error } = await supabase.functions.invoke("spotify-playlists", {
        body: {
          action: "add_to_playlist",
          playlist_id: playlist.id,
          episode_uri: episodeUri,
        },
      });
      if (error) throw error;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("playlist_saves").insert({
          user_id: session.user.id,
          recommendation_id: episode.id,
          spotify_playlist_id: playlist.id,
          spotify_playlist_name: playlist.name,
          episode_name: episode.episode_name,
          show_name: episode.show_name,
        });
      }

      setSaved(playlist.id);
      toast({ title: `Added to "${playlist.name}"` });

      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      toast({ title: "Failed to add", description: err.message, variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const filtered = playlists.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-border max-w-sm max-h-[80vh] flex flex-col shadow-glow">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground tracking-tight">Add to Spotify Playlist</DialogTitle>
        </DialogHeader>

        {episode && (
          <p className="text-xs text-muted-foreground truncate -mt-1">
            {episode.episode_name} — {episode.show_name}
          </p>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary/50 border-border text-sm focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0 pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              {search ? "No playlists match your search" : "No playlists found"}
            </p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAddToPlaylist(p)}
                disabled={saving !== null}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all text-left disabled:opacity-50 group/item"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex-shrink-0 overflow-hidden flex items-center justify-center ring-1 ring-border">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover/item:text-primary transition-colors">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.track_count} tracks</p>
                </div>
                {saving === p.id && <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />}
                {saved === p.id && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
