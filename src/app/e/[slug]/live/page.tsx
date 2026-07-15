import { createClient } from "@/lib/supabase/server";
import { Heart, QrCode } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default async function LiveWallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("id,couple_name,primary_color,secondary_color,live_wall_enabled").eq("slug", slug).single();
  if (!event || !event.live_wall_enabled) notFound();
  const { data: media } = await supabase.from("event_media").select("id,type,public_url,caption,guest_name").eq("event_id", event.id).eq("approved", true).order("created_at", { ascending: false }).limit(12);
  const style = { "--event-primary": event.primary_color, "--event-secondary": event.secondary_color } as React.CSSProperties;
  return <main style={style} className="min-h-screen overflow-hidden bg-[#17101b] p-8 text-white"><header className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--event-primary)]"><Heart className="h-7 w-7 fill-current" /></span><div><p className="text-sm uppercase tracking-[0.2em] text-white/60">Wspólne wspomnienia</p><h1 className="font-serif text-4xl">{event.couple_name}</h1></div></div><div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm"><QrCode className="h-5 w-5" /> Zeskanuj QR i dodaj wspomnienie</div></header><section className="mt-8 grid h-[calc(100vh-10rem)] grid-cols-4 auto-rows-fr gap-4">{media?.map((item, index) => <div key={item.id} className={`relative overflow-hidden rounded-3xl bg-white/10 ${index === 0 ? "col-span-2 row-span-2" : index === 4 ? "row-span-2" : ""}`}>{item.type === "image" ? <Image src={item.public_url} alt={item.caption || "Wspomnienie"} fill className="object-cover" sizes="50vw" /> : <video src={item.public_url} className="h-full w-full object-cover" autoPlay muted loop playsInline />}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">{item.caption && <p className="font-medium">{item.caption}</p>}{item.guest_name && <p className="mt-1 text-sm text-white/70">{item.guest_name}</p>}</div></div>)}</section></main>;
}
