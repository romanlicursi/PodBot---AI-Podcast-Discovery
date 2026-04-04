import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Bookmark, ExternalLink, Sparkles, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Playlist } from "@/hooks/usePlaylists";

interface Recommendation {
  id: string;
  episode_name: string;
  episode_description?: string | null;
  show_name: string;
  reason?: string | null;
  is_new_show?: boolean | null;
  score?: number | null;
  external_url?: string | null;
  image_url?: string | null;
}

interface RecommendationCardProps {
  rec: Recommendation;
  onFeedback: (id: string, feedback: "liked" | "disliked" | "saved") => void;
  onSaveToPlaylist: (rec: Recommendation) => void;
  index: number;
}

export function RecommendationCard({ rec, onFeedback, onSaveToPlaylist, index }: RecommendationCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = (type: "liked" | "disliked" | "saved") => {
    setFeedback(type);
    onFeedback(rec.id, type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-gradient-card border border-border rounded-2xl p-5 shadow-card hover:shadow-glow transition-shadow duration-300 group"
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
          {rec.image_url ? (
            <img src={rec.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Sparkles className="w-6 h-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">{rec.episode_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{rec.show_name}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {rec.is_new_show && (
                <Badge variant="outline" className="border-primary text-primary text-xs">New Show</Badge>
              )}
              {rec.score && (
                <Badge variant="secondary" className="text-xs">{Math.round(rec.score * 100)}%</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {rec.reason && (
        <p className="text-sm text-secondary-foreground mt-3 leading-relaxed">
          {rec.reason}
        </p>
      )}

      {rec.episode_description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {rec.episode_description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback("liked")}
            className={`h-8 w-8 p-0 ${feedback === "liked" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback("disliked")}
            className={`h-8 w-8 p-0 ${feedback === "disliked" ? "text-destructive bg-destructive/10" : "text-muted-foreground"}`}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSaveToPlaylist(rec)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
            title="Save to queue"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>
        {rec.external_url && (
          <a
            href={rec.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
