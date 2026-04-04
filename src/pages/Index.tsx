import { useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "@/components/AuthScreen";
import { Dashboard } from "@/components/Dashboard";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { session, loading, signUp, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <AuthScreen
        onAuth={async (email, password, isSignUp) => {
          return isSignUp ? signUp(email, password) : signIn(email, password);
        }}
      />
    );
  }

  return <Dashboard onSignOut={signOut} />;
};

export default Index;
