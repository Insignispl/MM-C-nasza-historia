import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { LOKALIZACJE } from "@/lib/oferta";
import { UslugiSekcja } from "./UslugiSekcja";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function PhotographerLanding() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("id,slug,couple_name,wedding_date,location,portfolio_title,portfolio_description,event_type").eq("is_portfolio", true).eq("status", "live").order("wedding_date", { ascending: false });
  const ids = events?.map((event) => event.id) || [];
  const { data: media } = ids.length ? await supabase.from("event_media").select("event_id,public_url,type,created_at").in("event_id", ids).eq("approved", true).eq("type", "image").order("created_at") : { data: [] };
  const coverByEvent = new Map<string, string>();
  media?.forEach((item) => { if (!coverByEvent.has(item.event_id)) coverByEvent.set(item.event_id, item.public_url); });
  const okladka = [...coverByEvent.values()][0];

  return <>
    <section className="surface-studio px-4 pb-24 pt-36">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {LOKALIZACJE.map((l) => l.miasto).join(" · ")}
          </p>
          <h1 className="mt-8 text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.035em]">
            Fotografia, film<br />i <span className="text-accent">studio nagrań</span>.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            Rejestrujemy śluby i wydarzenia, realizujemy wideo na zamówienie i wynajmujemy w pełni wyposażone studio
            tym, którzy nagrywają swój pierwszy podcast.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="#realizacje"><Button size="lg" className="gap-2">Zobacz realizacje <ArrowUpRight className="h-4 w-4" /></Button></Link>
            <Link href="/studio"><Button size="lg" variant="outline" className="gap-2">Wynajmij studio</Button></Link>
          </div>
        </div>
        <div className="viewfinder relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
          {okladka && <Image src={okladka} alt="Realizacja Story Atelier" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 40vw" />}
        </div>
      </div>
      <div className="film-edge mx-auto mt-24 max-w-6xl" />
    </section>

    <UslugiSekcja />

    <section className="surface-studio px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Studio nagraniowe · Wrocław</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Nagraj tu swój pierwszy odcinek.</h2>
          <p className="mt-6 max-w-lg leading-7 text-muted-foreground">
            Oświetlenie, mikrofony na wysięgnikach, tła i obsługa techniczna. Przychodzisz z tematem, wychodzisz
            z gotowym materiałem — bez kupowania sprzętu na start.
          </p>
          <Link href="/studio"><Button size="lg" className="mt-9 gap-2">Sprawdź studio <ArrowUpRight className="h-4 w-4" /></Button></Link>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border">
          {[
            ["Podcast wideo", "Wiele kamer i mikrofonów"],
            ["Shorty i Reels", "Format pionowy, gotowy do publikacji"],
            ["Nagrania kursów", "Prompter i tło jednolite"],
            ["Sesje w studiu", "Światło ustawione pod obraz"],
          ].map(([nazwa, opis]) => (
            <div key={nazwa} className="bg-background p-7">
              <dt className="text-sm font-semibold">{nazwa}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">{opis}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    <section id="realizacje" className="surface-paper px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="film-edge mb-16" />
        <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Realizacje</h2>
        {events?.length ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {events.map((event, index) => (
              <Link key={event.id} href={`/historia/${event.slug}`} className={`viewfinder group relative min-h-[380px] overflow-hidden rounded-lg bg-muted ${index === 0 ? "md:col-span-2 md:min-h-[520px]" : ""}`}>
                {coverByEvent.get(event.id) && <Image src={coverByEvent.get(event.id)!} alt={event.portfolio_title || event.couple_name} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" sizes={index === 0 ? "100vw" : "50vw"} />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{event.event_type === "wedding" ? "Reportaż ślubny" : "Event"}</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">{event.portfolio_title || event.couple_name}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">{event.portfolio_description || event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-14 rounded-lg border border-dashed border-border p-16 text-center text-muted-foreground">Portfolio jest właśnie przygotowywane.</p>
        )}
      </div>
    </section>

    <section id="kontakt" className="surface-studio px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Gdzie nas znaleźć</h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-border md:grid-cols-2">
          {LOKALIZACJE.map((lokalizacja) => (
            <div key={lokalizacja.miasto} className="bg-background p-8">
              <MapPin className="h-5 w-5 text-accent" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">{lokalizacja.miasto}</h3>
              <p className="mt-3 leading-7">{lokalizacja.adres}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{lokalizacja.opis}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>;
}
