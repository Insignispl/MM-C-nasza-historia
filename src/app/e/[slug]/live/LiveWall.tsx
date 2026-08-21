"use client";

import { createClient } from "@/lib/supabase/client";
import QRCode from "qrcode";
import { Heart, QrCode } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Media = { id: string; type: "image" | "video"; public_url: string; caption: string | null; guest_name: string | null };

export function LiveWall({ eventId, coupleName, primaryColor, initialMedia, guestUrl }: { eventId: string; coupleName: string; primaryColor: string; initialMedia: Media[]; guestUrl: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [media, setMedia] = useState(initialMedia);

  // Ekran obiecywal "Zeskanuj QR", ale zadnego kodu nie pokazywal, wiec gosc czytal
  // instrukcje bez tresci. Kod modulami CIEMNYMI na PELNEJ BIELI jest tu warunkiem
  // dzialania: na przezroczystym tle telefon probuje odczytac kod na ciemnej scianie
  // z projektora i najczesciej nie lapie kontrastu.
  const [qr, setQr] = useState("");
  useEffect(() => {
    QRCode.toDataURL(guestUrl, { width: 900, margin: 2, color: { dark: "#1b1a18", light: "#ffffff" }, errorCorrectionLevel: "H" }).then(setQr);
  }, [guestUrl]);
  useEffect(() => {
    const channel = supabase.channel(`live-wall-${eventId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "event_media", filter: `event_id=eq.${eventId}` }, (payload) => {
      const item = payload.new as Media & { approved: boolean };
      if (item.approved) setMedia((current) => [item, ...current.filter((existing) => existing.id !== item.id)].slice(0, 12));
    }).on("postgres_changes", { event: "UPDATE", schema: "public", table: "event_media", filter: `event_id=eq.${eventId}` }, (payload) => {
      const item = payload.new as Media & { approved: boolean };
      if (item.approved) setMedia((current) => [item, ...current.filter((existing) => existing.id !== item.id)].slice(0, 12));
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventId, supabase]);
  return <main style={{ "--event-primary": primaryColor } as React.CSSProperties} className="min-h-screen overflow-hidden bg-background p-8 text-foreground"><header className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--event-primary)]"><Heart className="h-7 w-7 fill-current" /></span><div><p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Wspólne wspomnienia</p><h1 className="font-display text-4xl">{coupleName}</h1></div></div><div className="flex items-center gap-4 rounded-2xl bg-muted p-3 pl-4 text-sm"><span className="flex items-center gap-3"><QrCode className="h-5 w-5" /> Zeskanuj i dodaj wspomnienie</span>{qr && <Image src={qr} alt="Kod QR do dodawania zdjęć" width={96} height={96} unoptimized className="h-20 w-20 rounded-xl bg-white p-1" />}</div></header>{media.length === 0 ? <section className="mt-8 flex h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">{qr && <Image src={qr} alt="Kod QR do dodawania zdjęć" width={900} height={900} unoptimized className="h-auto w-[min(46vh,26rem)] rounded-[2rem] bg-white p-5 shadow-2xl" />}<h2 className="mt-10 font-display text-5xl">Ta ściana czeka na Was</h2><p className="mt-5 max-w-xl text-lg text-muted-foreground">Zeskanujcie kod telefonem i dodajcie pierwsze zdjęcie. Pojawi się tutaj po chwili.</p><p className="mt-6 rounded-full bg-muted px-5 py-2 font-mono text-sm text-muted-foreground">{guestUrl.replace(/^https?:\/\//, "")}</p></section> : <section className="mt-8 grid h-[calc(100vh-10rem)] grid-cols-4 auto-rows-fr gap-4">{media.map((item, index) => <div key={item.id} className={`relative overflow-hidden rounded-3xl bg-muted transition-all duration-700 ${index === 0 ? "col-span-2 row-span-2" : index === 4 ? "row-span-2" : ""}`}>{item.type === "image" ? <Image src={item.public_url} alt={item.caption || "Wspomnienie"} fill className="object-cover" sizes="50vw" /> : <video src={item.public_url} className="h-full w-full object-cover" autoPlay muted loop playsInline />}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">{item.caption && <p className="font-medium">{item.caption}</p>}{item.guest_name && <p className="mt-1 text-sm text-white/70">{item.guest_name}</p>}</div></div>)}</section>}</main>;
}
