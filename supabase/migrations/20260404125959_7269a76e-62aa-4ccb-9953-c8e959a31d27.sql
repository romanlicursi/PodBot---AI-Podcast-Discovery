
-- Playlist queues table
CREATE TABLE public.playlist_queues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

ALTER TABLE public.playlist_queues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own playlists"
  ON public.playlist_queues FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Playlist items (episodes saved to a playlist)
CREATE TABLE public.playlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlist_queues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  episode_name TEXT NOT NULL,
  show_name TEXT NOT NULL,
  episode_description TEXT,
  external_url TEXT,
  image_url TEXT,
  reason TEXT,
  source_recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE SET NULL,
  position INTEGER NOT NULL DEFAULT 0,
  listened BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own playlist items"
  ON public.playlist_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Episode completion tracking
CREATE TABLE public.episode_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  episode_name TEXT NOT NULL,
  show_name TEXT NOT NULL,
  episode_id TEXT,
  duration_ms INTEGER,
  progress_ms INTEGER,
  completion_pct REAL NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  last_played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_name, show_name)
);

ALTER TABLE public.episode_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own completions"
  ON public.episode_completions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at on playlist_queues
CREATE TRIGGER update_playlist_queues_updated_at
  BEFORE UPDATE ON public.playlist_queues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
