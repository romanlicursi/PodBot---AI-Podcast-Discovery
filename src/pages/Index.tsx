import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "@/components/AuthScreen";
import { Dashboard } from "@/components/Dashboard";
import { DemoDashboard } from "@/components/DemoDashboard";
import { OnboardingWalkthrough } from "@/components/OnboardingWalkthrough";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { session, loading, signUp, signIn, signOut } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (demoMode && !session) {
    return (
      <DemoDashboard
        onExit={() => {
          setDemoMode(false);
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (!session) {
    if (showOnboarding) {
      return (
        <OnboardingWalkthrough
          onComplete={() => setShowOnboarding(false)}
          onTryDemo={() => setDemoMode(true)}
        />
      );
    }
    return (
      <AuthScreen
        onAuth={async (email, password, isSignUp) => {
          return isSignUp ? signUp(email, password) : signIn(email, password);
        }}
        onTryDemo={() => setDemoMode(true)}
      />
    );
  }

  return <Dashboard onSignOut={signOut} />;
};

export default Index;
