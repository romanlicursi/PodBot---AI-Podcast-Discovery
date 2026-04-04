import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Clock, Music } from "lucide-react";

interface TasteProfileViewProps {
  profile: any;
}

export function TasteProfileView({ profile }: TasteProfileViewProps) {
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Your Taste DNA</h3>
          <p className="text-muted-foreground text-sm">
            Confidence: {Math.round((profile.confidence_score || 0) * 100)}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {profile.topics?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Topics</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.topics.slice(0, 8).map((topic: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
              ))}
            </div>
          </div>
        )}

        {profile.preferred_formats?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Preferred Formats</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferred_formats.map((f: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs border-primary/30 text-primary">{f}</Badge>
              ))}
            </div>
          </div>
        )}

        {profile.preferred_length && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Preferred Length</span>
            </div>
            <p className="text-sm text-secondary-foreground">{profile.preferred_length}</p>
          </div>
        )}

        {profile.key_interests?.length > 0 && (
          <div>
            <span className="text-sm font-medium text-foreground block mb-2">Key Interests</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.key_interests.slice(0, 6).map((interest: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">{interest}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
