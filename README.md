# Album Ślubny — Maria i Michał Czujko

Nowoczesna, wiralowa strona pamiątkowa ze ślubu z albumem zdjęć i filmów, księgą gości oraz panelem moderacji.

## Funkcje

- **Opowieść ślubna** — historia pary, data i miejsce ślubu.
- **Album QR** — goście skanują kod QR i dodają zdjęcia/filmy bez logowania.
- **Księga gości** — wpisy życzeń i wspomnień z możliwością załączenia zdjęcia.
- **Moderacja** — panel administratora do zatwierdzania wpisów.
- **Responsywny design** — działa idealnie na telefonach.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Storage)
- QR code generator

## Lokalne uruchomienie

```bash
npm install
npm run dev
```

Aplikacja działa na `http://localhost:3000`.

## Konfiguracja

Zmienne środowiskowe znajdują się w `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hzksnufsmuihjtqrislr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GUEST_TOKEN=czujko2026
NEXT_PUBLIC_ADMIN_TOKEN=admin2026
```

**Ważne bezpieczeństwo:** zmień domyślne hasła w tabeli `wedding_settings` (`guest_password` i `admin_password`) oraz w `.env.local`.

## Hasła

- **Gość:** `czujko2026` — używane w URL-u / QR kodzie.
- **Admin:** `admin2026` — do panelu moderacji `/admin`.

## Strony

- `/` — strona główna z historią i QR kodem
- `/album` — galeria zdjęć i filmów
- `/ksiega` — księga gości
- `/dodaj` — formularz dodawania wspomnień
- `/admin` — panel moderacji

## Deploy

```bash
npm run build
```

Zalecany hosting: Vercel / Netlify.
