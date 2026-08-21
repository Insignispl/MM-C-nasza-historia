/**
 * Drzewo pytan formularza zapytan - jedno zrodlo prawdy dla formularza, walidacji
 * po stronie serwera i tresci maila.
 *
 * DLACZEGO CZTERY SCIEZKI, A NIE SIEDEM USLUG: pytania roznia sie realnie tylko
 * w czterech przypadkach. Wesele, film sluby, shorty i List do Rodzicow prowadza
 * do tych samych informacji (data, miejsca, godziny, zakres), wiec sa jedna sciezka
 * z wyborem zakresu. Siedmiu osobnych formularzy nikt nie wypelni.
 *
 * ZASADA DOBORU PYTAN: kazde pytanie musi zmieniac wycene albo harmonogram.
 * Jesli odpowiedz nie wplywa na zadne z tych dwoch, pytanie leci - bo kazde
 * dodatkowe pole obniza liczbe wyslanych formularzy.
 */

export type TypPytania = "tekst" | "dlugi" | "data" | "godzina" | "liczba" | "wybor" | "wielokrotny";

export type Pytanie = {
  id: string;
  etykieta: string;
  typ: TypPytania;
  opcje?: string[];
  wymagane?: boolean;
  /** Widoczna podpowiedz - tlumaczy, PO CO pytamy. Podnosi wypelnialnosc. */
  podpowiedz?: string;
};

export type Sciezka = {
  id: string;
  nazwa: string;
  opis: string;
  pytania: Pytanie[];
};

