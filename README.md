# Joanna W. — Fotografia i Event Story

Prywatny system Joanny W. do obsługi klientów fotograficznych: wizytówka, portfolio reportaży oraz prywatne cyfrowe pamiątki wydarzeń.

## Architektura produktu

- **Wizytówka** — `/` to publiczna strona Joanny z portfolio i kontaktem.
- **Portfolio** — `/historia/[slug]` to komercyjna prezentacja reportażu. Nie ma tam uploadu, księgi gości, danych gości ani pełnego nazwiska klientów.
- **Prywatne wydarzenie** — `/e/[slug]` to karta konkretnej Pary: album, Event Story, upload zdjęć/filmów, księga, kiosk i Live Wall.
- **CRM Joanny** — `/fotograf` jest panelem po logowaniu do tworzenia wydarzeń, moderacji i konfiguracji QR, kiosku oraz Live Wall.

## Funkcje

- **Event Story** — chronologiczne rozdziały, zdjęcia i filmy w reportażu.
- **Album QR** — goście przesyłają zdjęcia i filmy bez konta.
- **Moderacja** — materiały trafiają do kolejki akceptacji Joanny.
- **Kiosk i Live Wall** — tryb tabletu z aparatem oraz ekran projekcyjny aktualizowany przez Supabase Realtime.
- **Portfolio** — fotograf decyduje, które wydarzenia prezentuje publicznie.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Supabase: Auth, PostgreSQL, Storage, Realtime i RLS
- Netlify z `@netlify/plugin-nextjs`

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja działa na `http://localhost:3000`.

## Zmienne środowiskowe

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-anon-key>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SITE_PASSWORD=<optional-legacy-site-password>
```

Nie umieszczaj sekretów administracyjnych, haseł gości ani `service_role` w zmiennych rozpoczynających się od `NEXT_PUBLIC_`.

## Migracje

Migracje w `supabase/migrations` są wykonywane w kolejności numerycznej. Nie wklejaj ich ponownie ręcznie w SQL Editorze po zastosowaniu — sprawdź stan przez historię migracji Supabase.

## Wdrożenie

```bash
npm run build
```

Ustaw te same zmienne środowiskowe w Netlify. Po wdrożeniu sprawdź:

1. `/` — wizytówka i karta portfolio.
2. `/historia/maria-michal-demo` — tylko prezentacja komercyjna.
3. `/e/maria-michal-demo` — prywatny album demo.
4. `/fotograf/start` i `/fotograf` — logowanie oraz CRM Joanny.

## Ograniczenia wdrożenia

System jest przeznaczony wyłącznie dla Joanny W. i jej klientów. Nie uruchamiaj publicznej rejestracji innych fotografów. Dla nowego fotografa utwórz osobną, brandowaną instancję i oddzielny projekt Supabase.
