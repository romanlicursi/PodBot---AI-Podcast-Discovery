import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Brain, BarChart3, Sparkles, ChevronRight, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingWalkthroughProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Headphones,
    title: "Your Podcast DNA",
    subtitle: "We decode your listening patterns",
    description: "PodBot connects to your Spotify and analyzes every podcast episode you have ever played. Not just what you follow, but what you actually finish.",
    visual: "dna",
  },
  {
    icon: Brain,
    title: "Completion Intelligence",
    subtitle: "We know what you really love",
    description: "An episode you finished 100%? That is a strong signal. One you abandoned after 3 minutes? We learn from that too. Your completion patterns reveal your true taste, far better than likes or follows ever could.",
    visual: "completion",
  },
  {
    icon: TrendingUp,
    title: "Always Learning",
    subtitle: "Gets smarter with every interaction",
    description: "Rate recommendations, save episodes to your Spotify playlists, and keep listening. Every signal feeds back into your taste profile. The algorithm evolves with you.",
    visual: "learning",
  },
  {
    icon: Sparkles,
    title: "Ready to Discover",
    subtitle: "Sync and analyze your listening history",
    description: "Connect your Spotify and let PodBot decode your podcast DNA. You will get personalized recommendations powered by AI that truly understands what you love.",
    visual: "ready",
  },
];

function DNAVisual() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-primary"
          style={{ boxShadow: "0 0 12px hsl(17 88% 56% / 0.5)" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            x: Math.sin((i / 12) * Math.PI * 2) * 60,
            y: Math.cos((i / 12) * Math.PI * 2) * 40 + Math.sin(Date.now() / 1000 + i) * 10,
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px"
          style={{
            width: "120px",
            rotate: `${i * 30}deg`,
            background: "linear-gradient(90deg, transparent, hsl(17 88% 56% / 0.3), transparent)",
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      <motion.div
        className="absolute w-20 h-20 rounded-full border-2 border-primary/20"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-primary/10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  );
}

function CompletionVisual() {
  const bars = [
    { label: "Loved it", pct: 95, gradient: "from-primary to-primary/70" },
    { label: "Enjoyed", pct: 72, gradient: "from-primary/60 to-primary/40" },
    { label: "Meh", pct: 35, gradient: "from-muted-foreground/40 to-muted-foreground/20" },
    { label: "Skipped", pct: 8, gradient: "from-destructive/50 to-destructive/30" },
  ];
  return (
    <div className="w-full max-w-xs mx-auto space-y-4 py-6">
      {bars.map((bar, i) => (
        <div key={bar.label} className="space-y-1.5">
          <div className="flex justify-between text-xs tracking-wide">
            <span className="text-muted-foreground uppercase font-medium">{bar.label}</span>
            <span className="text-foreground font-semibold">{bar.pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${bar.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LearningVisual() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center">
      {[
        { icon: "👍", x: -50, y: -30, delay: 0 },
        { icon: "🎧", x: 50, y: -20, delay: 0.3 },
        { icon: "💾", x: -30, y: 30, delay: 0.6 },
        { icon: "⏱", x: 40, y: 40, delay: 0.9 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ opacity: 0, scale: 0, x: item.x, y: item.y }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.8],
            x: [item.x, item.x, 0, 0],
            y: [item.y, item.y, 0, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center z-10 shadow-glow"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Brain className="w-8 h-8 text-primary-foreground" />
      </motion.div>
    </div>
  );
}

function ReadyVisual() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center">
      <motion.div
        className="absolute w-44 h-44 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(17 88% 56% / 0.15), transparent)" }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-28 h-28 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(17 88% 56% / 0.08), transparent)" }}
        animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </motion.div>
    </div>
  );
}

const visuals: Record<string, () => JSX.Element> = {
  dna: DNAVisual,
  completion: CompletionVisual,
  learning: LearningVisual,
  ready: ReadyVisual,
};

export function OnboardingWalkthrough({ onComplete }: OnboardingWalkthroughProps) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;
  const Visual = visuals[slide.visual];

  return (
    <div className="min-h-screen bg-gradient-hero noise flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/3 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center relative z-10"
        >
          <Visual />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-display font-bold text-foreground mt-8 mb-2">
              {slide.title}
            </h1>
            <p className="text-primary font-medium text-sm mb-4 tracking-wide">{slide.subtitle}</p>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto text-[15px]">
              {slide.description}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2.5 mt-12 mb-8 relative z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary shadow-glow" : "w-2 bg-secondary hover:bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3 relative z-10">
        {!isLast ? (
          <>
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-muted-foreground text-sm btn-press"
            >
              Skip
            </Button>
            <Button
              onClick={() => setCurrent(current + 1)}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-6 shadow-glow btn-press"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </>
        ) : (
          <Button
            onClick={onComplete}
            size="lg"
            className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold px-8 shadow-glow btn-press"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Sync and Analyze Listening History
          </Button>
        )}
      </div>
    </div>
  );
}
