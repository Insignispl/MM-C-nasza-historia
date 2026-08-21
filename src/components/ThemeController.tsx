"use client";

import { applyTheme, resolveTheme, setStoredTheme, storedTheme, subscribeTheme, type Surface, type Theme } from "@/lib/theme";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Wybor zapisany na tym urzadzeniu. `localStorage` to magazyn zewnetrzny wobec Reacta,
 * wiec czytamy go przez `useSyncExternalStore` - migawka serwerowa to `null`, bo podczas
 * renderowania na serwerze zaden wybor nie istnieje.
 */
function useDeviceTheme(): Theme | null {
  return useSyncExternalStore(subscribeTheme, storedTheme, () => null);
}

/**
 * Nakłada motyw wynikajacy z polityki i utrzymuje go przy nawigacji po stronie klienta.
 * Skrypt w <head> ustawia motyw przed pierwszym malowaniem; ten komponent koryguje go,
 * gdy dojda dane wydarzenia z bazy, i czysci atrybut przy przejsciu na album.
 */
export function ThemeController({ surface, eventTheme = null }: { surface: Surface; eventTheme?: Theme | null }) {
  const device = useDeviceTheme();

  useEffect(() => {
    applyTheme(resolveTheme({ surface, device, event: eventTheme }));
  }, [surface, device, eventTheme]);

  return null;
}

const OPCJE: { value: Theme | null; label: string; opis: string }[] = [
  { value: null, label: "Auto", opis: "Motyw zgodny z ustawieniem urządzenia" },
  { value: "light", label: "Jasny", opis: "Jasny motyw" },
  { value: "dark", label: "Ciemny", opis: "Ciemny motyw" },
  { value: "hall", label: "Sala", opis: "Tryb sali: maksymalny kontrast, bez białych płaszczyzn" },
];

/**
 * Przelacznik dla osoby obslugujacej urzadzenie na sali. Wybor zapisuje sie na tym
 * urzadzeniu i wygrywa z ustawieniem wydarzenia - patrz `resolveTheme`.
 */
export function ThemeSwitch({ className = "" }: { className?: string }) {
  const wybor = useDeviceTheme();

  return (
    <div role="group" aria-label="Motyw ekranu" className={`inline-flex rounded-[var(--radius)] border border-border p-1 ${className}`}>
      {OPCJE.map((opcja) => (
        <button
          key={opcja.label}
          type="button"
          onClick={() => setStoredTheme(opcja.value)}
          aria-pressed={wybor === opcja.value}
          title={opcja.opis}
          className={`rounded-[calc(var(--radius)-1px)] px-3 py-1.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))] ${
            wybor === opcja.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opcja.label}
        </button>
      ))}
    </div>
  );
}
