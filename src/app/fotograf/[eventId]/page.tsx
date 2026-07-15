"use client";

import { Button } from "@/components/ui/Button";
import { EventModeration } from "./EventModeration";
import { EventQrCard } from "./EventQrCard";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Camera, Check, Copy, Loader2, MonitorPlay, QrCode, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Event = { id: string; slug: string; couple_name: string; wedding_date: string | null; location: string | null; status: "draft" | "live" | "archived"; allow_uploads: boolean; require_moderation: boolean; kiosk_enabled: boolean; live_wall_enabled: boolean };

export default function EventManager({ params }: { params: Promise<{ eventId: string }> }) {
  const supabase = createClient();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { params.then(({ eventId }) => setEventId(eventId)); }, [params]);
  useEffect(() => { if (!eventId) return; supabase.from("events").select("id,slug,couple_name,wedding_date,location,status,allow_uploads,require_moderation,kiosk_enabled,live_wall_enabled").eq("id", eventId).single().then(({ data }) => { setEvent(data as Event | null); setLoading(false); }); }, [eventId]);

  async function save() {
    if (!event) return;
    setSaving(true);
    const { error } = await supabase.from("events").update({ status: event.status, allow_uploads: event.allow_uploads, require_moderation: event.require_moderation, kiosk_enabled: event.kiosk_enabled, live_wall_enabled: event.live_wall_enabled }).eq("id", event.id);
    setNotice(error ? error.message : "Ustawienia zapisane.");
    setSaving(false);
  }

  function toggle(key: "allow_uploads" | "require_moderation" | "kiosk_enabled" | "live_wall_enabled") { if (event) setEvent({ ...event, [key]: !event[key] }); }
  function copy(value: string) { navigator.clipboard.writeText(value); setNotice("Link skopiowany."); }

  if (loading || !event) return <main className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></main>;
  const base = window.location.origin;
  const guestUrl = `${base}/e/${event.slug}`;

  return <main className="min-h-screen px-4 pb-20 pt-28"><div className="mx-auto max-w-5xl">
    <Link href="/fotograf" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Wróć do wydarzeń</Link>
    <div className="mt-5 flex flex-col gap-5 rounded-[2rem] bg-gradient-to-br from-[#402b4c] via-primary to-[#cf82ad] p-7 text-white sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Zarządzanie wydarzeniem</p><h1 className="mt-2 font-serif text-4xl">{event.couple_name}</h1><p className="mt-2 text-white/80">{event.wedding_date || "Data do ustawienia"}{event.location ? ` · ${event.location}` : ""}</p></div><span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{event.status === "live" ? "Wydarzenie aktywne" : "Szkic"}</span></div>
    <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-3xl border border-border bg-white/75 p-6 shadow-sm"><h2 className="font-serif text-2xl">Tryb wydarzenia</h2><p className="mt-1 text-sm text-muted-foreground">Włącz wydarzenie, aby strona gościa była dostępna publicznie.</p><div className="mt-6 grid gap-3"><label className="rounded-2xl border border-border p-4"><span className="block text-sm font-semibold">Status</span><select value={event.status} onChange={(e) => setEvent({ ...event, status: e.target.value as Event["status"] })} className="mt-2 w-full bg-transparent text-sm outline-none"><option value="draft">Szkic — niedostępny dla gości</option><option value="live">Aktywne — dostępne dla gości</option><option value="archived">Archiwum</option></select></label>{([['allow_uploads','Pozwól gościom dodawać wspomnienia','Camera'],['require_moderation','Moderuj przed publikacją','Check'],['kiosk_enabled','Włącz tryb kiosku','QrCode'],['live_wall_enabled','Włącz Live Wall','MonitorPlay']] as const).map(([key,label]) => <button key={key} type="button" onClick={() => toggle(key)} className="flex items-center justify-between rounded-2xl border border-border p-4 text-left"><span className="text-sm font-semibold">{label}</span><span className={`h-6 w-11 rounded-full p-1 transition ${event[key] ? "bg-primary" : "bg-muted"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${event[key] ? "translate-x-5" : ""}`} /></span></button>)}</div><Button onClick={save} disabled={saving} className="mt-6 w-full gap-2"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz ustawienia"}</Button>{notice && <p className="mt-3 text-center text-sm text-primary">{notice}</p>}</section>
    <aside className="space-y-5"><div className="rounded-3xl border border-primary/15 bg-primary/[0.06] p-6"><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary"><QrCode className="h-5 w-5" /></span><h2 className="mt-4 font-serif text-2xl">Link dla gości</h2><p className="mt-2 text-sm text-muted-foreground">Udostępnij go przez kod QR na stolikach.</p><div className="mt-4 break-all rounded-xl border border-primary/15 bg-white/80 p-3 text-xs">{guestUrl}</div><Button onClick={() => copy(guestUrl)} variant="outline" className="mt-3 w-full gap-2"><Copy className="h-4 w-4" /> Kopiuj link</Button></div><Link href={`/e/${event.slug}/kiosk`}><Button variant="outline" className="w-full gap-2"><Camera className="h-4 w-4" /> Otwórz kiosk fotograficzny</Button></Link><Link href={`/e/${event.slug}/live`}><Button variant="outline" className="w-full gap-2"><MonitorPlay className="h-4 w-4" /> Otwórz Live Wall</Button></Link><Link href={`/e/${event.slug}`}><Button variant="outline" className="w-full gap-2"><Sparkles className="h-4 w-4" /> Podgląd strony gościa</Button></Link></aside></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><EventModeration eventId={event.id} /><EventQrCard coupleName={event.couple_name} guestUrl={guestUrl} /></div>
  </div></main>;
}
