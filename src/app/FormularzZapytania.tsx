"use client";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { PYTANIA_KONTAKTOWE, SCIEZKI, type Pytanie, type Sciezka } from "@/lib/zapytania";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

type Odpowiedzi = Record<string, string | string[]>;

const POLE = "h-12 w-full rounded-[var(--radius)] border border-input bg-background px-4 text-sm text-foreground outline-none transition focus:border-accent";

export function FormularzZapytania() {
  const [sciezka, setSciezka] = useState<Sciezka | null>(null);
  const [krok, setKrok] = useState<"pytania" | "kontakt">("pytania");
  const [odpowiedzi, setOdpowiedzi] = useState<Odpowiedzi>({});
  const [zgoda, setZgoda] = useState(false);
  const [strona, setStrona] = useState(""); // pulapka na boty
  const [wysylanie, setWysylanie] = useState(false);
  const [blad, setBlad] = useState("");
  const [gotowe, setGotowe] = useState(false);

  function ustaw(id: string, wartosc: string | string[]) {
    setOdpowiedzi((poprzednie) => ({ ...poprzednie, [id]: wartosc }));
  }

  function przelaczWielokrotny(id: string, opcja: string) {
    const obecne = odpowiedzi[id];
    const lista = Array.isArray(obecne) ? obecne : [];
    ustaw(id, lista.includes(opcja) ? lista.filter((o) => o !== opcja) : [...lista, opcja]);
  }

  /** Zamkniecie okna czysci odpowiedzi swiadomie: pytania roznia sie miedzy sciezkami,
      wiec zostawienie ich groziloby doniesieniem odpowiedzi z poprzedniej kategorii. */
  function zamknij() {
    setSciezka(null);
    setOdpowiedzi({});
    setKrok("pytania");
    setBlad("");
    setGotowe(false);
    setZgoda(false);
  }

  function wroc() {
    setBlad("");
    if (krok === "kontakt") { setKrok("pytania"); return; }
    zamknij();
  }

  async function wyslij() {
    if (!sciezka) return;
    setBlad("");
    setWysylanie(true);
    try {
      const odpowiedz = await fetch("/api/zapytanie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sciezka: sciezka.id, odpowiedzi, strona }),
      });
      const tresc = (await odpowiedz.json()) as { ok?: boolean; blad?: string };
      if (!odpowiedz.ok) { setBlad(tresc.blad ?? "Nie udało się wysłać. Spróbuj ponownie."); return; }
      setGotowe(true);
    } catch {
      setBlad("Brak połączenia. Sprawdź internet albo zadzwoń.");
    } finally {
      setWysylanie(false);
    }
  }

  const pytania = !sciezka ? [] : krok === "pytania" ? sciezka.pytania : PYTANIA_KONTAKTOWE;

  return (
    <>
      <p className="text-sm text-muted-foreground">Zacznijcie od tego, co planujecie. Pytania różnią się dla każdej z tych rzeczy.</p>
      <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius)] bg-border sm:grid-cols-2">
        {SCIEZKI.map((pozycja) => (
          <button
            key={pozycja.id}
            type="button"
            onClick={() => { setSciezka(pozycja); setKrok("pytania"); }}
            aria-haspopup="dialog"
            className="group bg-background p-7 text-left transition-colors hover:bg-muted"
          >
            <span className="block h-px w-10 bg-accent transition-all duration-300 group-hover:w-20" />
            <span className="mt-5 block text-lg font-semibold tracking-[-0.02em]">{pozycja.nazwa}</span>
            <span className="mt-2 block text-sm leading-6 text-muted-foreground">{pozycja.opis}</span>
          </button>
        ))}
      </div>

      {/* Pytania idą w pełnoekranowe okno, tak jak szczegóły usług wyżej. Dwa powody:
          formularz przestaje konkurować o uwagę z resztą strony, a na telefonie nie trzeba
          przewijać przez pół serwisu, żeby wrócić do pierwszego pola. */}
      <Dialog open={sciezka !== null} onOpenChange={(otwarte) => { if (!otwarte) zamknij(); }}>
        <DialogContent className="inset-0 left-0 top-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none p-0">
          {sciezka && (
            <div className="surface-studio min-h-full">
              <div className="mx-auto max-w-4xl px-6 py-24 sm:px-10">
                {gotowe ? (
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
                    <DialogTitle className="mt-8 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] tracking-[-0.03em]">
                      Mamy Wasze zapytanie
                    </DialogTitle>
                    <p className="mx-auto mt-6 max-w-md leading-7 text-muted-foreground">
                      Odezwiemy się na podany adres. Jeśli sprawa jest pilna, zadzwońcie. Numer jest na stronie głównej.
                    </p>
                    <Button size="lg" className="mt-10" onClick={zamknij}>Zamknij</Button>
                  </div>
                ) : (
                  <FormularzWnetrze
                    sciezka={sciezka}
                    krok={krok}
                    pytania={pytania}
                    odpowiedzi={odpowiedzi}
                    zgoda={zgoda}
                    strona={strona}
                    blad={blad}
                    wysylanie={wysylanie}
                    setStrona={setStrona}
                    setZgoda={setZgoda}
                    ustaw={ustaw}
                    przelacz={przelaczWielokrotny}
                    wroc={wroc}
                    dalej={() => { setBlad(""); setKrok("kontakt"); }}
                    wyslij={wyslij}
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormularzWnetrze({
  sciezka, krok, pytania, odpowiedzi, zgoda, strona, blad, wysylanie,
  setStrona, setZgoda, ustaw, przelacz, wroc, dalej, wyslij,
}: {
  sciezka: Sciezka;
  krok: "pytania" | "kontakt";
  pytania: Pytanie[];
  odpowiedzi: Odpowiedzi;
  zgoda: boolean;
  strona: string;
  blad: string;
  wysylanie: boolean;
  setStrona: (wartosc: string) => void;
  setZgoda: (wartosc: boolean) => void;
  ustaw: (id: string, wartosc: string | string[]) => void;
  przelacz: (id: string, opcja: string) => void;
  wroc: () => void;
  dalej: () => void;
  wyslij: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={wroc} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Wróć
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          krok {krok === "pytania" ? "1" : "2"} z 2
        </p>
      </div>

      <DialogTitle className="mt-8 font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[0.98] tracking-[-0.03em]">
        {sciezka.nazwa}
      </DialogTitle>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
        {krok === "pytania" ? sciezka.opis : "Zostaw kontakt, żebyśmy mieli jak odpowiedzieć."}
      </p>

      <div className="pola mt-12">
        {pytania.map((pytanie) => (
          <Pole
            key={pytanie.id}
            pytanie={pytanie}
            wartosc={odpowiedzi[pytanie.id]}
            ustaw={(w) => ustaw(pytanie.id, w)}
            przelacz={(o) => przelacz(pytanie.id, o)}
          />
        ))}
      </div>

      {krok === "kontakt" && (
        <>
          {/* Pulapka na boty. Ukryta przed czlowiekiem, ale NIE przez display:none -
              czesc botow to wykrywa; dlatego wynosimy poza kadr i chowamy przed czytnikami. */}
          <label className="absolute left-[-9999px]" aria-hidden="true">
            Strona
            <input tabIndex={-1} autoComplete="off" value={strona} onChange={(e) => setStrona(e.target.value)} />
          </label>

          <label className="mt-8 flex gap-3 text-sm leading-6 text-muted-foreground">
            <input type="checkbox" checked={zgoda} onChange={(e) => setZgoda(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
            <span>
              Zgadzam się na kontakt w sprawie tego zapytania. Dane wykorzystujemy wyłącznie do odpowiedzi
              i przygotowania oferty.
            </span>
          </label>
        </>
      )}

      {blad && <p className="mt-6 rounded-[var(--radius)] border border-border bg-muted p-4 text-sm">{blad}</p>}

      <div className="mt-8 flex flex-wrap gap-3">
        {krok === "pytania" ? (
          <Button size="lg" className="gap-2" onClick={dalej}>
            Dalej <ArrowUpRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" className="gap-2" disabled={wysylanie || !zgoda} onClick={wyslij}>
            {wysylanie ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {wysylanie ? "Wysyłamy…" : "Wyślij zapytanie"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Pole({
  pytanie,
  wartosc,
  ustaw,
  przelacz,
}: {
  pytanie: Pytanie;
  wartosc: string | string[] | undefined;
  ustaw: (wartosc: string) => void;
  przelacz: (opcja: string) => void;
}) {
  const tekstowa = typeof wartosc === "string" ? wartosc : "";
  const szeroki = pytanie.typ === "dlugi" || pytanie.typ === "wielokrotny";

  return (
    <div className={`pole ${szeroki ? "sm:col-span-2" : ""}`}>
      {/* Naglowek i podpowiedz to osobne pasy siatki - patrz `.pole` w globals.css.
          Dzieki temu kontrolka lezy w tym samym pasie co kontrolki obok, nawet gdy
          sasiednie pole nie ma podpowiedzi. */}
      <div className="pole-naglowek">
        <label className="block text-sm font-semibold">
          {pytanie.etykieta}
          {pytanie.wymagane && <span className="text-accent"> *</span>}
        </label>
      </div>
      <div className="pole-podpowiedz">
        {pytanie.podpowiedz && <p className="text-xs leading-5 text-muted-foreground">{pytanie.podpowiedz}</p>}
      </div>

      <div className="mt-3 self-end">
        {pytanie.typ === "dlugi" && (
          <textarea value={tekstowa} onChange={(e) => ustaw(e.target.value)} rows={4} className={POLE.replace("h-12", "min-h-32 py-3")} />
        )}
        {pytanie.typ === "tekst" && <input value={tekstowa} onChange={(e) => ustaw(e.target.value)} className={POLE} />}
        {pytanie.typ === "data" && <input type="date" value={tekstowa} onChange={(e) => ustaw(e.target.value)} className={POLE} />}
        {pytanie.typ === "godzina" && <input type="time" value={tekstowa} onChange={(e) => ustaw(e.target.value)} className={POLE} />}
        {pytanie.typ === "liczba" && <input type="number" min={0} value={tekstowa} onChange={(e) => ustaw(e.target.value)} className={POLE} />}
        {pytanie.typ === "wybor" && (
          <select value={tekstowa} onChange={(e) => ustaw(e.target.value)} className={POLE}>
            <option value="">Wybierz…</option>
            {pytanie.opcje?.map((opcja) => <option key={opcja} value={opcja}>{opcja}</option>)}
          </select>
        )}
        {pytanie.typ === "wielokrotny" && (
          <div className="flex flex-wrap gap-2">
            {pytanie.opcje?.map((opcja) => {
              const wybrane = Array.isArray(wartosc) && wartosc.includes(opcja);
              return (
                <button
                  key={opcja}
                  type="button"
                  onClick={() => przelacz(opcja)}
                  aria-pressed={wybrane}
                  className={`rounded-full border px-4 py-2 text-sm transition ${wybrane ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {opcja}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
