CREATE OR REPLACE FUNCTION public.event_allows_guest_upload(target_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events
    WHERE id = target_event_id
      AND status = 'live'
      AND public_access_enabled
      AND allow_uploads
  );
$$;

CREATE POLICY "Guests submit event guestbook entries"
  ON public.event_guestbook_entries FOR INSERT TO anon
  WITH CHECK (public.event_allows_guest_upload(event_id));

CREATE POLICY "Guests submit event media"
  ON public.event_media FOR INSERT TO anon
  WITH CHECK (public.event_allows_guest_upload(event_id));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media',
  'event-media',
  true,
  262144000,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Guests upload event media files"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (
    bucket_id = 'event-media'
    AND public.event_allows_guest_upload((storage.foldername(name))[2]::uuid)
  );

CREATE POLICY "Public reads event media files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'event-media');
