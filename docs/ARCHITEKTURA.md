# Architektura i decyzje

Dokument dla osoby, która będzie to zmieniać. Opisuje **dlaczego** rzeczy są zrobione tak,
a nie inaczej, oraz pułapki, które już raz kosztowały czas.

---

## System wizualny

### Tokeny, nie kolory

Wszystkie kolory pochodzą z tokenów w `globals.css`. Komponenty używają `bg-card`,
`text-muted-foreground`, `border-border` — nigdy `bg-white` ani `bg-[#1b1120]`.

Zasada ma jeden ważny wyjątek: **kolory leżące NA zdjęciu zostają na sztywno.** Podpis na
kadrze, przyciemnienie pod tekstem, tło letterboxa przy nietypowych proporcjach — fotografia
nie zmienia jasności razem z motywem, więc biały tekst musi zostać biały. Te miejsca są
w kodzie opisane komentarzem.

### Powierzchnie

Zamiast malować sekcje kolorami, przestawiamy tokeny w zasięgu klasy:

- `.surface-studio` — ciemna. Strona sprzedażowa, ciemne panele w panelu obsługi.
- `.surface-paper` — jasna. Sekcje przeplatające ciemne, odwrót karty w nagłówku.
- `.frame-classic` / `.frame-film` / `.frame-neon` / `.frame-minimal` — cztery style oprawy
  fotobudki, wybierane per wydarzenie z kolumny `events.kiosk_frame_style`.
- `.story-template-romantic` / `-editorial` / `-midnight` — wygląd strony wydarzenia,
  kolory pochodzą z bazy i fotograf edytuje je w panelu.

Dzięki temu ta sama karta, ten sam przycisk i ten sam formularz wyglądają poprawnie na
każdej powierzchni, bez ani jednego koloru na sztywno w komponencie.

### Dlaczego akurat tak, a nie przez nazwy klas

Wcześniejsza wersja szablonów wydarzeń nadpisywała dosłownie `.bg-white` przez `!important`.
Taka reguła **przestaje cokolwiek dopasowywać w chwili, gdy komponent zamieni klasę na
`bg-card`** — bez błędu w buildzie, bez ostrzeżenia lintu. Nadpisanie tokenu działa na każdy
komponent, który go czyta, dziś i w przyszłości.

### Kroje

- **Bricolage Grotesque** (`font-display`) — nagłówki. Zmienna szerokość liter daje
  charakter, którego nie miał Playfair.
- **Inter** (`font-sans`) — tekst.
- **Great Vibes** (`font-logo`) — **wyłącznie nazwa „Story Atelier"**, dobrana do kaligrafii
  wymalowanej na ścianie studia. Skrypty w małych stopniach i w dłuższym tekście stają się
  nieczytelne, więc interfejs zostaje na groteskach.

Oba kroje ładują podzbiór **`latin-ext`**. Bez niego polskie `ł ą ę ś ż ź ć ń` idą krojem
systemowym w środku wyrazu — litery mają inną grubość i szerokość niż reszta słowa. To jedna
z najczęstszych przyczyn, dla których polska strona wygląda tanio.

### Wędrujący akcent

Odcień akcentu krąży w cyklu 12 s, sterowany zarejestrowaną zmienną `--akcent-h`.
Nasycenie i jasność są **stałe**, więc każda faza cyklu ma ten sam kontrast i żaden moment
nie staje się nieczytelny. Najsłabszy odcień to głęboki błękit: zmierzone 3,43:1 na tle
studia, przy progu 3:1 dla dużego tekstu. **Nie schodź z jasnością poniżej 60%.**

Litery nagłówka mają przesunięcie fazy liczone z ich udziału w całości, tak by różnica
między pierwszą i ostatnią wynosiła około 50°. Stały krok na literę dawał kilka pełnych
obrotów koła barw naraz i wyglądał jak przedszkole.

### Sygnatury

- `.film-edge` — perforacja taśmy filmowej jako przerywnik sekcji. Ten sam motyw wypalamy
  w zdjęcia z fotobudki w wariancie „film", więc serwis i pamiątka mówią jednym językiem.