export const SCIEZKI: Sciezka[] = [
  {
    id: "wesele",
    nazwa: "Wesele",
    opis: "Reportaż, film, shorty przed weselem, List do Rodziców.",
    pytania: [
      { id: "data", etykieta: "Data ślubu", typ: "data", podpowiedz: "Jeśli nie macie jeszcze daty, zostaw puste i napiszcie o tym w uwagach." },
      { id: "miejsce_ceremonii", etykieta: "Miejscowość ceremonii", typ: "tekst", wymagane: true },
      { id: "miejsce_przyjecia", etykieta: "Miejscowość przyjęcia", typ: "tekst", podpowiedz: "Podajcie, jeśli inna niż ceremonia. Od odległości zależy dojazd." },
      { id: "godzina_start", etykieta: "Godzina ceremonii", typ: "godzina", podpowiedz: "Liczba godzin pracy to główny składnik wyceny." },
      { id: "godzina_koniec", etykieta: "Przewidywany koniec", typ: "godzina" },
      { id: "zakres", etykieta: "Co Was interesuje", typ: "wielokrotny", wymagane: true, opcje: ["Reportaż zdjęciowy", "Film ślubny", "Shorty nagrane w studiu przed weselem", "List do Rodziców", "Fotobudka na przyjęciu", "Jeszcze nie wiemy, doradźcie"] },
      { id: "goscie", etykieta: "Przewidywana liczba gości", typ: "liczba", podpowiedz: "Decyduje o tym, czy potrzebna jest druga osoba w ekipie." },
      { id: "dwie_osoby", etykieta: "Druga osoba w ekipie", typ: "wybor", opcje: ["Tak", "Nie", "Doradźcie"] },
      { id: "plener", etykieta: "Sesja plenerowa w innym terminie", typ: "wybor", opcje: ["Tak", "Nie", "Jeszcze nie wiemy"] },
      { id: "organizacja", etykieta: "Szukacie też kogoś do organizacji wesela", typ: "wybor", opcje: ["Tak", "Nie"], podpowiedz: "Sami tego nie robimy, ale możemy polecić sprawdzoną firmę." },
    ],
  },
  {
    id: "event",
    nazwa: "Event lub uroczystość",
    opis: "Chrzest, komunia, jubileusz, impreza firmowa, konferencja.",
    pytania: [
      { id: "rodzaj", etykieta: "Rodzaj wydarzenia", typ: "wybor", wymagane: true, opcje: ["Chrzest", "Komunia", "Jubileusz lub rocznica", "Impreza firmowa", "Konferencja", "Otwarcie lub event marketingowy", "Inne"] },
      { id: "data", etykieta: "Data", typ: "data", wymagane: true },
      { id: "miejsce", etykieta: "Miejscowość i miejsce", typ: "tekst", wymagane: true },
      { id: "godziny", etykieta: "Ile godzin obsługi", typ: "liczba", podpowiedz: "Główny składnik wyceny." },
      { id: "zakres", etykieta: "Zakres", typ: "wielokrotny", wymagane: true, opcje: ["Zdjęcia", "Wideo", "Jedno i drugie"] },
      { id: "mowcy", etykieta: "Będą przemówienia lub prelekcje", typ: "wybor", opcje: ["Tak", "Nie"], podpowiedz: "Jeśli tak, dokładamy mikrofony. Bez nich dźwięk z sali jest nieużywalny." },
      { id: "termin_materialu", etykieta: "Kiedy potrzebujecie materiału", typ: "wybor", opcje: ["Standardowo", "Następnego dnia", "Tego samego dnia"], podpowiedz: "Skrócony termin wymaga zaplanowania z wyprzedzeniem." },
    ],
  },
  {
    id: "wideo",
    nazwa: "Wideo na zamówienie",
    opis: "Film wizerunkowy, reklama, materiał produktowy, nagranie szkoleniowe.",
    pytania: [
      { id: "cel", etykieta: "Co ma się stać po obejrzeniu filmu", typ: "dlugi", wymagane: true, podpowiedz: "To najważniejsze pytanie w całym formularzu. Od celu zależy forma, długość i budżet." },
      { id: "gdzie_publikacja", etykieta: "Gdzie materiał będzie publikowany", typ: "wielokrotny", opcje: ["Strona internetowa", "YouTube", "Instagram lub TikTok", "LinkedIn", "Targi lub ekran w siedzibie", "Wewnętrznie w firmie"] },
      { id: "scenariusz", etykieta: "Scenariusz", typ: "wybor", opcje: ["Mamy gotowy", "Mamy zarys", "Liczymy na Was"] },
      { id: "lokalizacje", etykieta: "Gdzie zdjęcia", typ: "wielokrotny", opcje: ["W naszym studiu", "U klienta lub w zakładzie", "W terenie", "Jeszcze nie wiemy"] },
      { id: "dron", etykieta: "Potrzebne zdjęcia z drona", typ: "wybor", opcje: ["Tak", "Nie", "Doradźcie"] },
      { id: "deadline", etykieta: "Termin publikacji", typ: "data", podpowiedz: "Bez terminu nie da się zaplanować produkcji." },
      { id: "budzet", etykieta: "Widełki budżetu", typ: "wybor", wymagane: true, opcje: ["do 5 tys. zł", "5–15 tys. zł", "15–40 tys. zł", "powyżej 40 tys. zł", "Nie wiem, potrzebuję orientacji"], podpowiedz: "Bez tego nie da się zaproponować sensownego zakresu. Widełki wystarczą." },
      { id: "dodatki", etykieta: "Dodatkowo", typ: "wielokrotny", opcje: ["Lektor", "Napisy", "Aktorzy lub modele", "Animacja i grafika", "Wersje językowe"] },
    ],
  },
  {
    id: "studio",
    nazwa: "Wynajem studia nagraniowego",
    opis: "Podcast, nagranie na YouTube, kurs, shorty. Wrocław.",
    pytania: [
      { id: "data", etykieta: "Data", typ: "data", wymagane: true },
      { id: "godzina", etykieta: "Od której godziny", typ: "godzina" },
      { id: "godziny", etykieta: "Ile godzin", typ: "liczba", wymagane: true },
      { id: "osoby", etykieta: "Ile osób przed kamerą", typ: "liczba", wymagane: true, podpowiedz: "Od tego zależy liczba mikrofonów i ustawienie kadru." },
      { id: "format", etykieta: "Format nagrania", typ: "wielokrotny", wymagane: true, opcje: ["Poziomy (YouTube)", "Pionowy (Reels, TikTok, Shorts)", "Oba w jednym podejściu"] },
      { id: "rodzaj", etykieta: "Co nagrywacie", typ: "wybor", opcje: ["Podcast", "Odcinek na YouTube", "Kurs online", "Shorty", "Sesja zdjęciowa", "Inne"] },
      { id: "prompter", etykieta: "Potrzebny prompter", typ: "wybor", opcje: ["Tak", "Nie", "Nie wiem, co to"] },
      { id: "montaz", etykieta: "Montaż po nagraniu", typ: "wybor", opcje: ["Tak", "Nie", "Doradźcie"] },
      { id: "pierwszy_raz", etykieta: "Pierwsze nagranie w studiu", typ: "wybor", opcje: ["Tak", "Nie"], podpowiedz: "Jeśli tak, zaplanujemy więcej czasu na spokojny start." },
    ],
  },
];

/** Pola wspolne dla kazdej sciezki - zbierane na koncu, po pytaniach merytorycznych. */
export const PYTANIA_KONTAKTOWE: Pytanie[] = [
  { id: "imie", etykieta: "Imię i nazwisko", typ: "tekst", wymagane: true },
  { id: "email", etykieta: "E-mail", typ: "tekst", wymagane: true },
  { id: "telefon", etykieta: "Telefon", typ: "tekst", podpowiedz: "Nieobowiązkowy, ale przy pilnych terminach szybciej zadzwonić." },
  { id: "uwagi", etykieta: "Cokolwiek jeszcze, co powinniśmy wiedzieć", typ: "dlugi" },
  { id: "skad", etykieta: "Skąd o nas wiecie", typ: "wybor", opcje: ["Polecenie", "Instagram", "Google", "Facebook", "Byliśmy na weselu, które robiliście", "Inaczej"] },
];

export function sciezkaPoId(id: string): Sciezka | undefined {
  return SCIEZKI.find((s) => s.id === id);
}
