import { Button } from "@/components/ui/Button";
import { LOKALIZACJE } from "@/lib/oferta";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio nagraniowe we Wrocławiu",
  description: "Wynajem studia nagraniowego we Wrocławiu: podcasty, nagrania na YouTube, kursy i shorty. Oświetlenie, mikrofony i obsługa techniczna w cenie.",
  alternates: { canonical: "/studio" },
};

const WYPOSAZENIE = [
  ["Oświetlenie", "Softboxy z regulacją mocy, światło ustawione pod obraz, a nie pod oko."],
  ["Dźwięk", "Mikrofony dynamiczne na wysięgnikach. Czysty głos, bez pogłosu pomieszczenia."],
  ["Obraz", "Kamery, gimbale i drony. Nagrywamy poziomo i pionowo w jednym podejściu."],
  ["Tła", "Tło jednolite oraz ekran do prezentacji i materiałów na drugim planie."],
  ["Obsługa", "Ktoś, kto ustawi kadr i poziomy. Nie zostajesz sam ze sprzętem."],
  ["Montaż", "Opcjonalnie: cięcie, korekta dźwięku i eksport pod konkretną platformę."],
];

const DLA_KOGO = [
  ["Pierwszy podcast", "Masz temat i gościa, nie masz sprzętu ani akustyki. Przychodzisz i nagrywasz."],
  ["Kanał na YouTube", "Regularne odcinki bez budowania studia w mieszkaniu."],
  ["Kurs online", "Materiał do sprzedaży, nagrany raz i porządnie."],
  ["Shorty i Reels", "Format pionowy nagrywany od razu w docelowych proporcjach, pod TikToka, Reels i Shorts."],
];

export default function StudioPage() {
  const wroclaw = LOKALIZACJE.find((l) => l.miasto === "Wrocław");

  return <>
    <section className="surface-studio px-4 pb-20 pt-36">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Studio nagraniowe · Wrocław</p>
        <h1 className="mt-8 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
          Studio, w którym nagrasz pierwszy odcinek.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
          Wynajmujemy w pełni wyposażone studio razem z obsługą techniczną. Nie musisz kupować sprzętu ani uczyć się
          go obsługiwać, żeby zacząć nagrywać.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#kontakt"><Button size="lg" className="gap-2">Zarezerwuj termin <ArrowUpRight className="h-4 w-4" /></Button></Link>
          <Link href="/#uslugi"><Button size="lg" variant="outline">Pozostałe usługi</Button></Link>
        </div>
      </div>
    </section>

    <section className="surface-paper px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="film-edge mb-14" />
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Co jest w studiu</h2>
        <dl className="mt-12 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 lg:grid-cols-3">
          {WYPOSAZENIE.map(([nazwa, opis]) => (
            <div key={nazwa} className="bg-background p-8">
              <dt className="text-lg font-semibold tracking-[-0.02em]">{nazwa}</dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">{opis}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    <section className="surface-studio px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Dla kogo</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2">
          {DLA_KOGO.map(([nazwa, opis]) => (
            <div key={nazwa} className="bg-background p-8">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{nazwa}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{opis}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Wspolpraca z trenerami wystapien byla dotad wylacznie w opisie uslugi na
        stronie glownej. Tu jest jej wlasciwe miejsce: czyta to ktos, kto za chwile
        stanie przed kamera i zwykle nie boi sie sprzetu, tylko wlasnego glosu. */}
    <section className="surface-paper px-4 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Trening przed kamerą</p>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Sprzęt to łatwiejsza połowa. Trudniejsza to swoboda.
          </h2>
          <p className="mt-6 leading-7 text-muted-foreground">
            Pierwsze nagranie prawie nigdy nie rozbija się o mikrofon. Rozbija się o to, że człowiek słyszy własny
            głos i sztywnieje. Dlatego pracujemy z trenerami wystąpień publicznych, którzy przygotowują do kamery
            i na scenę osoby rozpoznawalne.
          </p>
          <p className="mt-5 leading-7 text-muted-foreground">
            Trening da się połączyć z rezerwacją studia, więc ćwiczysz na swoim materiale, a nie na oderwanych
            zadaniach. Wychodzisz z gotowym odcinkiem i z nawykiem, który zostaje na kolejne.
          </p>
          <Link href="/#kontakt"><Button size="lg" className="mt-9 gap-2">Zapytaj o termin z trenerem <ArrowUpRight className="h-4 w-4" /></Button></Link>
        </div>
        <dl className="grid gap-px overflow-hidden rounded-lg bg-border">
          {[
            ["Głos i tempo", "Gdzie oddychać, gdzie zwolnić, jak nie zjadać końcówek."],
            ["Kamera zamiast widowni", "Patrzenie w obiektyw tak, żeby po drugiej stronie czuło się rozmowę."],
            ["Pierwsze trzydzieści sekund", "Moment, w którym widz decyduje, czy zostaje."],
          ].map(([nazwa, opis]) => (
            <div key={nazwa} className="bg-background p-7">
              <dt className="text-sm font-semibold">{nazwa}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">{opis}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    {wroclaw && (
      <section className="surface-studio px-4 py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <MapPin className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">{wroclaw.adres}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{wroclaw.opis}</p>
          </div>
          <Link href="/#kontakt"><Button variant="outline" size="lg">Umów wizytę</Button></Link>
        </div>
      </section>
    )}
  </>;
}
