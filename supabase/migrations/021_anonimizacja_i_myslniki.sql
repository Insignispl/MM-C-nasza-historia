-- 021: dwie poprawki w DANYCH, nie w logice schematu.
--
-- A) NAZWISKO KLIENTA W DOMYSLNEJ WARTOSCI KOLUMNY
--    Migracja 001 powstala, gdy aplikacja byla albumem JEDNEJ pary, i zapisala
--    nazwisko klienta jako DEFAULT kolumny `couple_name`. Domyslna wartosc dziala
--    do dzis, wiec kazde wydarzenie zalozone bez podania nazwy dostaje to nazwisko,
--    a strona goscia, fotobudka i Live Wall je wyswietlaja.
--
-- B) MYSLNIKI EM W TRESCI
--    Widoczny tekst (tytuly realizacji, podpisy pod zdjeciami, nazwy rozdzialow)
--    idzie z bazy, wiec usuniecie myslnikow z kodu nie zmienilo tego, co widzi
--    czlowiek. Zamiana " — " na ", " zamiast na kropke jest swiadoma: przecinek nie
--    wymaga wielkiej litery po sobie, wiec jedno zapytanie poprawia wszystkie zdania
--    bez psucia zadnego z nich.
--
-- SPRAWDZONE NA ZYWEJ BAZIE PRZED WYSLANIEM (2026-08-24, przez PostgREST):
--   * kolumny `groom_name`, `bride_name`, `bride_maiden_name` JUZ NIE ISTNIEJA -
--     usunela je przebudowa na wiele wydarzen. Pierwsza wersja tej migracji
--     ustawiala na nich DEFAULT i przez to przerwalaby sie na pierwszym ALTER,
--     nie wykonujac NICZEGO. Te trzy instrukcje zostaly usuniete.
--   * `couple_name`, `location`, `wedding_date`, `portfolio_title`,
--     `portfolio_description`, `story_text` oraz kolumny tekstowe w `event_media`,
--     `event_story_chapters` i `event_guestbook_entries` - potwierdzone, ze istnieja.
--   * wiersz demonstracyjny `maria-michal-demo` ma juz czyste `couple_name`.
--     Zapytanie A zostaje mimo to, bo lapie wydarzenia niewidoczne dla klucza
--     publicznego (szkice) oraz kazde przyszle zalozone na starej domyslnej wartosci.
--
-- Migracja jest idempotentna: mozna ja uruchomic ponownie bez skutkow ubocznych.

-- === A. anonimizacja ==========================================================

-- Dopasowanie po WZORCU, a nie po nazwisku: gdyby nazwisko stalo tutaj, zniknieoby
-- z bazy i zostalo w repozytorium, ktore idzie na GitHub.
UPDATE public.events
SET couple_name = 'Maria i Michał'
WHERE couple_name LIKE 'Maria i Michał %';

ALTER TABLE public.events ALTER COLUMN couple_name SET DEFAULT 'Para Młoda';
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
