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
    opis: "Zdjęcia całego dnia bez zatrzymywania wesela — prawdziwe gesty zamiast ustawianych pozycji.",
    szczegoly: [
      "Pracujemy reportażowo: jesteśmy obok, a nie na środku. Nie przerywamy ceremonii, nie ustawiamy gości do grup i nie każemy powtarzać pierwszego tańca. Dzień ma się wydarzyć raz, a naszym zadaniem jest go zapisać.",
      "Zdjęcia obejmują przygotowania, ceremonię, przyjęcie i zabawę do końca umówionych godzin. Do tego sesja pary — w plenerze albo w naszym studiu, zależnie od pogody i tego, co Wam bliższe.",
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
      "Film powstaje z trzech perspektyw: kamery z ręki, która jest blisko emocji, gimbala dla płynnych przejść i drona dla kadrów, których inaczej nie da się zrobić — plener, dojazd do kościoła, całe wesele z góry.",
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
    opis: "Krótkie formy pionowe nagrywane w studiu jeszcze przed weselem — gotowe do publikacji przed dniem ślubu.",
    szczegoly: [
      "Spotykamy się w studiu przed weselem i nagrywamy serię krótkich, pionowych materiałów: zapowiedź, wspólne odpowiedzi na pytania, zaproszenie dla gości. Wszystko w warunkach studyjnych, więc światło i dźwięk są przewidywalne — nie zależą od pogody ani od tego, czy w tle nie przejedzie autobus.",
      "To materiał, który działa jeszcze przed ślubem: buduje nastrój, można go wysłać gościom, wrzucić na Instagram albo puścić na sali jako wstęp.",
    ],
    punkty: [
      "Nagranie w studiu, format pionowy 9:16",
      "Kilka gotowych materiałów z jednego spotkania",
      "Montaż, napisy i muzyka",
      "Termin przed weselem, bez pośpiechu",
    ],
  },
  {
    id: "list-do-rodzicow",
    tytul: "List do Rodziców",
    opis: "Para nagrywa w studiu kilka słów do swoich Rodziców. Montujemy to w film, który można wyświetlić na sali albo wręczyć jako pamiątkę.",
    szczegoly: [
      "Rodzice zwykle nie dostają nic poza zdjęciem z grupowej. Ten pomysł to odwrócenie sytuacji: Para przychodzi do studia i mówi do kamery to, czego zwykle nie mówi się na głos — Mamie i Tacie osobno albo obojgu razem.",
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
    opis: "Chrzty, komunie, jubileusze, imprezy firmowe i wydarzenia okolicznościowe — foto i wideo.",
    szczegoly: [
      "Obsługujemy uroczystości rodzinne i firmowe: chrzty, komunie, rocznice, jubileusze, wigilie firmowe, konferencje i otwarcia. Zakres dobieramy do wydarzenia — czasem wystarczy fotograf, czasem potrzebna jest kamera i mikrofony na mówców.",
      "Przy wydarzeniach firmowych zwykle liczy się też tempo: materiał do publikacji tego samego albo następnego dnia. Da się to zaplanować, jeśli wiemy o tym z wyprzedzeniem.",
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
    opis: "Produkcja komercyjna: materiały dla firm, reklamy, filmy wizerunkowe i wszystko, co wymaga scenariusza.",
    szczegoly: [
      "To nasza specjalizacja poza wydarzeniami. Filmy wizerunkowe, materiały produktowe, reklamy, nagrania szkoleniowe, relacje z zakładu produkcyjnego. Zaczynamy od tego, co ma się stać po obejrzeniu filmu, a scenariusz i forma z tego wynikają.",
      "Prowadzimy całość: scenariusz, plan zdjęciowy, zdjęcia w studiu lub w terenie, dron, montaż, kolor, dźwięk i napisy. Możemy też wejść tylko w jeden etap, jeśli reszta jest już zrobiona.",
    ],
    punkty: [
      "Scenariusz i plan przed zdjęciami",
      "Zdjęcia w studiu i w terenie, także z drona",
      "Montaż, korekcja koloru, dźwięk, napisy",
      "Wersje pod konkretne platformy i formaty",
    ],
  },
  {
    id: "wynajem-studia",
    tytul: "Wynajem studia nagraniowego",
    opis: "Wrocław. Gotowe stanowisko do podcastu, kursu albo pierwszych nagrań na YouTube, razem z obsługą techniczną.",
    szczegoly: [
      "Studio we Wrocławiu wynajmujemy godzinowo. Jest przygotowane i ustawione — oświetlenie, mikrofony na wysięgnikach, tła, kamery. Przychodzisz z tematem i gościem, nie ze sprzętem.",
      "Zależy nam szczególnie na tych, którzy zaczynają. Pierwsze nagranie potrafi zniechęcić na zawsze, jeśli trzeba jednocześnie prowadzić rozmowę i walczyć z technikaliami. Dlatego w cenie jest ktoś, kto ustawi kadr i poziomy i zostanie na miejscu.",
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
  adres: string;
  opis: string;
};

export const LOKALIZACJE: Lokalizacja[] = [
  {
    miasto: "Wrocław",
    adres: "Gwiaździsta 6/5, Wrocław",
    opis: "Biuro fotograficzne i studio nagraniowe. Niedaleko Sky Tower.",
  },
  {
    miasto: "Polkowice",
    adres: "Młyńska 10, 59-100 Polkowice",
    opis: "Biuro i studio fotograficzne.",
  },
];
