import { KONTAKT, LOKALIZACJE } from "@/lib/oferta";
import { ImageResponse } from "next/og";

/**
 * Obrazek pokazywany, gdy ktos wysle link do strony w komunikatorze albo social mediach.
 *
 * PO CO: metadane deklarowaly duza karte z obrazkiem (`summary_large_image`), ale zadnego
 * obrazka nie bylo - firma sprzedajaca obraz udostepniala sie jako pusty prostokat.
 *
 * Generujemy go w locie zamiast trzymac plik, zeby tresc nie rozjechala sie z oferta.
 * Bez zewnetrznych fontow: `ImageResponse` musialby je najpierw pobrac, a kazda taka
 * zaleznosc to kolejne miejsce, w ktorym generowanie moze paść.
 */

export const alt = "Story Atelier: fotografia, film i studio nagrań. Wrocław i Polkowice.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0e11",
          color: "#f6f5f3",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#d8c9a3", textTransform: "uppercase" }}>
          {LOKALIZACJE.map((l) => l.miasto).join("   ·   ")}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>Fotografia, film</div>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, color: "#d8c9a3" }}>
            i studio nagrań.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26 }}>
          <div style={{ display: "flex", color: "#a6a6ad" }}>Story Atelier</div>
          <div style={{ display: "flex", color: "#a6a6ad" }}>{KONTAKT.telefon}</div>
        </div>
      </div>
    ),
    size,
  );
}
