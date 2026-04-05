import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, LogOut, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotifyConnect } from "@/components/SpotifyConnect";
import { RecommendationCard } from "@/components/RecommendationCard";
import { TasteProfileView } from "@/components/TasteProfileView";
import { SaveToPlaylistDialog } from "@/components/SaveToPlaylistDialog";
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
    disconnectSpotify,
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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<any>(null);

  useEffect(() => {
    checkConnection();
    loadExistingRecommendations();
    loadTasteProfile();
  }, [checkConnection, loadExistingRecommendations, loadTasteProfile]);

  useEffect(() => {
    if (!isConnected) setStep("connect");
    else if (tasteProfile) setStep("recommend");
    else setStep("analyze");
  }, [isConnected, tasteProfile]);

  const handleFetchAndAnalyze = async () => {
    const data = await fetchListeningData();
    if (data) {
      await analyzeTaste(data);
      setStep("recommend");
    }
  };

  const handleSaveToPlaylist = (rec: any) => {
    setSelectedRec(rec);
    setSaveDialogOpen(true);
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
          <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground hover:text-foreground btn-press h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1.5 text-sm">Sign out</span>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10 relative z-10">
        {step === "connect" && !isConnected && (
          <SpotifyConnect
            isConnected={isConnected}
            isConnecting={isConnecting}
            onConnect={connectSpotify}
            onDisconnect={disconnectSpotify}
            onFetchData={handleFetchAndAnalyze}
            isLoadingData={isLoadingData}
          />
        )}

        {isConnected && (
          <SpotifyConnect
            isConnected={isConnected}
            isConnecting={isConnecting}
            onConnect={connectSpotify}
            onDisconnect={disconnectSpotify}
            onFetchData={handleFetchAndAnalyze}
            isLoadingData={isLoadingData || isAnalyzing}
          />
        )}

        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 sm:py-12">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{ height: ["4px", "20px", "4px"] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <p className="text-foreground font-display font-semibold text-base sm:text-lg">Analyzing your podcast taste...</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Weighing episode completions and learning your patterns
            </p>
          </motion.div>
        )}

        {tasteProfile && <TasteProfileView profile={tasteProfile} />}

        {tasteProfile && (
          <div className="flex justify-center px-4">
            <Button
              onClick={generateRecommendations}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-6 sm:px-8 shadow-glow btn-press w-full sm:w-auto text-sm sm:text-base"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Curating episodes...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Get Fresh Recommendations</>
              )}
            </Button>
          </div>
        )}

        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 sm:py-6">
            <p className="text-muted-foreground text-xs sm:text-sm">Finding episodes you will love...</p>
          </motion.div>
        )}

        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground tracking-tight">Your Recommendations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="text-muted-foreground hover:text-foreground btn-press text-xs sm:text-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 ${isGenerating ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {recommendations.map((rec, i) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onFeedback={submitFeedback}
                  onSaveToPlaylist={handleSaveToPlaylist}
                  index={i}
                />
              ))}
            </div>
            <p className="text-center text-muted-foreground text-xs mt-6 sm:mt-8 tracking-wide px-4">
              Rate episodes and save to Spotify playlists. The algorithm learns from every interaction!
            </p>
          </div>
        )}

        {!isConnected && recommendations.length === 0 && !isAnalyzing && !isGenerating && (
          <div className="text-center py-12 sm:py-16 px-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              Connect your Spotify to get started with personalized podcast recommendations.
            </p>
          </div>
        )}
      </main>

      <SaveToPlaylistDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        episode={selectedRec ? {
          id: selectedRec.id,
          episode_name: selectedRec.episode_name,
          show_name: selectedRec.show_name,
          episode_id: selectedRec.episode_id,
        } : null}
      />
    </div>
  );
}
