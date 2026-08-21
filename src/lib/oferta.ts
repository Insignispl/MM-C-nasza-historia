/** Jedno zrodlo prawdy o ofercie i biurach - uzywane przez strone glowna, /studio i metadane. */

export type Usluga = {
  id: string;
  tytul: string;
  opis: string;
  /** Rozwiniecie pokazywane w pelnoekranowym oknie po klikniecia w dzial. */
  szczegoly: string[];
  punkty: string[];
  link?: string;
  linkLabel?: string;
};

export const USLUGI: Usluga[] = [
  {
    id: "reportaz-slubny",
    tytul: "Reportaż ślubny",
    opis: "Zdjęcia całego dnia bez zatrzymywania wesela. Prawdziwe gesty zamiast ustawianych pozycji.",
    szczegoly: [
      "Pracujemy reportażowo, czyli jesteśmy obok, a nie na środku. Nie przerywamy ceremonii, nie ustawiamy gości do grup i nie prosimy o powtórzenie pierwszego tańca. Ten dzień wydarzy się raz i naszym zadaniem jest go zapisać.",
      "Zdjęcia obejmują przygotowania, ceremonię, przyjęcie i zabawę do końca umówionych godzin. Do tego sesja pary w plenerze albo w naszym studiu, zależnie od pogody i tego, co jest Wam bliższe.",
    ],
    punkty: [
      "Przygotowania, ceremonia, przyjęcie i zabawa",
      "Sesja pary w plenerze albo w studiu",
      "Obróbka i galeria online do pobrania",
      "Możliwość pracy dwóch fotografów",
    ],
  },
  {
    id: "film-slubny",
    tytul: "Film ślubny",
    opis: "Obraz z ręki, gimbala i drona. Pełna historia dnia oraz krótszy teledysk do pokazania znajomym.",
    szczegoly: [
      "Film powstaje z trzech perspektyw. Kamera z ręki jest blisko emocji, gimbal daje płynne przejścia, a dron kadry, których inaczej nie da się zrobić: plener, dojazd do kościoła, całe wesele z góry.",
      "Dostajecie dwie wersje. Krótszy teledysk kilkuminutowy, ten, który faktycznie się pokazuje znajomym, oraz dłuższą wersję z ceremonią, przysięgą i życzeniami w całości.",
    ],
    punkty: [
      "Kamera z ręki, gimbal i dron",
      "Teledysk oraz pełna wersja dnia",
      "Dźwięk z mikrofonów, nie z kamery",
      "Kolor korygowany scena po scenie",
    ],
  },
  {
    id: "shorty-para-mloda",
    tytul: "Shorty z Parą Młodą",
    opis: "Krótkie formy pionowe nagrywane w studiu jeszcze przed weselem. Gotowe na TikToka, Reels i Shorts.",
    szczegoly: [
      "Spotykamy się w studiu przed weselem i nagrywamy serię krótkich, pionowych materiałów: zapowiedź, wspólne odpowiedzi na pytania, zaproszenie dla gości. W warunkach studyjnych światło i dźwięk są przewidywalne, więc nie zależą od pogody ani od tego, czy w tle przejedzie autobus.",
      "To materiał, który pracuje jeszcze przed ślubem. Buduje nastrój, można go wysłać gościom, wrzucić na Instagram albo TikToka, a potem puścić na sali jako wstęp.",
    ],
    punkty: [
      "Nagranie w studiu, format pionowy 9:16",
      "Kilka gotowych materiałów z jednego spotkania",
      "Montaż, napisy i muzyka",
      "Wersje pod TikToka, Reels i Shorts",
    ],
  },
  {
    id: "list-do-rodzicow",
    tytul: "List do Rodziców",
    opis: "Para nagrywa w studiu kilka słów do swoich Rodziców. Montujemy to w film do wyświetlenia na sali albo wręczenia jako pamiątka.",
    szczegoly: [
      "Rodzice zwykle nie dostają nic poza zdjęciem z grupowej. Ten pomysł odwraca sytuację. Para przychodzi do studia i mówi do kamery to, czego zwykle nie mówi się na głos. Mamie i Tacie osobno albo obojgu razem.",
      "Nagranie montujemy w krótki film. Można go wyświetlić na sali w trakcie przyjęcia albo wręczyć Rodzicom na nośniku, bez świadków. Obie drogi działają, tylko zupełnie inaczej.",
    ],
    punkty: [
      "Nagranie w studiu, w spokoju i bez publiczności",
      "Pomoc w ułożeniu tego, co chcecie powiedzieć",
      "Montaż z Waszymi zdjęciami z dzieciństwa",
      "Wersja do wyświetlenia na sali lub do wręczenia",
    ],
  },
  {
    id: "eventy",
    tytul: "Eventy i uroczystości",
    opis: "Chrzty, komunie, jubileusze, imprezy firmowe i konferencje. Foto i wideo.",
    szczegoly: [
      "Obsługujemy uroczystości rodzinne i firmowe: chrzty, komunie, rocznice, jubileusze, wigilie firmowe, konferencje i otwarcia. Zakres dobieramy do wydarzenia. Czasem wystarczy fotograf, czasem potrzebna jest kamera i mikrofony na mówców.",
      "Przy wydarzeniach firmowych zwykle liczy się też tempo, bo materiał ma trafić do sieci tego samego albo następnego dnia. Da się to zaplanować, jeśli wiemy o tym z wyprzedzeniem.",
    ],
    punkty: [
      "Uroczystości rodzinne i wydarzenia firmowe",
      "Foto, wideo albo jedno i drugie",
      "Nagłośnienie mówców przy konferencjach",
      "Materiał w skróconym terminie na życzenie",
    ],
  },
  {
    id: "wideo-na-zamowienie",
    tytul: "Wideo na zamówienie",
    opis: "Materiały dla firm i twórców: YouTube, TikTok, Reels, Facebook, LinkedIn oraz reklamy i filmy wizerunkowe.",
    szczegoly: [
      "To nasza specjalizacja poza wydarzeniami. Filmy wizerunkowe, materiały produktowe, reklamy, nagrania szkoleniowe, relacje z zakładu produkcyjnego. Zaczynamy od tego, co ma się stać po obejrzeniu filmu, a scenariusz i forma z tego wynikają.",
      "Jeden dzień zdjęciowy zamieniamy w materiał na kilka kanałów naraz. Dłuższa wersja idzie na YouTube i na stronę, a z tego samego materiału wychodzą pionowe wycinki na TikToka, Reels, Shorts i Facebooka. Każdy w docelowych proporcjach i z napisami, bo większość ludzi obejrzy to bez dźwięku.",
      "Prowadzimy całość: scenariusz, plan zdjęciowy, zdjęcia w studiu lub w terenie, dron, montaż, kolor, dźwięk i napisy. Możemy też wejść tylko w jeden etap, jeśli reszta jest już zrobiona.",
    ],
    punkty: [
      "Scenariusz i plan przed zdjęciami",
      "Jedno nagranie, materiał na kilka platform",
      "Wersje pionowe na TikToka, Reels i Shorts",
      "Napisy, bo większość obejrzy bez dźwięku",
      "Zdjęcia w studiu i w terenie, także z drona",
    ],
  },
  {
    id: "trening-przed-kamera",
    tytul: "Trening przed kamerą",
    opis: "Współpracujemy z trenerami wystąpień publicznych, którzy pracują z osobami rozpoznawalnymi. Kamera przestaje onieśmielać.",
    szczegoly: [
      "Najczęstszy powód, dla którego nagranie wychodzi słabo, nie jest techniczny. Sprzęt można wynająć, światło ustawimy my, ale przed kamerą trzeba jeszcze umieć mówić. Większość ludzi w pierwszym podejściu sztywnieje, gubi wątek i mówi ciszej niż zwykle.",
      "Dlatego pracujemy z trenerami wystąpień publicznych, którzy przygotowują do kamery i na scenę osoby rozpoznawalne. Sesję da się połączyć z nagraniem w studiu, więc uczysz się od razu na swoim materiale, a nie na ćwiczeniach w oderwaniu od tematu.",
    ],
    punkty: [
      "Praca nad głosem, tempem i postawą",
      "Przygotowanie do kamery i na scenę",
      "Sesję można połączyć z nagraniem w studiu",
      "Także dla firm przed konferencją albo webinarem",
    ],
  },
  {
    id: "wynajem-studia",
    tytul: "Wynajem studia nagraniowego",
    opis: "Wrocław. Gotowe stanowisko do podcastu, kursu albo pierwszych nagrań na YouTube i TikToka, razem z obsługą techniczną.",
    szczegoly: [
      "Studio we Wrocławiu wynajmujemy godzinowo. Jest przygotowane i ustawione: oświetlenie, mikrofony na wysięgnikach, tła, kamery. Przychodzisz z tematem i gościem, nie ze sprzętem.",
      "Zależy nam szczególnie na tych, którzy zaczynają. Pierwsze nagranie potrafi zniechęcić na zawsze, jeśli trzeba jednocześnie prowadzić rozmowę i walczyć z technikaliami. Dlatego w cenie jest ktoś, kto ustawi kadr i poziomy, a potem zostanie na miejscu.",
      "Nagrywamy poziomo i pionowo w jednym podejściu, więc z tej samej rozmowy masz odcinek na YouTube i wycinki na TikToka, Reels oraz Shorts.",
    ],
    punkty: [
      "Wynajem godzinowy, sprzęt w cenie",
      "Obsługa techniczna na miejscu",
      "Nagranie poziome i pionowe w jednym podejściu",
      "Montaż jako opcja dodatkowa",
    ],
    link: "/studio",
    linkLabel: "Zobacz studio",
  },
];
export type Lokalizacja = {
  miasto: string;
  /** Do wyswietlenia na stronie. */
  adres: string;
  opis: string;
  /** Czesci adresu rozbite dla danych strukturalnych schema.org (wyniki lokalne w Google). */
  ulica: string;
  /** Kod pocztowy. Brak = pomijamy pole w danych strukturalnych, zeby nie podawac zmyslonego. */
  kod?: string;
  /** Czy w tej lokalizacji jest studio nagraniowe. */
  studioNagran: boolean;
};

