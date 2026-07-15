WITH demo_event AS (
  SELECT id FROM public.events WHERE slug = 'maria-michal-demo'
), chapter_data(sort_order, title, subtitle, chapter_type) AS (
  VALUES
    (1, 'Poranek pełen emocji', 'Detale, ostatnie przygotowania i pierwsze wzruszenia.', 'preparations'),
    (2, 'Goście przybywają', 'Uśmiechy, powitania i oczekiwanie na ten jeden moment.', 'guests_arrive'),
    (3, 'W drodze do ceremonii', 'Chwila oddechu przed powiedzeniem „tak”.', 'journey'),
    (4, 'Ceremonia', 'Przysięga, spojrzenia i najważniejsze słowa.', 'ceremony'),
    (5, 'Już razem', 'Wyjście, gratulacje i konfetti w świetle dnia.', 'celebration'),
    (6, 'Powitanie na sali', 'Toast za miłość i początek wspólnego świętowania.', 'reception'),
    (7, 'Pierwszy taniec', 'Parkiet należał tylko do Nich.', 'first_dance'),
    (8, 'Zabawa do rana', 'Muzyka, energia i kadry, których nie da się zaplanować.', 'party'),
    (9, 'Podziękowania dla rodziców', 'Najbardziej czuły moment wieczoru.', 'thanks'),
    (10, 'Finał tej historii', 'Ostatni taniec, który otwiera wszystko, co przed Nimi.', 'finale')
)
INSERT INTO public.event_story_chapters (event_id, title, subtitle, chapter_type, sort_order)
SELECT demo_event.id, chapter_data.title, chapter_data.subtitle, chapter_data.chapter_type, chapter_data.sort_order
FROM demo_event CROSS JOIN chapter_data
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_story_chapters existing
  WHERE existing.event_id = demo_event.id AND existing.chapter_type = chapter_data.chapter_type
);

WITH demo_event AS (
  SELECT id FROM public.events WHERE slug = 'maria-michal-demo'
), media_data(chapter_type, public_url, caption, sort_order) AS (
  VALUES
    ('preparations', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=88', 'Ostatnie chwile przed ceremonią.', 1),
    ('guests_arrive', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=88', 'Goście tworzą pierwsze wspomnienia dnia.', 2),
    ('journey', 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=88', 'W drodze do najważniejszego „tak”.', 3),
    ('ceremony', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=88', 'Przysięga i obietnica wspólnej przyszłości.', 4),
    ('celebration', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=88', 'Pierwsze gratulacje już jako małżeństwo.', 5),
    ('reception', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=88', 'Stół pełen bliskich i pięknych słów.', 6),
    ('first_dance', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=88', 'Pierwszy taniec — reszta świata na moment znika.', 7),
    ('party', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=88', 'Najlepsze kadry dzieją się pomiędzy planem.', 8),
    ('thanks', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=88', 'Wdzięczność, której nie trzeba tłumaczyć.', 9),
    ('finale', 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1600&q=88', 'Na koniec — światło, muzyka i nowy początek.', 10)
)
INSERT INTO public.event_media (event_id, chapter_id, type, storage_path, public_url, caption, guest_name, approved, featured, created_at)
SELECT
  demo_event.id,
  chapter.id,
  'image',
  'demo/' || chapter.chapter_type || '.jpg',
  media_data.public_url,
  media_data.caption,
  'Joanna W. — materiał demonstracyjny',
  true,
  true,
  now() + (media_data.sort_order || ' minutes')::interval
FROM demo_event
JOIN media_data ON true
JOIN public.event_story_chapters chapter ON chapter.event_id = demo_event.id AND chapter.chapter_type = media_data.chapter_type
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_media existing
  WHERE existing.event_id = demo_event.id AND existing.storage_path = 'demo/' || chapter.chapter_type || '.jpg'
);
