WITH inserted_studio AS (
  INSERT INTO public.studios (name, slug)
  VALUES ('Joanna W. — portfolio', 'joanna-w-portfolio')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
), portfolio_studio AS (
  SELECT id FROM inserted_studio
  UNION ALL
  SELECT id FROM public.studios WHERE slug = 'joanna-w-portfolio'
  LIMIT 1
), inserted_event AS (
  INSERT INTO public.events (
    studio_id,
    slug,
    couple_name,
    wedding_date,
    location,
    story_text,
    cover_image_url,
    primary_color,
    secondary_color,
    status,
    public_access_enabled,
    allow_uploads,
    require_moderation,
    kiosk_enabled,
    live_wall_enabled
  )
  SELECT
    portfolio_studio.id,
    'maria-michal-demo',
    settings.couple_name,
    settings.wedding_date,
    settings.location,
    settings.story_text,
    settings.cover_image,
    settings.primary_color,
    settings.secondary_color,
    'live',
    true,
    true,
    true,
    true,
    true
  FROM portfolio_studio
  CROSS JOIN public.wedding_settings settings
  LIMIT 1
  ON CONFLICT (slug) DO UPDATE SET
    status = 'live',
    public_access_enabled = true,
    kiosk_enabled = true,
    live_wall_enabled = true
  RETURNING id
), portfolio_event AS (
  SELECT id FROM inserted_event
  UNION ALL
  SELECT id FROM public.events WHERE slug = 'maria-michal-demo'
  LIMIT 1
)
INSERT INTO public.event_media (
  event_id, type, storage_path, public_url, thumbnail_url, caption, guest_name, approved, featured, created_at
)
SELECT
  portfolio_event.id,
  media.type,
  media.storage_path,
  media.public_url,
  media.thumbnail_url,
  media.caption,
  media.guest_name,
  media.approved,
  media.featured,
  media.created_at
FROM public.media media
CROSS JOIN portfolio_event
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_media existing
  WHERE existing.event_id = portfolio_event.id AND existing.public_url = media.public_url
);

WITH portfolio_event AS (
  SELECT id FROM public.events WHERE slug = 'maria-michal-demo'
)
INSERT INTO public.event_guestbook_entries (
  event_id, author_name, relation, message, media_url, approved, created_at
)
SELECT
  portfolio_event.id,
  entry.author_name,
  entry.relation,
  entry.message,
  entry.media_url,
  entry.approved,
  entry.created_at
FROM public.guestbook_entries entry
CROSS JOIN portfolio_event
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_guestbook_entries existing
  WHERE existing.event_id = portfolio_event.id
    AND existing.author_name = entry.author_name
    AND existing.message = entry.message
);
