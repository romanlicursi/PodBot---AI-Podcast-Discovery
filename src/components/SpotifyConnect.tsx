import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, Wifi, Loader2, Sparkles } from "lucide-react";

interface SpotifyConnectProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  onFetchData: () => void;
  isLoadingData: boolean;
}

export function SpotifyConnect({
  isConnected,
  isConnecting,
  onConnect,
  onFetchData,
  isLoadingData,
}: SpotifyConnectProps) {
  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <Wifi className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Spotify Connected</h3>
            <p className="text-muted-foreground text-sm">Ready to analyze your taste</p>
          </div>
        </div>
        <Button
          onClick={onFetchData}
          disabled={isLoadingData}
          className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
        >
          {isLoadingData ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching your podcasts...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Sync & Analyze Listening History</>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card border border-border rounded-2xl p-8 shadow-card text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-6">
        <Headphones className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        Connect Spotify
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Link your Spotify account so we can learn what podcasts you love and find new ones you'll enjoy.
      </p>
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        size="lg"
        className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-8"
      >
        {isConnecting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</>
        ) : (
          "Connect Spotify"
        )}
      </Button>
    </motion.div>
  );
}
