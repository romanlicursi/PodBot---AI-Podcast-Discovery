import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero noise relative">
      <div className="text-center relative z-10 px-4">
        <h1 className="mb-3 text-6xl sm:text-7xl font-display font-bold text-gradient-gold">404</h1>
        <p className="mb-6 text-lg sm:text-xl text-muted-foreground">This page does not exist</p>
        <a href="/" className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow btn-press hover:opacity-90 transition-opacity">
          Back to PodBot
        </a>
      </div>
    </div>
  );
};

export default NotFound;
