export type FrameStyle = "classic" | "film" | "neon" | "minimal";

export type FrameOpts = {
  style: FrameStyle;
  coupleName: string;
  eventDate: string | null;
};

/** Passe-partout ma dolny margines szerszy od pozostalych - oko czyta wtedy kadr jako wysrodkowany. */
const MARGIN = 0.055;
const BOTTOM_MARGIN = 0.135;

const PALETA: Record<FrameStyle, { tlo: string; tlo2: string; kreska: string; podpis: string; szept: string }> = {
  classic: { tlo: "#4b2e56", tlo2: "#18101c", kreska: "rgba(255,255,255,0.22)", podpis: "#f6efe6", szept: "rgba(246,239,230,0.62)" },
  film: { tlo: "#0b0b0b", tlo2: "#0b0b0b", kreska: "rgba(254,243,200,0.7)", podpis: "#fef3c8", szept: "rgba(254,243,200,0.6)" },
  neon: { tlo: "#120c16", tlo2: "#120c16", kreska: "#e87bf9", podpis: "#ffffff", szept: "rgba(232,123,249,0.85)" },
  minimal: { tlo: "#141018", tlo2: "#141018", kreska: "rgba(255,255,255,0.28)", podpis: "#ffffff", szept: "rgba(255,255,255,0.55)" },
};

function formatujDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Rysuje kadr w oprawie na plotnie docelowym. Plotno ma rozmiar zrodla, a zdjecie
 * jest w nie wpisane - dzieki temu rozdzielczosc pliku nie zalezy od stylu ramki.
 *
 * Wymaga zaladowanych fontow (patrz `czekajNaFonty`), inaczej przegladarka podstawi
 * zastepczy krój i podpis rozjedzie sie wzgledem projektu.
 */
export function drawMountedPhoto(target: HTMLCanvasElement, source: CanvasImageSource, sourceWidth: number, sourceHeight: number, opts: FrameOpts) {
  const paleta = PALETA[opts.style] ?? PALETA.classic;
  const ctx = target.getContext("2d");
  if (!ctx) return;

  target.width = sourceWidth;
  target.height = sourceHeight;
  const krotszy = Math.min(sourceWidth, sourceHeight);
  const margines = Math.round(krotszy * MARGIN);
  const marginesDolny = Math.round(krotszy * BOTTOM_MARGIN);

  if (paleta.tlo === paleta.tlo2) {
    ctx.fillStyle = paleta.tlo;
  } else {
    const gradient = ctx.createLinearGradient(0, 0, sourceWidth, sourceHeight);
    gradient.addColorStop(0, paleta.tlo);
    gradient.addColorStop(1, paleta.tlo2);
    ctx.fillStyle = gradient;
  }
  ctx.fillRect(0, 0, sourceWidth, sourceHeight);

  const kadrX = margines;
  const kadrY = margines;
  const kadrW = sourceWidth - margines * 2;
  const kadrH = sourceHeight - margines - marginesDolny;

  // Zdjecie wpisane w okno oprawy z zachowaniem proporcji (cover).
  const skala = Math.max(kadrW / sourceWidth, kadrH / sourceHeight);
  const rysW = sourceWidth * skala;
  const rysH = sourceHeight * skala;
  ctx.save();
  ctx.beginPath();
  ctx.rect(kadrX, kadrY, kadrW, kadrH);
  ctx.clip();
  ctx.drawImage(source, kadrX + (kadrW - rysW) / 2, kadrY + (kadrH - rysH) / 2, rysW, rysH);
  ctx.restore();

  if (opts.style === "neon") {
    ctx.shadowColor = paleta.kreska;
    ctx.shadowBlur = Math.round(krotszy * 0.02);
  }
  ctx.strokeStyle = paleta.kreska;
  ctx.lineWidth = Math.max(1, Math.round(krotszy * 0.0035));
  ctx.strokeRect(kadrX, kadrY, kadrW, kadrH);
  ctx.shadowBlur = 0;

  if (opts.style === "film") rysujPerforacje(ctx, sourceWidth, sourceHeight, margines, paleta.kreska);

  const podstawa = kadrY + kadrH;
  const srodekPodpisu = podstawa + marginesDolny * 0.42;
  ctx.textAlign = "center";
  ctx.fillStyle = paleta.podpis;
  ctx.font = `600 ${Math.round(krotszy * 0.052)}px "Bricolage Grotesque", Inter, system-ui, sans-serif`;
  ctx.fillText(opts.coupleName, sourceWidth / 2, srodekPodpisu, kadrW);

  const data = formatujDate(opts.eventDate);
  ctx.fillStyle = paleta.szept;
  ctx.font = `500 ${Math.round(krotszy * 0.022)}px Inter, system-ui, sans-serif`;
  const stopka = data ? `${data}  ·  Story Atelier` : "Story Atelier";
  ctx.fillText(stopka, sourceWidth / 2, srodekPodpisu + Math.round(krotszy * 0.045), kadrW);
}

