
CREATE TABLE public.playlist_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE SET NULL,
  spotify_playlist_id TEXT NOT NULL,
  spotify_playlist_name TEXT NOT NULL,
  episode_name TEXT NOT NULL,
  show_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.playlist_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own playlist saves"
  ON public.playlist_saves FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
