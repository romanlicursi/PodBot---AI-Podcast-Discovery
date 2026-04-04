import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSpotify() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [listeningData, setListeningData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("spotify_tokens")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    setIsConnected(!!data);
  }, []);

  const connectSpotify = useCallback(async () => {
    setIsConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/callback`;
      const { data, error } = await supabase.functions.invoke("spotify-auth", {
        body: { action: "get_auth_url", redirect_uri: redirectUri },
      });
      if (error) throw error;
      window.location.href = data.auth_url;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setIsConnecting(false);
    }
  }, [toast]);

  const exchangeCode = useCallback(async (code: string) => {
    const redirectUri = `${window.location.origin}/callback`;
    const { error } = await supabase.functions.invoke("spotify-auth", {
      body: { action: "exchange_code", code, redirect_uri: redirectUri },
    });
    if (error) throw error;
    setIsConnected(true);
  }, []);

  const fetchListeningData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase.functions.invoke("spotify-data");
      if (error) throw error;
      setListeningData(data);
      return data;
    } catch (err: any) {
      toast({ title: "Error fetching data", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);

  return {
    isConnected,
    isConnecting,
    listeningData,
    isLoadingData,
    checkConnection,
    connectSpotify,
    exchangeCode,
    fetchListeningData,
  };
}
