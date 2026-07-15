WITH demo_event AS (
  SELECT id FROM public.events WHERE slug = 'maria-michal-demo'
), updates(chapter_type, title, subtitle, sort_order) AS (
  VALUES
    ('preparations', 'Przygotowania', 'Detale, ostatnie poprawki i emocje przed wyjściem.', 1),
    ('journey', 'Droga na ceremonię', 'Krótka chwila oddechu przed najważniejszym „tak”.', 2),
    ('guests_arrive', 'Goście przed ceremonią', 'Powitania, rozmowy i oczekiwanie na Parę Młodą.', 3),
    ('ceremony', 'Ceremonia', 'Przysięga, spojrzenia i najważniejsze słowa.', 4),
    ('celebration', 'Wyjście i gratulacje', 'Pierwsze chwile razem — już jako małżeństwo.', 5),
    ('reception', 'Przejazd i powitanie na sali', 'Toast, chleb i początek wspólnego świętowania.', 6),
    ('first_dance', 'Pierwszy taniec', 'Parkiet przez chwilę należał tylko do Nich.', 7),
    ('party', 'Wesele w pełnym rytmie', 'Muzyka, program i kadry, których nie da się zaplanować.', 8),
    ('thanks', 'Podziękowania dla rodziców', 'Wdzięczność, która zostaje na całe życie.', 9),
    ('finale', 'Ostatni taniec', 'Zamknięcie dnia i pierwszy krok w nową historię.', 10)
)
UPDATE public.event_story_chapters chapter
SET title = updates.title,
    subtitle = updates.subtitle,
    sort_order = updates.sort_order
FROM demo_event, updates
WHERE chapter.event_id = demo_event.id
  AND chapter.chapter_type = updates.chapter_type;

UPDATE public.events
SET portfolio_title = 'Maria i Michał — historia jednego dnia',
    portfolio_description = 'Kinowy reportaż od przygotowań, przez ceremonię, po ostatni taniec.'
WHERE slug = 'maria-michal-demo';
