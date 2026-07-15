WITH demo_event AS (
  SELECT id FROM public.events WHERE slug = 'maria-michal-demo'
), videos(chapter_type, public_url, caption, sort_order) AS (
  VALUES
    ('ceremony', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Ceremonia — ujęcie filmowe demonstracyjne.', 41),
    ('first_dance', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Pierwszy taniec — ujęcie filmowe demonstracyjne.', 71),
    ('party', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'Wesele w pełnym rytmie — ujęcie filmowe demonstracyjne.', 81)
)
INSERT INTO public.event_media (event_id, chapter_id, type, storage_path, public_url, caption, guest_name, approved, featured, created_at)
SELECT
  demo_event.id,
  chapter.id,
  'video',
  'demo/' || videos.chapter_type || '.mp4',
  videos.public_url,
  videos.caption,
  'Joanna W. — materiał demonstracyjny',
  true,
  true,
  now() + (videos.sort_order || ' minutes')::interval
FROM demo_event
JOIN videos ON true
JOIN public.event_story_chapters chapter ON chapter.event_id = demo_event.id AND chapter.chapter_type = videos.chapter_type
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_media existing
  WHERE existing.event_id = demo_event.id AND existing.storage_path = 'demo/' || videos.chapter_type || '.mp4'
);
