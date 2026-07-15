"use client";

import { Button } from "@/components/ui/Button";
import QRCode from "qrcode";
import { Download, Printer, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

export function EventQrCard({ coupleName, guestUrl }: { coupleName: string; guestUrl: string }) {
  const [qr, setQr] = useState("");
  useEffect(() => { QRCode.toDataURL(guestUrl, { width: 900, margin: 2, color: { dark: "#342039", light: "#ffffff" }, errorCorrectionLevel: "H" }).then(setQr); }, [guestUrl]);
  function download() { const link = document.createElement("a"); link.href = qr; link.download = `qr-${coupleName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`; link.click(); }
  return <section className="print:shadow-none rounded-3xl border border-primary/15 bg-white p-6 text-center shadow-sm"><div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><QrCode className="h-5 w-5" /></div><p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Zeskanuj i dodaj wspomnienie</p><h2 className="mt-2 font-serif text-2xl">{coupleName}</h2>{qr && <img src={qr} alt={`Kod QR dla ${coupleName}`} className="mx-auto mt-5 w-full max-w-[230px] rounded-xl" />}<p className="mt-4 text-sm text-muted-foreground">Zdjęcia, filmy i życzenia od gości</p><div className="mt-5 flex gap-2 print:hidden"><Button onClick={download} variant="outline" className="flex-1 gap-2"><Download className="h-4 w-4" /> PNG</Button><Button onClick={() => window.print()} variant="outline" className="flex-1 gap-2"><Printer className="h-4 w-4" /> Drukuj</Button></div></section>;
}
