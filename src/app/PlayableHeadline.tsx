"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Nagłówek, po którym da się zagrać.
 *
 * Studio sprzedaje dźwięk, więc grający nagłówek jest demonstracją produktu,
 * a nie ozdobnikiem. Trzy decyzje, które o tym decydują:
 *
 * 1. SKALA PENTATONICZNA (bez półtonów) — dowolna kolejność liter brzmi zgodnie.
 *    Na skali durowej co drugi ruch myszką dawałby dysonans.
 * 2. SYNTEZA, nie pliki — Web Audio buduje dźwięk w przeglądarce. Zero zależności
 *    i zero megabajtów do pobrania.
 * 3. DOSTĘPNOŚĆ — rozbicie tekstu na litery psuje czytniki ekranu i zaznaczanie.
 *    Dlatego pełne zdanie jest w warstwie `sr-only`, a rozbita wersja ma
 *    `aria-hidden`. Litery nie są elementami interaktywnymi, więc nie robią
 *    z nagłówka trzydziestu przystanków tabulatora.
 * 4. BEZ PRZYCISKU — dźwięk odblokowuje pierwsze kliknięcie w sam nagłówek.
 *    Przeglądarka nie pozwala utworzyć `AudioContext` bez gestu użytkownika, więc
 *    gest musi skądś przyjść; przycisk „Włącz dźwięk" zajmował miejsce w najważniejszym
 *    punkcie strony i zapowiadał ozdobnik. Teraz to niespodzianka dla tego, kto
 *    dotknie napisu, a nie element interfejsu do obsłużenia.
 *
 *    Świadomie `onClick`, a NIE `onPointerDown`: na ekranie dotykowym `pointerdown`
 *    odpala się również wtedy, gdy ktoś kładzie palec na nagłówku i zaczyna przewijać,
 *    więc strona wydawałaby dźwięki przy zwykłym scrollowaniu. `click` nie odpala się,
 *    gdy gest zamieni się w przewijanie.
 */

// A-moll pentatoniczna, dwie oktawy w górę.
const SKALA = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];

/** Musi odpowiadac czasowi animacji `akcent-wedrowka` w globals.css. */
const CYKL_S = 12;
/**
 * Ile stopni odcienia ma dzielic PIERWSZA literę od OSTATNIEJ.
 *
 * To jedyna liczba, ktora decyduje o tym, czy naglowek czyta sie jako jeden kolor
 * z delikatna fala, czy jako tecza. Przy 40 stopniach NA LITERE (poprzednia wersja)
 * napis obejmowal kilka pelnych obrotow kola barw naraz. 50 stopni na CALOSC daje
 * lagodny gradient - i jest niezalezne od dlugosci napisu, bo przesuniecie liczymy
 * z udzialu litery w calosci, a nie stalym krokiem.
 */
const ROZRZUT_STOPNI = 50;

/** Czesc wiersza. `akcent` decyduje o pelnym nasyceniu pastelu. */
type Czesc = { tekst: string; akcent?: boolean };
/** Jeden wiersz naglowka. Liczba wierszy w tablicy = liczba wierszy na ekranie. */
type Wiersz = Czesc[];

export function PlayableHeadline({ wiersze, className = "" }: { wiersze: Wiersz[]; className?: string }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const pelnyTekst = wiersze.map((w) => w.map((c) => c.tekst).join("")).join(" ");

  useEffect(() => () => { ctxRef.current?.close(); }, []);

  /** Tworzy AudioContext. Wolno to zrobic WYLACZNIE w obsludze gestu uzytkownika. */
  const odblokuj = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctxRef.current = new Ctor();
    void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const zagraj = useCallback((indeks: number, ctxWymuszony?: AudioContext | null) => {
    // Najechanie myszka gra tylko wtedy, gdy dzwiek zostal juz odblokowany
    // klinieciem. Samo najechanie nie jest gestem, ktory odblokowuje dzwiek.
    const ctx = ctxWymuszony ?? ctxRef.current;
    if (!ctx) return;

    const teraz = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = SKALA[indeks % SKALA.length];
    // Bardzo szybki atak i wykladnicze wygaszanie - to czyta sie jako miekki dzwonek.
    gain.gain.setValueAtTime(0.0001, teraz);
    gain.gain.exponentialRampToValueAtTime(0.14, teraz + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, teraz + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start(teraz);
    osc.stop(teraz + 0.6);
  }, []);

  // Liczba liter musi byc znana PRZED renderem, bo przesuniecie fazy kazdej litery
  // liczymy z jej udzialu w calosci - inaczej dlugosc napisu zmienialaby rozrzut barw.
  const literyRazem = wiersze.reduce(
    (suma, wiersz) => suma + wiersz.reduce((s, czesc) => s + [...czesc.tekst].filter((z) => z !== " ").length, 0),
    0,
  );
  const krokSekundy = literyRazem > 1 ? (CYKL_S * (ROZRZUT_STOPNI / 360)) / (literyRazem - 1) : 0;

  let licznik = -1;

  return (
    <h1 className={className}>
      <span className="sr-only">{pelnyTekst}</span>
      <span aria-hidden="true">
        {wiersze.map((wiersz, nrWiersza) => (
          <span key={`w-${nrWiersza}`} className="block sm:whitespace-nowrap">
            {wiersz.map((czesc, nrCzesci) => (
              <span key={`c-${nrWiersza}-${nrCzesci}`} className={czesc.akcent ? "text-accent" : undefined}>
                {[...czesc.tekst].map((znak, nrZnaku) => {
                  if (znak === " ") return <span key={`s-${nrZnaku}`}> </span>;
                  licznik += 1;
                  const nr = licznik;
                  return (
                    <span
                      key={`${znak}-${nrZnaku}`}
                      className="litera inline-block"
                      // Ujemne opoznienie = przesuniecie fazy w animacji odcienia.
                      style={{ animationDelay: `${(nr * -krokSekundy).toFixed(3)}s` }}
                      onPointerEnter={() => zagraj(nr)}
                      onClick={() => zagraj(nr, odblokuj())}
                    >
                      {znak}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
