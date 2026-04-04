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
        className="glass rounded-2xl p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
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
          className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow btn-press"
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
      className="glass rounded-2xl p-10 shadow-card text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 animate-float">
        <Headphones className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2 tracking-tight">
        Connect Spotify
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
        Link your Spotify account so we can learn what podcasts you love and find new ones you'll enjoy.
      </p>
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        size="lg"
        className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-8 shadow-glow btn-press"
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