- `.viewfinder` — znaczniki kadrowania z celownika aparatu.
- `.flip` — karta obracana o 180°.

---

## Polityka motywu

`src/lib/theme.ts`. Rozstrzyga jedno pytanie: **czyj jest ten ekran.**

1. **Wybór zapisany na urządzeniu wygrywa zawsze.** Ktoś stanął przed tym ekranem i wybrał
   świadomie; żadne ustawienie zdalne nie ma prawa tego cofnąć.
2. **Album to cudzy telefon** — zwracamy `null` i oddajemy decyzję ustawieniu systemu gościa.
   Ciemny motyw w telefonie bywa decyzją o czytelności, nie o guście.
3. **Fotobudka i Live Wall to urządzenia w zaciemnionej sali** — domyślnie tryb sali.

Skrypt w `<head>` powiela te reguły **świadomie**, bo motyw musi być ustawiony przed pierwszym
malowaniem. Bez tego na projektorze widać błysk białego tła. Cena to duplikacja logiki, więc
oba warianty leżą w jednym pliku obok siebie — rozjazd między nimi widać w jednym diffie.

`<html>` ma `suppressHydrationWarning`. To nie zamiatanie problemu: skrypt zmienia atrybut
przed hydratacją, więc serwer i klient **z definicji** się tam różnią. Atrybut działa tylko
na ten jeden element i nie tłumi rozjazdów w treści strony.

---

## Formularz zapytań

### Cztery ścieżki, nie osiem usług

Pytania różnią się realnie tylko w czterech przypadkach: wesele, event, wideo na zamówienie,
wynajem studia. Wesele obejmuje reportaż, film, shorty i List do Rodziców jako wybór zakresu,
bo prowadzą do tych samych informacji. Ośmiu formularzy nikt nie wypełni.

**Zasada doboru pytań:** każde pytanie musi zmieniać wycenę albo harmonogram. Jeśli nie
zmienia żadnego z nich, wypada — każde dodatkowe pole obniża liczbę wysłanych formularzy.

### Zapis najpierw, mail potem

Zapytanie **zawsze** trafia do tabeli `inquiries`. Powiadomienie mailem jest osobnym,
nieblokującym krokiem. Formularz oparty wyłącznie na zewnętrznej usłudze mailowej gubi
zgłoszenie za każdym razem, gdy usługa nie odpowie — i nikt się o tym nie dowie, bo nie ma
czego porównać. Kolumna `powiadomienie_wyslane_at` równa `NULL` pokazuje, o których
zapytaniach nikogo nie powiadomiono.

### Walidacja po stronie serwera

Pola wymagane sprawdza również trasa API. Walidację w przeglądarce obchodzi się jednym
żądaniem, a ograniczenia `CHECK` w tabeli dałyby wtedy komunikat bazy danych zamiast
czytelnego zdania po polsku.

Pułapka na boty to ukryte pole `strona`. Gdy jest wypełnione, trasa odpowiada **sukcesem** —
bot nie dostaje sygnału, że został wykryty.

---

## Dane strukturalne i pozycjonowanie

`src/lib/seo.ts` buduje graf schema.org z `oferta.ts`, więc adres w danych dla wyszukiwarek
nie może rozjechać się z tym, co widzi człowiek.

**Dwa osobne wpisy lokalizacji, nie jeden.** Google wiąże wynik lokalny z fizycznym adresem;
jeden obiekt z dwoma adresami nie rankuje w żadnym z miast.

**Czego tam świadomie nie ma:** współrzędnych geograficznych. Zmyślone dane w tym miejscu
kolidują z profilem firmy i wizytówkami w katalogach, a rozbieżność obniża zaufanie do całej
wizytówki bardziej niż brak pola.

`public/llms.txt` podaje te same fakty w formie, którą wyszukiwarki generatywne mogą
zacytować bez wyciągania ich z układu strony. Zawiera też sekcję „czego nie robimy", bo
modele równie chętnie przypisują firmie usługi, których nie świadczy.

---

## Fotobudka

