import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSpotify } from "@/hooks/useSpotify";
import { Loader2 } from "lucide-react";

export default function SpotifyCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeCode } = useSpotify();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      exchangeCode(code)
        .then(() => navigate("/dashboard", { replace: true }))
        .catch(() => navigate("/dashboard", { replace: true }));
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, exchangeCode, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Connecting your Spotify account...</p>
      </div>
    </div>
  );
}