export const LOKALIZACJE: Lokalizacja[] = [
  {
    miasto: "Wrocław",
    adres: "Gwiaździsta 6/5, Wrocław",
    opis: "Biuro fotograficzne i studio nagraniowe. Niedaleko Sky Tower.",
    ulica: "Gwiaździsta 6/5",
    kod: "53-413",
    studioNagran: true,
  },
  {
    miasto: "Polkowice",
    adres: "Młyńska 10, 59-100 Polkowice",
    opis: "Biuro i studio fotograficzne.",
    ulica: "Młyńska 10",
    kod: "59-100",
    studioNagran: false,
  },
];

export const KONTAKT = {
  email: "kontakt@storyatelier.pl",
  /** Do wyswietlenia. Wersja do href jest w telHref - bez spacji, inaczej czesc telefonow nie zadzwoni. */
  telefon: "+48 504 652 416",
  telHref: "+48504652416",
};

/**
 * Okladka naglowka strony glownej.
 *
 * JAWNE USTAWIENIE, a nie zgadywanie z bazy. Wcześniej naglowek bral pierwsze
 * zatwierdzone zdjecie portfolio - a przez rosnace sortowanie po created_at bylo to
 * NAJSTARSZE zdjecie, wiec zasiane migracjami zdjecia ze stocka zawsze wygrywaly
 * z nowo wgranymi. Drugi problem: dowolne zdjecie przechodzace moderacje mogло
 * wskoczyc na strone glowna bez wiedzy wlasciciela.
 *
 * Jak ustawic: wrzuc plik do katalogu `public/` i podaj tu sciezke od korzenia,
 * np. "/studio-joanna.jpg". `null` oznacza powrot do zdjecia z bazy.
 */
export const OKLADKA_HERO: string | null = "/studio-joanna.png";