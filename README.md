# Story Atelier

Serwis studia fotograficzno-filmowego z dwoma biurami: **Wrocław** (Gwiaździsta 6/5, biuro
i studio nagraniowe) oraz **Polkowice** (Młyńska 10). Łączy trzy rzeczy, które zwykle bywają
osobnymi produktami:

1. **Strona sprzedażowa** — usługi, realizacje, studio nagraniowe, formularz zapytań.
2. **Prywatne pamiątki dla klientów** — każda para ma własną stronę wydarzenia z albumem,
   księgą gości, fotobudką i ekranem Live Wall na przyjęcie.
3. **Panel obsługi** — tworzenie wydarzeń, moderacja materiałów od gości, kody QR, wygląd
   strony wydarzenia.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
Supabase (Auth, PostgreSQL, Storage, Realtime, RLS) · Resend (opcjonalnie, powiadomienia)

## Uruchomienie

```bash
npm install
npm run dev
```

Serwis działa na `http://localhost:3000`.

> **Jeśli zmiana w `src/app/globals.css` nie działa** — Turbopack w trybie dev bywa, że nie
> przebudowuje arkusza. Zatrzymaj serwer, usuń katalog `.next`, uruchom ponownie. Szczegóły
> w [docs/ARCHITEKTURA.md](docs/ARCHITEKTURA.md).

## Zmienne środowiskowe

| Zmienna | Wymagana | Do czego |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | tak | adres projektu Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tak | klucz publiczny Supabase |
| `NEXT_PUBLIC_BASE_URL` | tak | adres serwisu, używany w kodach QR, sitemapie i danych strukturalnych |
| `RESEND_API_KEY` | nie | powiadomienia mailowe o zapytaniach. Bez niego formularz nadal zapisuje zapytania |
| `RESEND_FROM` | nie | nadawca powiadomień, domyślnie `formularz@storyatelier.pl` |
| `SUPABASE_SERVICE_ROLE_KEY` | nie | tylko po to, by oznaczyć w bazie wysłane powiadomienie |

**Klucza `service_role` nigdy nie nazywaj z prefiksem `NEXT_PUBLIC_`.** Wszystko z tym
prefiksem trafia do przeglądarki każdego odwiedzającego. W repozytorium był kiedyś
`admin-client.ts` z tokenem administratora w takiej zmiennej; został usunięty.

## Trasy

| Trasa | Kto widzi | Co robi |
|---|---|---|
| `/` | publicznie | strona sprzedażowa: usługi, studio, fotobudka, realizacje, formularz |
| `/studio` | publicznie | wynajem studia nagraniowego we Wrocławiu |
| `/prywatnosc` | publicznie | polityka prywatności |
| `/historia/[slug]` | publicznie | prezentacja reportażu w portfolio, bez danych gości |
| `/e/[slug]` | link od pary | prywatna strona wydarzenia: album, księga, Event Story |
| `/e/[slug]/dodaj` | goście | wgrywanie zdjęć, filmów i wpisów |
| `/e/[slug]/fotobudka` | goście, tablet | fotobudka z ramką wypalaną w plik |
| `/e/[slug]/live` | projektor | ekran Live Wall na sali |
| `/fotograf` | po logowaniu | panel obsługi |
| `/api/zapytanie` | publicznie | przyjmuje formularz zapytania |

Stare trasy prywatnego albumu (`/album`, `/ksiega`, `/dodaj`, `/admin`, `/login`) są
przekierowywane na `/` z `next.config.ts`.

## Gdzie co leży

| Plik | Rola |
|---|---|
| `src/lib/oferta.ts` | jedno źródło prawdy o usługach, biurach, kontakcie i okładce nagłówka |
| `src/lib/zapytania.ts` | drzewo pytań formularza, wspólne dla formularza, walidacji i maila |
| `src/lib/seo.ts` | dane strukturalne schema.org budowane z `oferta.ts` |
| `src/lib/theme.ts` | polityka motywu: jasny, ciemny, tryb sali |
| `src/lib/photobooth.ts` | rysowanie oprawy na płótnie i składanie animacji z serii |
| `src/lib/prywatnosc.ts` | dane administratora do polityki prywatności |
| `src/app/globals.css` | tokeny, powierzchnie i sygnatury wizualne |

Zmiana treści oferty, adresu albo telefonu to edycja **jednego** pliku — `oferta.ts`.
Strona, `/studio`, stopka, formularz i dane strukturalne czytają z niego.

## Migracje

Pliki w `supabase/migrations` uruchamiane w kolejności numerycznej. Po zastosowaniu nie
wklejaj ich ponownie w SQL Editorze — stan sprawdzaj w historii migracji Supabase.

Ostatnie: **019** modernizuje presety wyglądu stron wydarzeń, **020** dodaje tabelę
`inquiries` na zapytania z formularza. Bez 020 formularz zwróci błąd zapisu.

## Wdrożenie

```bash
npm run build
```

Po wdrożeniu sprawdź: `/`, `/studio`, `/prywatnosc`, `/historia/maria-michal-demo`,
`/e/maria-michal-demo`, `/fotograf/start`.

**Uśpiony projekt Supabase wygląda jak skasowany.** Free tier po okresie bezczynności
usypia projekt i zdejmuje wpis DNS, więc aplikacja miele kilka sekund i zwraca sam szkielet
strony, a logowanie rzuca „Failed to fetch". Zanim uznasz projekt za utracony, otwórz panel
Supabase — samo otwarcie go wybudza.

## Zanim to trafi na produkcję

- [ ] Uzupełnić dane administratora w `src/lib/prywatnosc.ts`. Dopóki są puste, strona
      polityki wyświetla ostrzeżenie, że dokument jest projektem
- [ ] Przegląd prawny polityki prywatności
- [ ] Wizytówki Google dla obu adresów. Bez nich dane strukturalne nie wystarczą
      do wyników lokalnych
- [ ] Klucz Resend, żeby zapytania trafiały też mailem
- [ ] Potwierdzić dni tygodnia dla godzin 9–17 w `src/lib/seo.ts`
- [ ] Uzupełnić `sameAs` w `src/lib/seo.ts`, gdy powstaną profile w social mediach
- [ ] Usunąć wiersze testowe z tabeli `inquiries`

## Więcej

[docs/ARCHITEKTURA.md](docs/ARCHITEKTURA.md) — system wizualny, polityka motywu, obieg
zapytań, dane strukturalne oraz **pułapki, które kosztowały najwięcej czasu**. Warto
przeczytać przed pierwszą zmianą w kodzie.
