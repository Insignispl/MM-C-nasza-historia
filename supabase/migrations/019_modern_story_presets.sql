-- Presety szablonow historii z migracji 017 byly pudrowe (roz i lawenda: #fff9fc,
-- #f4d7e5, #ddd2f0). Wlasciciel odrzucil je jako nieprzystajace do marki studia
-- produkcyjnego. Ta migracja podmienia kolory istniejacych wydarzen ORAZ domyslne
-- wartosci kolumn, zeby nowo tworzone wydarzenia nie rodzily sie w starej palecie.
--
-- Nazwy szablonow ('romantic' | 'editorial' | 'midnight') zostaja bez zmian, bo sa
-- przypiete ograniczeniem CHECK z migracji 017 i uzywane jako klasy CSS
-- (.story-template-*). Zmieniamy wylacznie barwy i etykiety w interfejsie.

ALTER TABLE public.events
  ALTER COLUMN story_background_color SET DEFAULT '#fbfbfa',
  ALTER COLUMN story_gradient_from SET DEFAULT '#e7e9ec',
  ALTER COLUMN story_gradient_to SET DEFAULT '#dcd8d2',
  ALTER COLUMN story_text_color SET DEFAULT '#101013';

-- romantic -> jasny, chlodny, czysty. Zamiast rozu: neutralna biel z cieplym drugim przystankiem.
UPDATE public.events
SET
  story_background_color = '#fbfbfa',
  story_gradient_from = '#e7e9ec',
  story_gradient_to = '#dcd8d2',
  story_text_color = '#101013'
WHERE story_template = 'romantic';

-- editorial -> cieply papier z szampanska poswiata, ta sama rodzina co akcent marki.
UPDATE public.events
SET
  story_background_color = '#f5f2ec',
  story_gradient_from = '#f0e4c9',
  story_gradient_to = '#dedad2',
  story_text_color = '#16130f'
WHERE story_template = 'editorial';

-- midnight -> glebia neutralna, bez fioletu. Cieply drugi przystanek zamiast fioletu.
UPDATE public.events
SET
  story_background_color = '#0d0d10',
  story_gradient_from = '#2a2a33',
  story_gradient_to = '#3a2f18',
  story_text_color = '#f5f4f2'
WHERE story_template = 'midnight';
