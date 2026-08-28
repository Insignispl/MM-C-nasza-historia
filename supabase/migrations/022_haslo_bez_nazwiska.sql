-- 022: nazwisko klienta uzyte jako HASLO.
--
-- Migracja 001 zdefiniowala `wedding_settings.guest_password` z wartoscia domyslna
-- zlozona z NAZWISKA realnego klienta i roku. To jednoczesnie dane osobowe
-- w repozytorium i przewidywalne haslo. Wartosci nie przepisuje tutaj celowo:
-- inaczej usunalbym ja z bazy i zostawil w repo, ktore idzie na GitHub.
--
-- Kolumna pochodzi z czasow, gdy aplikacja byla albumem JEDNEJ pary;
-- dzis trasy goscia sa usuniete, a migracja 012 odebrala
-- `get_guest_password()` uprawnienia dla anon i authenticated, wiec nic tego nie czyta.
-- Zostawienie tam nazwiska nie mialo jednak zadnego uzasadnienia.
--
-- Nowa wartosc to losowy UUID, a nie stala: gdyby cokolwiek jeszcze te sciezke
-- sprawdzalo, ma byc nieodgadywalna, a nie „pusta".
--
-- SPRAWDZONE PRZED NAPISANIEM: tabela `wedding_settings` W DALSZYM CIAGU ISTNIEJE
-- w bazie (odpytana przez PostgREST 24.08). Mimo to cala zmiana jest owinieta
-- w warunek istnienia kolumny - poprzednia migracja (021) w pierwszej wersji
-- przerwala sie w calosci, bo ALTER dotykal kolumn usunietych wczesniejsza
-- przebudowa. Ta pomylka ma sie nie powtorzyc.
--
-- Migracja jest idempotentna: kolejne uruchomienie po prostu losuje nowa wartosc.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'wedding_settings'
      AND column_name = 'guest_password'
  ) THEN
    EXECUTE 'ALTER TABLE public.wedding_settings
               ALTER COLUMN guest_password SET DEFAULT gen_random_uuid()::text';
    EXECUTE 'UPDATE public.wedding_settings
               SET guest_password = gen_random_uuid()::text';
    RAISE NOTICE 'guest_password: wartosc i domyslna wartosc zastapione losowym UUID';
  ELSE
    RAISE NOTICE 'guest_password: kolumny nie ma, nic do zrobienia';
  END IF;
END $$;
