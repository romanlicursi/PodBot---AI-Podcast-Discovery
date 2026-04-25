import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones, LogOut, RefreshCw, Loader2, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecommendationCard } from "@/components/RecommendationCard";
import { TasteProfileView } from "@/components/TasteProfileView";
import { toast } from "sonner";
import { DEMO_RECOMMENDATIONS, DEMO_TASTE_PROFILE } from "@/lib/demoData";

interface DemoDashboardProps {
  onExit: () => void;
}

export function DemoDashboard({ onExit }: DemoDashboardProps) {
  const [recommendations, setRecommendations] = useState(DEMO_RECOMMENDATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecommendations([...DEMO_RECOMMENDATIONS].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
      toast.success("Fresh recommendations curated", {
        description: "In demo mode, refreshes shuffle a sample set. Sign up to get real picks.",
      });
    }, 1200);
  };

  const handleFeedback = (_id: string, type: "liked" | "disliked" | "saved") => {
    toast.success(
      type === "liked" ? "Marked as liked" : type === "disliked" ? "Marked as not for you" : "Saved",
      { description: "Sign up and connect Spotify to make feedback shape your real recommendations." },
    );
  };

  const handleSaveToPlaylist = () => {
    toast("Save to Spotify playlist", {
      description: "Available once you sign up and connect your Spotify account.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero noise relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/4 blur-3xl pointer-events-none" />

      <header className="glass-strong sticky top-0 z-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow">
              <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-base sm:text-lg text-foreground">
              Pod<span className="text-gradient-gold">Bot</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground btn-press h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1.5 text-sm">Exit demo</span>
          </Button>
        </div>
      </header>

      {/* Demo banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
            <p className="text-xs sm:text-sm text-foreground truncate">
              <span className="font-semibold">Demo mode.</span>{" "}
              <span className="text-muted-foreground">Sample data. Sign up for real recommendations.</span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={onExit}
            className="bg-gradient-gold text-primary-foreground hover:opacity-90 text-xs sm:text-sm h-7 sm:h-8 px-3 sm:px-4 btn-press flex-shrink-0"
          >
            Sign up
          </Button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 sm:p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">Sample listener profile</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                This is what your dashboard looks like after PodBot analyzes your real listening history.
              </p>
            </div>
          </div>
        </motion.div>

        <TasteProfileView profile={DEMO_TASTE_PROFILE} />

        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground tracking-tight">
              Your Recommendations
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-foreground btn-press text-xs sm:text-sm"
            >
              {isRefreshing ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              )}
              Refresh
            </Button>
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {recommendations.map((rec, i) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                onFeedback={handleFeedback}
                onSaveToPlaylist={handleSaveToPlaylist}
                index={i}
              />
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs mt-6 sm:mt-8 tracking-wide px-4">
            Like the experience? Sign up to get personalized picks from your actual Spotify history.
          </p>
        </div>
      </main>
    </div>
  );
}
