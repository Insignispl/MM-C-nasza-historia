"use client";

import { createClient } from "@/lib/supabase/client";
import { Heart, QrCode } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Media = { id: string; type: "image" | "video"; public_url: string; caption: string | null; guest_name: string | null };

export function LiveWall({ eventId, coupleName, primaryColor, initialMedia }: { eventId: string; coupleName: string; primaryColor: string; initialMedia: Media[] }) {
  const supabase = createClient();
  const [media, setMedia] = useState(initialMedia);
  useEffect(() => {
    const channel = supabase.channel(`live-wall-${eventId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "event_media", filter: `event_id=eq.${eventId}` }, (payload) => {
      const item = payload.new as Media & { approved: boolean };
      if (item.approved) setMedia((current) => [item, ...current.filter((existing) => existing.id !== item.id)].slice(0, 12));
    }).on("postgres_changes", { event: "UPDATE", schema: "public", table: "event_media", filter: `event_id=eq.${eventId}` }, (payload) => {
      const item = payload.new as Media & { approved: boolean };
      if (item.approved) setMedia((current) => [item, ...current.filter((existing) => existing.id !== item.id)].slice(0, 12));
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventId]);
  return <main style={{ "--event-primary": primaryColor } as React.CSSProperties} className="min-h-screen overflow-hidden bg-[#17101b] p-8 text-white"><header className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--event-primary)]"><Heart className="h-7 w-7 fill-current" /></span><div><p className="text-sm uppercase tracking-[0.2em] text-white/60">Wspólne wspomnienia</p><h1 className="font-serif text-4xl">{coupleName}</h1></div></div><div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm"><QrCode className="h-5 w-5" /> Zeskanuj QR i dodaj wspomnienie</div></header><section className="mt-8 grid h-[calc(100vh-10rem)] grid-cols-4 auto-rows-fr gap-4">{media.map((item, index) => <div key={item.id} className={`relative overflow-hidden rounded-3xl bg-white/10 transition-all duration-700 ${index === 0 ? "col-span-2 row-span-2" : index === 4 ? "row-span-2" : ""}`}>{item.type === "image" ? <Image src={item.public_url} alt={item.caption || "Wspomnienie"} fill className="object-cover" sizes="50vw" /> : <video src={item.public_url} className="h-full w-full object-cover" autoPlay muted loop playsInline />}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">{item.caption && <p className="font-medium">{item.caption}</p>}{item.guest_name && <p className="mt-1 text-sm text-white/70">{item.guest_name}</p>}</div></div>)}</section></main>;
}
