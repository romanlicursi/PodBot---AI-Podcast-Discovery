import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Laugh, Brain, Check, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Playlist, PlaylistItem } from "@/hooks/usePlaylists";

const CATEGORY_ICONS: Record<string, any> = {
  philosophy: Brain,
  literature: BookOpen,
  comedy: Laugh,
};

const CATEGORY_COLORS: Record<string, string> = {
  philosophy: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
  literature: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  comedy: "from-rose-500/20 to-rose-600/10 border-rose-500/30",
};

interface PlaylistViewProps {
  playlists: Playlist[];
  onRemove: (itemId: string) => void;
  onMarkListened: (itemId: string) => void;
}

export function PlaylistView({ playlists, onRemove, onMarkListened }: PlaylistViewProps) {
  const [expanded, setExpanded] = useState<string | null>(playlists[0]?.id || null);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground">Your Podcast Queues</h2>
      {playlists.map((playlist) => {
        const Icon = CATEGORY_ICONS[playlist.category] || BookOpen;
        const colors = CATEGORY_COLORS[playlist.category] || "from-primary/20 to-primary/10 border-primary/30";
        const isOpen = expanded === playlist.id;
        const unlistened = (playlist.items || []).filter((i) => !i.listened).length;

        return (
          <motion.div
            key={playlist.id}
            layout
            className={`bg-gradient-to-br ${colors} border rounded-2xl overflow-hidden`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : playlist.id)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-foreground" />
                <span className="font-display font-semibold text-foreground">{playlist.name}</span>
                {unlistened > 0 && (
                  <Badge variant="secondary" className="text-xs">{unlistened} queued</Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {(!playlist.items || playlist.items.length === 0) ? (
                      <p className="text-muted-foreground text-sm py-4 text-center">
                        No episodes queued yet. Save recommendations here!
                      </p>
                    ) : (
                      playlist.items.map((item) => (
                        <PlaylistItemCard
                          key={item.id}
                          item={item}
                          onRemove={onRemove}
                          onMarkListened={onMarkListened}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function PlaylistItemCard({
  item,
  onRemove,
  onMarkListened,
}: {
  item: PlaylistItem;
  onRemove: (id: string) => void;
  onMarkListened: (id: string) => void;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border ${item.listened ? "opacity-50" : ""}`}>
      <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-foreground truncate ${item.listened ? "line-through" : ""}`}>
          {item.episode_name}
        </p>
        <p className="text-xs text-muted-foreground truncate">{item.show_name}</p>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {!item.listened && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary" onClick={() => onMarkListened(item.id)}>
            <Check className="w-3.5 h-3.5" />
          </Button>
        )}
        {item.external_url && (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        )}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => onRemove(item.id)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
