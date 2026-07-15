# Master Plan — Wedding Memory Platform

## Product
Platforma B2B dla fotografów i wedding plannerów: cyfrowa księga gości, album live, kiosk fotograficzny i pamiątka po wydarzeniu. Fotograf tworzy wydarzenie, personalizuje je swoją marką i udostępnia Parze oraz gościom przez link lub kod QR.

## Core Value
- Goście dodają zdjęcia, filmy i życzenia bez instalowania aplikacji.
- Kiosk na sali umożliwia robienie zdjęć i nagrywanie krótkich życzeń wideo.
- Ekran Live Wall pokazuje zatwierdzone materiały podczas imprezy.
- Para otrzymuje prywatny album po wydarzeniu.
- Fotograf sprzedaje usługę jako dodatek do pakietu lub white-label.

## Roles
- Platform administrator: zarządza platformą i studiami.
- Studio owner: tworzy wydarzenia, zaprasza zespół i zarządza marką.
- Photographer: obsługuje przypisane wydarzenia i moderację.
- Couple: ogląda album, pobiera materiały i zatwierdza ustawienia.
- Guest: dodaje wspomnienia przez QR/link.
- Kiosk: ograniczone urządzenie do dodawania materiałów.

## Event Lifecycle
1. Fotograf zakłada konto i tworzy wydarzenie.
2. Ustawia nazwę, datę, motyw, hasło, moderację oraz branding.
3. Platforma generuje publiczny link, QR dla gości, QR dla stolików i kod kiosku.
4. Goście dodają treści, a moderator akceptuje je w czasie rzeczywistym.
5. Live Wall wyświetla zaakceptowane wspomnienia na ekranie sali.
6. Po weselu Para dostaje prywatny album oraz eksport ZIP/PDF.
7. Po okresie retencji dane są archiwizowane lub usuwane zgodnie z pakietem.

## MVP — Priority 1
- Multi-tenant data model: studios, events, memberships, event settings.
- Supabase Auth dla fotografów i bezpieczne RBAC/RLS.
- Dashboard fotografa: tworzenie wydarzenia, podgląd QR, moderacja.
- Publiczna strona wydarzenia pod `/e/[slug]`.
- Wpisy, upload zdjęć/filmów oraz kolejka moderacji przypisana do wydarzenia.
- Kiosk pod `/kiosk/[eventSlug]` z automatycznym resetem po akcji.
- Live Wall pod `/live/[eventSlug]` z realtime feedem.

## Growth — Priority 2
- Zdjęcie z kamery urządzenia: odliczanie, ramki i filtry.
- Krótkie życzenia wideo.
- Wyzwania dla gości i kody QR per stół.
- Głosowanie na zdjęcie wieczoru.
- Kapsuła czasu na pierwszą rocznicę.
- Karta do Instagram Stories po dodaniu wspomnienia.
- Eksport PDF księgi, ZIP mediów i integracja z fotoksiążką.

## Commercial Model
- Starter: jedno wydarzenie, zdjęcia, wpisy i QR.
- Pro: kiosk, live wall, filmy, moderacja i eksport.
- Studio: wiele wydarzeń i branding fotografa.
- White-label: własna domena, logo i zaproszenia zespołu.

## Non-negotiables
- Nie przechowujemy haseł administratorów w publicznym kodzie ani zmiennych `NEXT_PUBLIC_*`.
- Wszystkie dane i pliki muszą należeć do konkretnego eventu.
- Materiały gości są moderowane domyślnie.
- Prywatne wydarzenia nie są indeksowane przez wyszukiwarki.
- RODO: jasna zgoda przed wysłaniem, polityka retencji i możliwość usunięcia materiału.
- Upload wideo musi obsługiwać słabe łącza oraz wznowienie transmisji w kolejnej fazie.

## Technical Architecture
- Next.js App Router + TypeScript.
- Supabase Auth, PostgreSQL, Storage i Realtime.
- Storage paths w formacie `events/{eventId}/...`.
- Zasady RLS oparte o `auth.uid()`, członkostwo w studio i kontekst wydarzenia.
- Server-side routes dla operacji uprzywilejowanych, eksportu i podpisanych uploadów.
- Realtime tylko dla zatwierdzonych materiałów Live Wall.

## Delivery Sequence
1. Migracja schema + Supabase Auth + RLS.
2. Dashboard studia i eventów.
3. Publiczna strona eventu i bezpieczny upload gości.
4. Moderacja i Live Wall.
5. Kiosk fotograficzny.
6. Eksporty, white-label i pakiety płatności.

## Success Metrics
- Odsetek gości, którzy zeskanowali QR.
- Liczba dodanych materiałów na wydarzenie.
- Czas do pierwszego wpisu.
- Udział zaakceptowanych materiałów.
- Liczba eventów obsłużonych przez studio miesięcznie.
- Konwersja Starter do Pro.
