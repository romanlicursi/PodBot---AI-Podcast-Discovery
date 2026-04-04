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
      className="glass rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground tracking-tight">Your Taste DNA</h3>
          <p className="text-muted-foreground text-sm">
            Confidence: {Math.round((profile.confidence_score || 0) * 100)}%
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {profile.topics?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground tracking-wide uppercase">Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.topics.slice(0, 8).map((topic: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">{topic}</Badge>
              ))}
            </div>
          </div>
        )}

        {profile.preferred_formats?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Music className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground tracking-wide uppercase">Preferred Formats</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.preferred_formats.map((f: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs border-accent/30 text-accent">{f}</Badge>
              ))}
            </div>
          </div>
        )}

        {profile.preferred_length && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground tracking-wide uppercase">Preferred Length</span>
            </div>
            <p className="text-sm text-secondary-foreground">{profile.preferred_length}</p>
          </div>
        )}

        {profile.key_interests?.length > 0 && (
          <div>
            <span className="text-sm font-medium text-foreground block mb-2.5 tracking-wide uppercase">Key Interests</span>
            <div className="flex flex-wrap gap-2">
              {profile.key_interests.slice(0, 6).map((interest: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs bg-accent/10 text-accent border-0">{interest}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
