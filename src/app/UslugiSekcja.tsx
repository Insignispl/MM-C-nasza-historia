"use client";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/Dialog";
import { USLUGI, type Usluga } from "@/lib/oferta";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function UslugiSekcja() {
  const [otwarta, setOtwarta] = useState<Usluga | null>(null);

  return (
    <section id="uslugi" className="surface-paper px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-lg text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Co robimy</h2>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Dwa biura fotograficzne i studio nagraniowe we Wrocławiu. Sprzęt do zdjęć, filmu z ręki, gimbala i drona.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 lg:grid-cols-3">
          {USLUGI.map((usluga) => (
            <button
              key={usluga.id}
              type="button"
              onClick={() => setOtwarta(usluga)}
              aria-haspopup="dialog"
              className="group flex flex-col items-start bg-background p-8 text-left transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)]"
            >
              <span className="h-px w-10 bg-accent transition-all duration-300 group-hover:w-20" />
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{usluga.tytul}</h3>
              <p className="mt-3 flex-1 leading-7 text-muted-foreground">{usluga.opis}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Szczegóły <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={otwarta !== null} onOpenChange={(open) => { if (!open) setOtwarta(null); }}>
        <DialogContent className="inset-0 left-0 top-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none p-0">
          {otwarta && (
            <div className="surface-studio min-h-full">
              <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-24 sm:px-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Usługa</p>
                <DialogTitle className="mt-6 text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
                  {otwarta.tytul}
                </DialogTitle>
                <DialogDescription className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {otwarta.opis}
                </DialogDescription>

                <div className="film-edge my-12" />

                <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-6">
                    {otwarta.szczegoly.map((akapit) => (
                      <p key={akapit.slice(0, 24)} className="leading-8 text-muted-foreground">{akapit}</p>
                    ))}
                  </div>
                  <ul className="space-y-4 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    {otwarta.punkty.map((punkt) => (
                      <li key={punkt} className="flex gap-4">
                        <span className="mt-3 h-px w-5 shrink-0 bg-accent" />
                        <span className="leading-7">{punkt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-14 flex flex-wrap gap-3">
                  <Link href="/#kontakt" onClick={() => setOtwarta(null)}>
                    <Button size="lg" className="gap-2">Zapytaj o termin <ArrowUpRight className="h-4 w-4" /></Button>
                  </Link>
                  {otwarta.link && (
                    <Link href={otwarta.link} onClick={() => setOtwarta(null)}>
                      <Button size="lg" variant="outline">{otwarta.linkLabel}</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
