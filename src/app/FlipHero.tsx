import { Button } from "@/components/ui/Button";
import { KONTAKT, OKLADKA_HERO } from "@/lib/oferta";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Kadr, ktory po najechaniu obraca sie o 180 stopni i pokazuje zaproszenie do kontaktu.
 *
 * Dwie rzeczy, ktore trzeba bylo obsluzyc, zeby to nie bylo pulapka:
 *
 * 1. Na ekranie dotykowym hover NIE ISTNIEJE, a z klawiatury nie da sie "najechac".
 *    Dlatego obrot wyzwala rowniez `focus-within` (patrz globals.css) i karta ma
 *    `tabIndex`, wiec tapniecie albo tabulator odwracaja ja tak samo jak kursor.
 * 2. Tresc na odwrocie NIE MOZE byc jedyna droga do czegokolwiek. Te same dwa kanaly
 *    kontaktu sa w sekcji #kontakt na tej samej stronie - odwrot je powtarza, a nie
 *    ukrywa. Inaczej ktos, kto nie trafi w kadr, po prostu by ich nie znalazl.
 */
export function FlipHero({ okladka }: { okladka?: string }) {
  // Jawne ustawienie z oferta.ts ma pierwszenstwo nad zdjeciem z bazy - patrz
  // komentarz przy OKLADKA_HERO. Baza jest tylko zapasem, dopoki plik nie jest wskazany.
  const zrodlo = OKLADKA_HERO ?? okladka;

  return (
    <div className="flip viewfinder aspect-[4/5] w-full" tabIndex={0} aria-label="Kadr z realizacji. Odwróć, aby zobaczyć kontakt">
      <div className="flip-inner">
        <div className="flip-face overflow-hidden rounded-lg bg-muted">
          {zrodlo && (
            <Image src={zrodlo} alt="Studio Story Atelier" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 40vw" />
          )}
        </div>

        {/* Odwrot jest BIALY, mimo ze siedzi w ciemnej sekcji. `surface-paper` przestawia
            tokeny w swoim zasiegu, wiec `bg-card` i kolor tekstu odwracaja sie razem
            i nie trzeba tu ani jednego koloru na sztywno. */}
        <div className="surface-paper flip-face flip-back flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Porozmawiajmy</p>
            <p className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.02em]">
              Napiszcie, co planujecie. Dobierzemy zakres i termin.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Wesele, event firmowy, film na zamówienie albo nagranie w studiu. Każde z nich prowadzimy inaczej,
              więc najlepiej zacząć od rozmowy.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {/* Prowadzi do formularza, nie do `mailto:`. Program pocztowy zostawia goscia
                z pustym oknem i pytaniem "co napisac", a formularz zadaje wlasciwe pytania
                i od razu zbiera to, co potrzebne do wyceny. */}
            <Link href="/#kontakt" className="block">
              <Button className="w-full gap-2">Wypełnij formularz <ArrowUpRight className="h-4 w-4" /></Button>
            </Link>
            <a href={`tel:${KONTAKT.telHref}`} className="block">
              <Button variant="outline" className="w-full">{KONTAKT.telefon}</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
