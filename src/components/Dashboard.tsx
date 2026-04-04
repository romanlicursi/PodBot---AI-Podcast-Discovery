import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, LogOut, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotifyConnect } from "@/components/SpotifyConnect";
import { RecommendationCard } from "@/components/RecommendationCard";
import { TasteProfileView } from "@/components/TasteProfileView";
import { useSpotify } from "@/hooks/useSpotify";
import { useRecommendations } from "@/hooks/useRecommendations";

interface DashboardProps {
  onSignOut: () => void;
}

export function Dashboard({ onSignOut }: DashboardProps) {
  const {
    isConnected,
    isConnecting,
    listeningData,
    isLoadingData,
    checkConnection,
    connectSpotify,
    fetchListeningData,
  } = useSpotify();

  const {
    recommendations,
    tasteProfile,
    isAnalyzing,
    isGenerating,
    analyzeTaste,
    generateRecommendations,
    loadExistingRecommendations,
    loadTasteProfile,
    submitFeedback,
  } = useRecommendations();

  const [step, setStep] = useState<"connect" | "analyze" | "recommend">("connect");

  useEffect(() => {
    checkConnection();
    loadExistingRecommendations();
    loadTasteProfile();
  }, [checkConnection, loadExistingRecommendations, loadTasteProfile]);

  useEffect(() => {
    if (isConnected) setStep("analyze");
    if (tasteProfile) setStep("recommend");
  }, [isConnected, tasteProfile]);

  const handleFetchAndAnalyze = async () => {
    const data = await fetchListeningData();
    if (data) {
      await analyzeTaste(data);
      setStep("recommend");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Headphones className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Pod<span className="text-gradient-gold">Sense</span>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Spotify Connection */}
        {step === "connect" && !isConnected && (
          <SpotifyConnect
            isConnected={isConnected}
            isConnecting={isConnecting}
            onConnect={connectSpotify}
            onFetchData={handleFetchAndAnalyze}
            isLoadingData={isLoadingData}
          />
        )}

        {/* Connected - Show sync button */}
        {isConnected && (
          <SpotifyConnect
            isConnected={isConnected}
            isConnecting={isConnecting}
            onConnect={connectSpotify}
            onFetchData={handleFetchAndAnalyze}
            isLoadingData={isLoadingData || isAnalyzing}
          />
        )}

        {/* Analyzing state */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-foreground font-display font-semibold">Analyzing your podcast taste...</p>
            <p className="text-muted-foreground text-sm mt-1">Our AI is learning what you love</p>
          </motion.div>
        )}

        {/* Taste Profile */}
        {tasteProfile && <TasteProfileView profile={tasteProfile} />}

        {/* Generate Recommendations */}
        {tasteProfile && (
          <div className="flex justify-center">
            <Button
              onClick={generateRecommendations}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-8 shadow-glow"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Curating episodes...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Get Fresh Recommendations</>
              )}
            </Button>
          </div>
        )}

        {/* Generating state */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <p className="text-muted-foreground text-sm">Finding episodes you'll love...</p>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Your Recommendations
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="text-muted-foreground"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec, i) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onFeedback={submitFeedback}
                  index={i}
                />
              ))}
            </div>
            <p className="text-center text-muted-foreground text-xs mt-6">
              👆 Your feedback helps the algorithm learn — keep rating to get better picks!
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isConnected && recommendations.length === 0 && !isAnalyzing && !isGenerating && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Connect your Spotify to get started with personalized podcast recommendations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
