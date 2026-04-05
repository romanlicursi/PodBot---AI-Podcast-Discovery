import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Headphones, Mail, Lock, Loader2 } from "lucide-react";

interface AuthScreenProps {
  onAuth: (email: string, password: string, isSignUp: boolean) => Promise<{ error: any }>;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await onAuth(email, password, isSignUp);
    if (error) {
      setError(error.message);
    } else if (isSignUp) {
      setSuccess("Account created! You can now sign in.");
    }
    setLoading(false);
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
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-gold shadow-glow mb-4 sm:mb-6"
          >
            <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Pod<span className="text-gradient-gold">Bot</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            AI-powered podcast discovery
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-5 sm:p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-secondary/50 border-border h-11 sm:h-12 focus:border-primary/50 transition-colors text-sm sm:text-base"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-secondary/50 border-border h-11 sm:h-12 focus:border-primary/50 transition-colors text-sm sm:text-base"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm">{success}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 bg-gradient-gold text-primary-foreground font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity shadow-glow btn-press"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-5 sm:mt-6 text-muted-foreground text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
