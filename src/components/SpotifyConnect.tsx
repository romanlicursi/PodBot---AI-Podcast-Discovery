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
  onDisconnect,
  onFetchData,
  isLoadingData,
}: SpotifyConnectProps) {
  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-4 sm:p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">Spotify Connected</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">Ready to analyze your taste</p>
          </div>
        </div>
        <Button
          onClick={onFetchData}
          disabled={isLoadingData}
          className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow btn-press text-sm sm:text-base h-10 sm:h-11"
        >
          {isLoadingData ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching your podcasts...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Sync & Analyze Listening History</>
          )}
        </Button>
        {onDisconnect && (
          <Button
            onClick={onDisconnect}
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground text-xs btn-press"
          >
            Disconnect & Reconnect Spotify
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 sm:p-10 shadow-card text-center"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-4 sm:mb-6 animate-float">
        <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
      </div>
      <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2 tracking-tight">
        Connect Spotify
      </h2>
      <p className="text-muted-foreground mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
        Link your Spotify account so we can learn what podcasts you love and find new ones you will enjoy.
      </p>
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        size="lg"
        className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-6 sm:px-8 shadow-glow btn-press w-full sm:w-auto"
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
