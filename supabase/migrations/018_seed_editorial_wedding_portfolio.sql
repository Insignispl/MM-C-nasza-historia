WITH studio AS (
  SELECT id FROM public.studios WHERE slug = 'story-atelier' LIMIT 1
)
INSERT INTO public.events (
  studio_id, slug, couple_name, wedding_date, location, story_text, primary_color, secondary_color,
  status, public_access_enabled, allow_uploads, require_moderation, is_portfolio,
  portfolio_title, portfolio_description, story_template, story_background_color,
  story_gradient_from, story_gradient_to, story_text_color
)
SELECT
  studio.id, 'ola-jakub-midnight', 'Ola i Jakub', '2026-05-24', 'Wrocław',
  'Miejska noc, odważne światło i historia, która zaczęła się na parkiecie.', '#d4a5e6', '#75c7d5',
  'live', true, true, true, true,
  'Ola i Jakub — nocne wesele', 'Nocny reportaż ślubny: światło miasta, bliscy i energia do rana.', 'midnight', '#15111c',
  '#5b315d', '#183b4d', '#f8f2f7'
FROM studio
ON CONFLICT (slug) DO UPDATE SET
  couple_name = EXCLUDED.couple_name,
  status = 'live',
  is_portfolio = true,
  portfolio_title = EXCLUDED.portfolio_title,
  portfolio_description = EXCLUDED.portfolio_description,
  story_template = EXCLUDED.story_template,
  story_background_color = EXCLUDED.story_background_color,
  story_gradient_from = EXCLUDED.story_gradient_from,
  story_gradient_to = EXCLUDED.story_gradient_to,
  story_text_color = EXCLUDED.story_text_color;

WITH event_data AS (
  SELECT id FROM public.events WHERE slug = 'ola-jakub-midnight'
), chapters(sort_order, chapter_type, title, subtitle) AS (
  VALUES
    (1, 'city', 'Miasto przed zachodem', 'Spokojny początek i pierwsze kadry między światłem a cieniem.'),
    (2, 'ceremony', 'Tak, po swojemu', 'Ceremonia pełna bliskich spojrzeń i bardzo własnych zasad.'),
    (3, 'golden_hour', 'Godzina złota', 'Kilka minut tylko dla Nich, zanim zacznie się noc.'),
    (4, 'first_dance', 'Pierwszy taniec', 'Muzyka głośniej, światło niżej, emocje najwyżej.'),
    (5, 'afterparty', 'Do rana', 'Historia, której finału nikt nie chciał przyspieszać.')
)
INSERT INTO public.event_story_chapters (event_id, sort_order, chapter_type, title, subtitle)
SELECT event_data.id, chapters.sort_order, chapters.chapter_type, chapters.title, chapters.subtitle
FROM event_data CROSS JOIN chapters
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_story_chapters current
  WHERE current.event_id = event_data.id AND current.chapter_type = chapters.chapter_type
);

WITH event_data AS (
  SELECT id FROM public.events WHERE slug = 'ola-jakub-midnight'
), media(chapter_type, public_url, caption, sort_order) AS (
  VALUES
    ('city', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=88', 'Oddech przed wieczorem.', 1),
    ('ceremony', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=88', 'Najważniejsze słowa tego dnia.', 2),
    ('golden_hour', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=88', 'Światło zostało z Nimi na chwilę.', 3),
    ('first_dance', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=88', 'Pierwszy utwór i własny rytm.', 4),
    ('afterparty', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=88', 'Noc dopiero się zaczynała.', 5)
)
INSERT INTO public.event_media (event_id, chapter_id, type, storage_path, public_url, caption, guest_name, approved, featured, source, created_at)
SELECT event_data.id, chapter.id, 'image', 'demo/ola-jakub-' || media.chapter_type || '.jpg', media.public_url, media.caption,
  'Joanna W. — materiał demonstracyjny', true, true, 'photographer', now() + (media.sort_order || ' minutes')::interval
FROM event_data
JOIN media ON true
JOIN public.event_story_chapters chapter ON chapter.event_id = event_data.id AND chapter.chapter_type = media.chapter_type
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_media current
  WHERE current.event_id = event_data.id AND current.storage_path = 'demo/ola-jakub-' || media.chapter_type || '.jpg'
);
