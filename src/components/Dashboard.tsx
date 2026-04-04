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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-foreground font-display font-semibold">Analyzing your podcast taste...</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Weighing episode completions and learning your patterns
                </p>
              </motion.div>
            )}

            {tasteProfile && <TasteProfileView profile={tasteProfile} />}

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

            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <p className="text-muted-foreground text-sm">Finding episodes you'll love...</p>
              </motion.div>
            )}

            {recommendations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-foreground">Your Recommendations</h2>
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
                      onSaveToPlaylist={handleSaveToPlaylist}
                      index={i}
                    />
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-xs mt-6">
                  👆 Rate episodes & save to Spotify playlists — the algorithm learns from every interaction!
                </p>
              </div>
            )}

            {!isConnected && recommendations.length === 0 && !isAnalyzing && !isGenerating && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Connect your Spotify to get started with personalized podcast recommendations.
                </p>
              </div>
            )}
        </>
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
