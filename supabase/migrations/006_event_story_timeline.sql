CREATE TABLE public.event_story_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  chapter_type text NOT NULL DEFAULT 'custom',
  sort_order integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_media
  ADD COLUMN chapter_id uuid REFERENCES public.event_story_chapters(id) ON DELETE SET NULL;

CREATE INDEX event_story_chapters_event_order_idx
  ON public.event_story_chapters(event_id, sort_order, created_at);

CREATE INDEX event_media_chapter_idx ON public.event_media(chapter_id);

ALTER TABLE public.event_story_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members manage story chapters"
  ON public.event_story_chapters FOR ALL TO authenticated
  USING (public.event_is_managed(event_id))
  WITH CHECK (public.event_is_managed(event_id));

CREATE POLICY "Guests view public story chapters"
  ON public.event_story_chapters FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = event_id
        AND public_access_enabled
        AND status = 'live'
    )
  );
