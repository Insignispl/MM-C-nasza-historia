ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS kiosk_countdown_seconds integer NOT NULL DEFAULT 3 CHECK (kiosk_countdown_seconds BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS kiosk_burst_count integer NOT NULL DEFAULT 1 CHECK (kiosk_burst_count BETWEEN 1 AND 3),
  ADD COLUMN IF NOT EXISTS kiosk_frame_style text NOT NULL DEFAULT 'classic' CHECK (kiosk_frame_style IN ('classic', 'film', 'neon', 'minimal')),
  ADD COLUMN IF NOT EXISTS guest_reactions_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE public.event_media
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'guest' CHECK (source IN ('guest', 'kiosk', 'photographer')),
  ADD COLUMN IF NOT EXISTS moment_label text;

CREATE TABLE IF NOT EXISTS public.event_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK (emoji IN ('❤️', '🥂', '😂', '🔥', '👏')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_reactions_event_emoji_idx ON public.event_reactions(event_id, emoji);

ALTER TABLE public.event_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests view reactions for live events" ON public.event_reactions
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.events
    WHERE id = event_id AND public_access_enabled AND status = 'live'
  ));

CREATE POLICY "Guests add reactions for live events" ON public.event_reactions
  FOR INSERT TO anon
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.events
    WHERE id = event_id AND public_access_enabled AND status = 'live' AND guest_reactions_enabled
  ));

CREATE POLICY "Members manage event reactions" ON public.event_reactions
  FOR ALL TO authenticated
  USING (public.event_is_managed(event_id))
  WITH CHECK (public.event_is_managed(event_id));
