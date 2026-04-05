import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, ExternalLink, Sparkles, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  episode_id?: string | null;
}

interface RecommendationCardProps {
  rec: Recommendation;
  onFeedback: (id: string, feedback: "liked" | "disliked" | "saved") => void;
  onSaveToPlaylist: (rec: Recommendation) => void;
  index: number;
}

function buildApplePodcastsUrl(episodeName: string, showName: string) {
  const q = encodeURIComponent(`${showName} ${episodeName}`);
  return `https://podcasts.apple.com/search?term=${q}`;
}

export function RecommendationCard({ rec, onFeedback, onSaveToPlaylist, index }: RecommendationCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = (type: "liked" | "disliked" | "saved") => {
    setFeedback(type);
    onFeedback(rec.id, type);
  };

  const applePodcastsUrl = buildApplePodcastsUrl(rec.episode_name, rec.show_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-2xl p-4 sm:p-5 shadow-card hover-lift group"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-secondary/50 flex-shrink-0 flex items-center justify-center overflow-hidden ring-1 ring-border">
          {rec.image_url ? (
            <img src={rec.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground text-sm sm:text-base line-clamp-2 leading-snug">{rec.episode_name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">{rec.show_name}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {rec.is_new_show && (
              <Badge variant="outline" className="border-accent/50 text-accent text-[10px] sm:text-xs tracking-wide">New</Badge>
            )}
            {rec.score && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs bg-primary/10 text-primary border-0">{Math.round(rec.score * 100)}%</Badge>
            )}
          </div>
        </div>
      </div>

      {rec.reason && (
        <p className="text-xs sm:text-sm text-secondary-foreground mt-3 leading-relaxed line-clamp-3">
          {rec.reason}
        </p>
      )}

      {rec.episode_description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {rec.episode_description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-border/50">
        <div className="flex gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback("liked")}
            className={`h-8 w-8 p-0 btn-press ${feedback === "liked" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"}`}
          >
            <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback("disliked")}
            className={`h-8 w-8 p-0 btn-press ${feedback === "disliked" ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive"}`}
          >
            <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSaveToPlaylist(rec)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-accent btn-press"
            title="Save to Spotify playlist"
          >
            <FolderPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={applePodcastsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors text-[10px] sm:text-xs font-medium flex items-center gap-1"
            title="Find on Apple Podcasts"
          >
            🎧 <span className="hidden sm:inline">Apple</span>
          </a>
          {rec.external_url && (
            <a
              href={rec.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Open on Spotify"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
