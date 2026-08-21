-- Zapytania z formularza kontaktowego.
--
-- ARCHITEKTURA "ZAPIS NAJPIERW, MAIL POTEM": zapytanie zawsze trafia do tej tabeli,
-- a powiadomienie mailem jest osobnym, nieblokujacym krokiem. Formularz oparty
-- wylacznie na zewnetrznej usludze mailowej gubi zgloszenie za kazdym razem, gdy
-- usluga nie odpowie albo klucz wygasnie - i nikt sie o tym nie dowie, bo nie ma
-- czego porownac. Tutaj zgubione powiadomienie oznacza tylko brak maila, nie brak leada.
--
-- Odpowiedzi na pytania SCIEZKI trzymamy w jsonb, bo drzewo pytan zmienia sie razem
-- z oferta i kolumna-per-pytanie wymagalaby migracji przy kazdej korekcie formularza.
-- Pola kontaktowe sa osobnymi kolumnami, bo po nich sie filtruje i sortuje.

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  sciezka text NOT NULL CHECK (sciezka IN ('wesele', 'event', 'wideo', 'studio')),
  imie text NOT NULL CHECK (length(btrim(imie)) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefon text CHECK (telefon IS NULL OR length(telefon) <= 40),
  uwagi text CHECK (uwagi IS NULL OR length(uwagi) <= 4000),
  skad text CHECK (skad IS NULL OR length(skad) <= 120),
  odpowiedzi jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'nowe' CHECK (status IN ('nowe', 'w_toku', 'zamkniete')),
  -- Slad wysylki powiadomienia. NULL = mail nie poszedl (brak klucza albo blad
  -- uslugi) - dzieki temu widac, ktore zapytania trzeba obejrzec recznie.
  powiadomienie_wyslane_at timestamptz
);

CREATE INDEX IF NOT EXISTS inquiries_status_created_idx ON public.inquiries(status, created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Formularz jest publiczny, wiec anon MUSI moc wstawiac. Ale tylko wstawiac:
-- bez SELECT nikt z ulicy nie odczyta cudzych zapytan, a to sa dane osobowe.
DROP POLICY IF EXISTS "Anon sklada zapytanie" ON public.inquiries;
CREATE POLICY "Anon sklada zapytanie" ON public.inquiries
  FOR INSERT TO anon
  WITH CHECK (status = 'nowe' AND powiadomienie_wyslane_at IS NULL);

-- Odczyt i zmiana statusu tylko dla zalogowanych. Serwis jest zamkniety na jedno
-- studio (migracja 014), wiec zalogowany = obsluga.
DROP POLICY IF EXISTS "Obsluga czyta zapytania" ON public.inquiries;
CREATE POLICY "Obsluga czyta zapytania" ON public.inquiries
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Obsluga aktualizuje zapytania" ON public.inquiries;
CREATE POLICY "Obsluga aktualizuje zapytania" ON public.inquiries
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