`src/lib/photobooth.ts`.

- **Oprawa jest wypalana w plik**, nie malowana wokół interfejsu. Dolny margines jest szerszy
  od górnego — tak oprawia się passe-partout, bo oko czyta wtedy kadr jako wyśrodkowany.
- **Seria kadrów staje się jedną zapętloną animacją.** Nagrywamy płótno przez `MediaRecorder`,
  ten sam mechanizm, którego fotobudka używa do trybu wideo, więc nie potrzeba enkodera
  z zewnątrz ani nowego typu w bazie.
- **Klatki wchodzą do animacji już z wypaloną oprawą.** Ponowne rysowanie oprawy daje ramkę
  w ramce i podpis nadrukowany na podpisie. W kodzie stoi o tym komentarz.
- Seria większa niż jeden kadr wysyła **jedną** animację, nie kilka niemal identycznych zdjęć:
  mniej pozycji do moderacji, ciekawsza pamiątka.

---

## Pułapki

Rzeczy, które już raz zabrały czas. Warto je znać, zanim zabiorą go drugi raz.

### Turbopack nie przebudowuje `globals.css`

Objaw: reguła jest w pliku źródłowym, ale w arkuszu serwowanym pod `/_next/static/.../*.css`
jej nie ma, więc „zmiana nie działa". Lek: zatrzymać dev, usunąć `.next`, uruchomić ponownie.

**Wniosek do pracy: po zmianie w arkuszu weryfikuj w tym, co serwer oddaje, a nie w pliku.**
Obecność reguły w źródle niczego nie dowodzi.

### `@theme inline` omija warstwę tokenów

Słowo `inline` w `@theme` każe Tailwindowi wstawić wartość w miejscu użycia, więc
`bg-background` kompiluje się do `hsl(var(--background))` i **całkowicie omija**
`--color-background`. Wszystkie zasięgi w tym pliku nadpisują `--color-*`, więc blok kolorów
**nie może** mieć `inline`.

### `insert().select()` w Supabase wymaga uprawnienia SELECT

Polityki dają anonimowi wyłącznie INSERT, bo zapytania to dane osobowe. Odczytanie właśnie
wstawionego wiersza, żeby dostać jego `id`, **też jest odczytem** i RLS je odrzuca. Poprawka
nie polega na poluzowaniu polityki: identyfikator generujemy po stronie serwera przed
wstawieniem.

To samo dotyczy UPDATE — oznaczenie wysłanego powiadomienia wymaga klucza `service_role`,
a bez niego świadomie nie znaczymy, zamiast kończyć cichą odmową.

### Kod 200 z Next.js niczego nie dowodzi

Przy renderowaniu strumieniowym nagłówki lecą przed zapytaniem do bazy, więc `notFound()`
dochodzi już w strumieniu i status zostaje 200. **Mierz treścią strony, nie statusem.**

### Wyrównanie pól formularza to `subgrid`

Pola z podpowiedzią i bez niej miały kontrolki na różnych wysokościach, bo każde było własną
siatką. `.pole { grid-row: span 3; grid-template-rows: subgrid }` sprawia, że etykieta,
podpowiedź i kontrolka dziedziczą pasy od rodzica i wyrównują się w całym rzędzie.

### Obrót karty potrzebuje `focus-within`

Na ekranie dotykowym `hover` nie istnieje, a z klawiatury nie da się „najechać". Bez
`focus-within` odwrót karty jest niedostępny dla telefonu i klawiatury. Treść na odwrocie
nigdy nie może być jedyną drogą do czegokolwiek.

### Po masowej podmianie w plikach uruchom `tsc`

Automatyczna zamiana tekstu potrafi trafić w coś innego, niż zamierzasz, i **nie zaprotestuje**.
Zdarzyło się już, że globalna podmiana uszkodziła wielkie litery w trzech plikach
(`Promise` → `rromise`) i wykrył to dopiero kompilator, nie wzrok. Pomocny jest też skan
wzorcem `\b([a-z])\1[a-z]{3,}` — podwojona pierwsza litera to sygnatura takiego błędu.
