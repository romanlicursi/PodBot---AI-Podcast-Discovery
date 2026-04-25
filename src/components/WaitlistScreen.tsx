import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Mail, Loader2, Eye, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistScreenProps {
  onTryDemo: () => void;
}

export function WaitlistScreen({ onTryDemo }: WaitlistScreenProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 255) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase
      .from("waitlist")
      .insert({ email: trimmed });
    setLoading(false);

    if (insertError) {
      // Unique violation = already on the list, which we treat as success
      if (insertError.code === "23505") {
        setJoined(true);
        return;
      }
      setError("Something went wrong. Please try again.");
      return;
    }
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero noise flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 -left-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-primary/3 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-7 sm:mb-9">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-gold shadow-glow mb-4 sm:mb-6"
          >
            <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
          </motion.div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-primary font-semibold">
              Private Beta
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Pod<span className="text-gradient-gold">Bot</span> is in beta
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base px-2">
            Spotify limits us to a small group of testers right now. Join the waitlist and we'll let you in as soon as we open up access.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-5 sm:p-6 shadow-card">
          {joined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 mb-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-1">
                You're on the list
              </h2>
              <p className="text-muted-foreground text-sm">
                We'll email <span className="text-foreground font-medium">{email.trim().toLowerCase()}</span> the moment public access opens.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border h-11 sm:h-12 focus:border-primary/50 transition-colors text-sm sm:text-base"
                  required
                  maxLength={255}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 bg-gradient-gold text-primary-foreground font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity shadow-glow btn-press"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join the waitlist"}
              </Button>
              <p className="text-center text-muted-foreground text-[11px] sm:text-xs px-2">
                No spam. One email when it's your turn.
              </p>
            </form>
          )}
        </div>

        <div className="flex items-center gap-3 mt-6 sm:mt-7">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button
          onClick={onTryDemo}
          className="w-full mt-4 sm:mt-5 h-11 sm:h-12 rounded-md border border-border bg-secondary/30 hover:bg-secondary/60 text-foreground text-sm sm:text-base font-medium transition-colors btn-press flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          See a demo of the app
        </button>
        <p className="text-center text-muted-foreground text-xs mt-2 px-2">
          A read-only preview with sample data. No signup, no Spotify needed.
        </p>
      </motion.div>
    </div>
  );
}