/** Perforacja tasmy filmowej wzdluz obu bocznych marginesow - sygnatura wariantu "film". */
function rysujPerforacje(ctx: CanvasRenderingContext2D, width: number, height: number, margines: number, kolor: string) {
  const bok = Math.round(margines * 0.38);
  const odstep = bok * 2.1;
  ctx.fillStyle = kolor;
  ctx.globalAlpha = 0.55;
  for (let y = margines; y + bok < height - margines; y += odstep) {
    ctx.fillRect(Math.round((margines - bok) / 2), y, bok, Math.round(bok * 0.72));
    ctx.fillRect(width - Math.round((margines - bok) / 2) - bok, y, bok, Math.round(bok * 0.72));
  }
  ctx.globalAlpha = 1;
}

/** Bez tego podpis na zdjeciu potrafi wyjsc krojem zastepczym - fonty ladowane sa asynchronicznie. */
export async function czekajNaFonty() {
  try {
    await document.fonts.ready;
  } catch {
    /* starsza przegladarka - podpis wyjdzie krojem zastepczym, ale zdjecie i tak powstanie */
  }
}

const HOLD_MS = 190;

/**
 * Sklada serie kadrow w zapetlona animacje "tam i z powrotem".
 *
 * Nagrywa plotno przez MediaRecorder - ten sam mechanizm, ktorego fotobudka uzywa
 * do trybu wideo - wiec nie wymaga zadnego enkodera z zewnatrz ani nowego typu w bazie.
 * Zwraca `null`, gdy przegladarka nie potrafi nagrac strumienia z plotna; wolajacy
 * powinien wtedy wysłać sam pierwszy kadr.
 *
 * WAZNE: kadry wchodza tu JUZ Z WYPALONA OPRAWA (robi to `takePhoto`), wiec rysujemy
 * je bez zmian. Ponowne wywolanie `drawMountedPhoto` daloby ramke w ramce i podpis
 * nadrukowany na podpisie.
 */
export async function buildBoomerang(frames: Blob[]): Promise<Blob | null> {
  if (frames.length < 2) return null;
  if (typeof MediaRecorder === "undefined") return null;

  const bitmapy = await Promise.all(frames.map((blob) => createImageBitmap(blob)));
  const canvas = document.createElement("canvas");
  canvas.width = bitmapy[0].width;
  canvas.height = bitmapy[0].height;
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof canvas.captureStream !== "function") {
    bitmapy.forEach((b) => b.close());
    return null;
  }

  const typ = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: typ });
  const kawalki: Blob[] = [];
  recorder.ondataavailable = (event) => { if (event.data.size) kawalki.push(event.data); };

  const kolejnosc = [...bitmapy, ...bitmapy.slice(1, -1).reverse()];
  const gotowe = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(kawalki, { type: "video/webm" }));
  });

  recorder.start();
  for (let cykl = 0; cykl < 3; cykl += 1) {
    for (const bitmapa of kolejnosc) {
      ctx.drawImage(bitmapa, 0, 0, canvas.width, canvas.height);
      await new Promise((resolve) => window.setTimeout(resolve, HOLD_MS));
    }
  }
  recorder.stop();

  const wynik = await gotowe;
  stream.getTracks().forEach((track) => track.stop());
  bitmapy.forEach((b) => b.close());
  return wynik.size > 0 ? wynik : null;
}
