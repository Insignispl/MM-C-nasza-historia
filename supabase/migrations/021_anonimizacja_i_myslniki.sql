-- 021: dwie poprawki w danych, nie w schemacie logiki.
--
-- A) NAZWISKO REALNEGO KLIENTA W BAZIE
--    Migracja 001 powstala, gdy aplikacja byla albumem JEDNEJ pary, i zapisala
--    nazwisko klienta jako DEFAULT kolumny. Domyslna wartosc dziala do dzis, wiec
--    kazde wydarzenie zalozone bez podania nazwy pary dostaje to nazwisko, a strona
--    albumu je wyswietla. Usuwamy je z danych i z domyslnych wartosci.
--
-- B) MYSLNIKI EM W TRESCI
--    Widoczny tekst (tytuly realizacji, podpisy pod zdjeciami, nazwy rozdzialow)
--    idzie z bazy, wiec usuniecie myslnikow z kodu nie zmienilo tego, co widzi
--    czlowiek. Zamiana " — " na ", " zamiast na kropke jest swiadoma: przecinek nie
--    wymaga wielkiej litery po sobie, wiec jedno zapytanie poprawia wszystkie zdania
--    bez psucia zadnego z nich.

-- === A. anonimizacja ==========================================================

-- Dopasowanie po WZORCU, a nie po nazwisku: gdybym wpisal je tutaj, usunalbym je
-- z bazy i zostawil w repozytorium, ktore idzie na GitHub. Wzorzec lapie i wiersz
-- demonstracyjny, i kazdy zalozony na starej domyslnej wartosci.
UPDATE public.events
SET couple_name = 'Maria i Michał'
WHERE couple_name LIKE 'Maria i Michał %';

ALTER TABLE public.events ALTER COLUMN couple_name SET DEFAULT 'Para Młoda';
ALTER TABLE public.events ALTER COLUMN groom_name SET DEFAULT '';
ALTER TABLE public.events ALTER COLUMN bride_name SET DEFAULT '';
ALTER TABLE public.events ALTER COLUMN location SET DEFAULT '';
ALTER TABLE public.events ALTER COLUMN wedding_date DROP DEFAULT;

-- === B. myslniki em ===========================================================

UPDATE public.events SET
  couple_name = replace(couple_name, ' — ', ', '),
  portfolio_title = replace(portfolio_title, ' — ', ', '),
  portfolio_description = replace(portfolio_description, ' — ', ', '),
  location = replace(location, ' — ', ', '),
  story_text = replace(story_text, ' — ', ', ')
WHERE couple_name LIKE '% — %'
   OR portfolio_title LIKE '% — %'
   OR portfolio_description LIKE '% — %'
   OR location LIKE '% — %'
   OR story_text LIKE '% — %';

UPDATE public.event_media
SET caption = replace(caption, ' — ', ', ')
WHERE caption LIKE '% — %';

UPDATE public.event_story_chapters SET
  title = replace(title, ' — ', ', '),
  subtitle = replace(subtitle, ' — ', ', ')
WHERE title LIKE '% — %' OR subtitle LIKE '% — %';

UPDATE public.event_guestbook_entries SET
  message = replace(message, ' — ', ', '),
  author_name = replace(author_name, ' — ', ', ')
WHERE message LIKE '% — %' OR author_name LIKE '% — %';
