import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [tasteProfile, setTasteProfile] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const analyzeTaste = useCallback(async (listeningData: any) => {
    setIsAnalyzing(true);
    try {
      // Get feedback history
      const { data: feedback } = await supabase
        .from("recommendation_feedback")
        .select("feedback, recommendation_id")
        .order("created_at", { ascending: false })
        .limit(50);

      const { data, error } = await supabase.functions.invoke("analyze-taste", {
        body: { listening_data: listeningData, feedback_history: feedback },
      });
      if (error) throw error;
      setTasteProfile(data.profile);
      toast({ title: "Taste profile updated!", description: `Analysis #${data.analysis_count} complete` });
      return data.profile;
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const generateRecommendations = useCallback(async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-recommendations");
      if (error) throw error;
      setRecommendations(data.recommendations || []);
      toast({ title: "Fresh recommendations ready!", description: `${data.recommendations?.length || 0} episodes curated for you` });
    } catch (err: any) {
      toast({ title: "Recommendation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const loadExistingRecommendations = useCallback(async () => {
    const { data } = await supabase
      .from("recommendations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setRecommendations(data);
  }, []);

  const loadTasteProfile = useCallback(async () => {
    const { data } = await supabase
      .from("taste_profiles")
      .select("profile_data")
      .maybeSingle();
    if (data) setTasteProfile(data.profile_data);
  }, []);

  const submitFeedback = useCallback(async (recommendationId: string, feedback: "liked" | "disliked" | "saved") => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("recommendation_feedback")
      .upsert({
        user_id: session.user.id,
        recommendation_id: recommendationId,
        feedback,
      }, { onConflict: "user_id,recommendation_id" });

    if (error) {
      toast({ title: "Feedback failed", description: error.message, variant: "destructive" });
    }
  }, [toast]);

  return {
    recommendations,
    tasteProfile,
    isAnalyzing,
    isGenerating,
    analyzeTaste,
    generateRecommendations,
    loadExistingRecommendations,
    loadTasteProfile,
    submitFeedback,
  };
}
