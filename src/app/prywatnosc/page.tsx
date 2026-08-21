import { KONTAKT, LOKALIZACJE } from "@/lib/oferta";
import { ADMINISTRATOR, KOMPLETNA, POLA_DO_UZUPELNIENIA } from "@/lib/prywatnosc";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Jak Story Atelier przetwarza dane osobowe: formularz zapytań, materiały z wydarzeń, podstawy prawne i prawa osób, których dane dotyczą.",
  alternates: { canonical: "/prywatnosc" },
  robots: { index: true, follow: true },
};

/**
 * Treść opisuje to, co aplikacja FAKTYCZNIE robi z danymi, bo to wynika z kodu:
 * formularz zapisuje zapytanie do tabeli `inquiries` i opcjonalnie wysyła powiadomienie
 * przez Resend; goście wydarzeń wgrywają materiały do Supabase Storage; wybór motywu
 * ląduje w localStorage przeglądarki. Nie ma tu narzędzi analitycznych ani reklamowych,
 * bo w kodzie ich nie ma.
 *
 * Części, których nie da się wyprowadzić z kodu (dane rejestrowe administratora,
 * okresy przechowywania, region serwerów) są w `lib/prywatnosc.ts` i dopóki są puste,
 * strona jawnie ostrzega, że dokument jest projektem.
 */
export default function PrywatnoscPage() {
  return (
    <div className="surface-paper px-4 pb-24 pt-36">
      <div className="mx-auto max-w-3xl">
        {!KOMPLETNA && (
          <div className="mb-14 rounded-[var(--radius)] border border-accent bg-muted p-6">
            <p className="flex items-center gap-3 font-semibold">
              <AlertTriangle className="h-5 w-5 text-accent" /> Projekt dokumentu, nie wersja końcowa
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ta polityka opisuje poprawnie techniczny obieg danych w serwisie, ale nie jest jeszcze
              kompletna w rozumieniu art. 13 RODO. Brakuje: {POLA_DO_UZUPELNIENIA.join(", ")}.
              Uzupełnij je w pliku <code>src/lib/prywatnosc.ts</code>, a to ostrzeżenie zniknie.
              Przed publikacją dokument powinien przejrzeć prawnik.
            </p>
          </div>
        )}

        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
          Polityka prywatności
        </h1>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Kto przetwarza dane</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Administratorem danych jest {ADMINISTRATOR.nazwa || "[nazwa podmiotu do uzupełnienia]"}
              {ADMINISTRATOR.nip ? `, NIP ${ADMINISTRATOR.nip}` : ""}
              {ADMINISTRATOR.adresRejestrowy ? `, ${ADMINISTRATOR.adresRejestrowy}` : ""}, prowadzący
              działalność pod marką Story Atelier. Biura: {LOKALIZACJE.map((l) => l.adres).join("; ")}.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Kontakt w sprawach danych: <a className="text-accent" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>,
              telefon {KONTAKT.telefon}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Formularz zapytania</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Wysyłając formularz, przekazujesz imię i nazwisko, adres e-mail oraz opcjonalnie telefon,
              a także odpowiedzi na pytania o planowane wydarzenie i uwagi, które sam wpiszesz.
              Używamy ich wyłącznie po to, żeby odpowiedzieć na zapytanie i przygotować ofertę.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Podstawą prawną jest nasz prawnie uzasadniony interes w prowadzeniu korespondencji handlowej
              oraz podjęcie działań przed zawarciem umowy, o które sam wnioskujesz przez wysłanie formularza.
              Zapytanie trafia do naszej bazy, a jeśli powiadomienia mailowe są włączone, jego treść
              wysyłamy również na naszą skrzynkę.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Przechowujemy je {ADMINISTRATOR.retencjaZapytan || "[okres do uzupełnienia]"} od zakończenia korespondencji.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Materiały z wydarzeń i fotobudka</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Na prywatnych stronach wydarzeń goście mogą wgrywać zdjęcia i filmy, zostawiać wpisy
              w księdze oraz nagrywać materiały w fotobudce. Imię gościa jest opcjonalne. Materiały
              są widoczne dopiero po zatwierdzeniu przez fotografa i są dostępne wyłącznie pod
              adresem konkretnego wydarzenia. Strony wydarzeń nie są indeksowane przez wyszukiwarki.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Podstawą jest zgoda wyrażona przez samo przesłanie materiału oraz wykonanie umowy
              z Parą lub organizatorem. Przechowujemy je {ADMINISTRATOR.retencjaMaterialow || "[okres do uzupełnienia]"}.
              Zdjęcie można wycofać, pisząc na adres podany wyżej.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Komu powierzamy dane</h2>
            <ul className="mt-4 space-y-3 leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Supabase</strong> jako dostawca bazy danych i miejsca na pliki. Dane są przechowywane w regionie: {ADMINISTRATOR.regionDanych || "[region do uzupełnienia]"}.</li>
              <li><strong className="text-foreground">Resend</strong> jako dostawca wysyłki poczty, jeśli powiadomienia o zapytaniach są włączone.</li>
              <li><strong className="text-foreground">Dostawca hostingu</strong> serwisu.</li>
            </ul>
            <p className="mt-4 leading-7 text-muted-foreground">
              Nie sprzedajemy danych i nie przekazujemy ich do celów marketingowych podmiotom trzecim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Ciasteczka i pamięć przeglądarki</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Serwis nie korzysta z narzędzi analitycznych ani reklamowych. W pamięci przeglądarki
              zapisujemy jedynie wybrany motyw kolorystyczny, żeby ekran nie zmieniał wyglądu przy
              każdym wejściu. To ustawienie techniczne, nie służy do rozpoznawania osób i możesz je
              usunąć, czyszcząc dane strony w przeglądarce.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">Twoje prawa</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia
              przetwarzania, przeniesienia oraz wniesienia sprzeciwu wobec przetwarzania opartego na
              prawnie uzasadnionym interesie. Zgodę, jeśli była podstawą, możesz wycofać w każdej chwili.
              Wystarczy napisać na adres podany wyżej.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
