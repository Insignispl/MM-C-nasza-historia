"use client";

import { Button } from "@/components/ui/Button";
import { EventModeration } from "./EventModeration";
import { EventQrCard } from "./EventQrCard";
import { EventStoryManager } from "./EventStoryManager";
import { StoryDesignManager } from "./StoryDesignManager";
import { createClient } from "@/lib/supabase/client";
import { formatWeddingDate } from "@/lib/utils";
import { ArrowLeft, Camera, Copy, Loader2, MonitorPlay, QrCode, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Event = { id: string; slug: string; couple_name: string; wedding_date: string | null; location: string | null; status: "draft" | "live" | "archived"; allow_uploads: boolean; require_moderation: boolean; kiosk_enabled: boolean; live_wall_enabled: boolean; guest_reactions_enabled: boolean; kiosk_countdown_seconds: number; kiosk_burst_count: number; kiosk_frame_style: "classic" | "film" | "neon" | "minimal" }; 

export default function EventManager({ params }: { params: Promise<{ eventId: string }> }) {
  const supabase = useMemo(() => createClient(), []);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { params.then(({ eventId }) => setEventId(eventId)); }, [params]);
  useEffect(() => { if (!eventId) return; supabase.from("events").select("id,slug,couple_name,wedding_date,location,status,allow_uploads,require_moderation,kiosk_enabled,live_wall_enabled,guest_reactions_enabled,kiosk_countdown_seconds,kiosk_burst_count,kiosk_frame_style").eq("id", eventId).single().then(({ data }) => { setEvent(data as Event | null); setLoading(false); }); }, [eventId, supabase]);

  async function save() {
    if (!event) return;
    const nazwa = event.couple_name.trim();
    if (!nazwa) { setNotice("Nazwa wydarzenia nie może być pusta."); return; }
    setSaving(true);

    // `wedding_date` i `location` sa w schemacie NOT NULL. Pustej daty nie wysylamy
    // wcale (baza odrzucilaby null), a puste miejsce idzie jako pusty tekst.
    const zmiany: Record<string, unknown> = {
      couple_name: nazwa,
      location: (event.location ?? "").trim(),
      status: event.status,
      allow_uploads: event.allow_uploads,
      require_moderation: event.require_moderation,
      kiosk_enabled: event.kiosk_enabled,
      live_wall_enabled: event.live_wall_enabled,
      guest_reactions_enabled: event.guest_reactions_enabled,
      kiosk_countdown_seconds: event.kiosk_countdown_seconds,
      kiosk_burst_count: event.kiosk_burst_count,
      kiosk_frame_style: event.kiosk_frame_style,
    };
    if (event.wedding_date) zmiany.wedding_date = event.wedding_date;

    const { error } = await supabase.from("events").update(zmiany).eq("id", event.id);
    setNotice(error ? error.message : "Zapisane.");
    setSaving(false);
  }

  function toggle(key: "allow_uploads" | "require_moderation" | "kiosk_enabled" | "live_wall_enabled" | "guest_reactions_enabled") { if (event) setEvent({ ...event, [key]: !event[key] }); }
  function copy(value: string) { navigator.clipboard.writeText(value); setNotice("Link skopiowany."); }

  if (loading || !event) return <main className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></main>;
  const base = window.location.origin;
  const guestUrl = `${base}/e/${event.slug}`;
  const photoBoothUrl = `${guestUrl}/fotobudka`;

  return <main className="min-h-screen px-4 pb-20 pt-28"><div className="mx-auto max-w-5xl">
    <Link href="/fotograf" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Wróć do wydarzeń</Link>
    <div className="mt-5 flex flex-col gap-5 rounded-[2rem] surface-studio p-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Zarządzanie wydarzeniem</p><h1 className="mt-2 font-display text-4xl">{event.couple_name}</h1><p className="mt-2 text-muted-foreground">{formatWeddingDate(event.wedding_date) || "Data do ustawienia"}{event.location ? ` · ${event.location}` : ""}</p></div><span className="rounded-full bg-muted px-4 py-2 text-sm font-semibold">{event.status === "live" ? "Wydarzenie aktywne" : "Szkic"}</span></div>
    <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-3xl border border-border bg-card p-6 shadow-sm"><h2 className="font-display text-2xl">Wydarzenie</h2><p className="mt-1 text-sm text-muted-foreground">Nazwa pojawia się na stronie gościa, w fotobudce i na Live Wallu.</p><div className="mt-6 grid gap-3">{/* Nazwe dalo sie dotad ustawic WYLACZNIE przy zakladaniu wydarzenia. Skutek:
        raz wpisane nazwisko zostawalo w bazie na zawsze i wychodzilo na strone fotobudki,
        a jedyna droga poprawki byl SQL. */}<label className="rounded-2xl border border-border p-4"><span className="block text-sm font-semibold">Nazwa pary lub wydarzenia</span><input value={event.couple_name} onChange={(e) => setEvent({ ...event, couple_name: e.target.value })} placeholder="np. Ania i Paweł" className="mt-2 w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:border-primary" /><span className="mt-2 block text-xs text-muted-foreground">Widzą to goście. Nazwisko nie jest potrzebne.</span></label><div className="grid gap-3 sm:grid-cols-2"><label className="rounded-2xl border border-border p-4"><span className="block text-sm font-semibold">Data</span><input type="date" value={event.wedding_date ?? ""} onChange={(e) => setEvent({ ...event, wedding_date: e.target.value || null })} className="mt-2 w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:border-primary" /></label><label className="rounded-2xl border border-border p-4"><span className="block text-sm font-semibold">Miejsce</span><input value={event.location ?? ""} onChange={(e) => setEvent({ ...event, location: e.target.value })} placeholder="np. Wrocław" className="mt-2 w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:border-primary" /></label></div><label className="rounded-2xl border border-border p-4"><span className="block text-sm font-semibold">Status</span><select value={event.status} onChange={(e) => setEvent({ ...event, status: e.target.value as Event["status"] })} className="mt-2 w-full bg-transparent text-sm outline-none"><option value="draft">Szkic, niedostępny dla gości</option><option value="live">Aktywne, dostępne dla gości</option><option value="archived">Archiwum</option></select></label>{([['allow_uploads','Pozwól gościom dodawać wspomnienia','Camera'],['require_moderation','Moderuj przed publikacją','Check'],['kiosk_enabled','Włącz fotobudkę','QrCode'],['live_wall_enabled','Włącz Live Wall','MonitorPlay'],['guest_reactions_enabled','Włącz reakcje gości','Heart']] as const).map(([key,label]) => <button key={key} type="button" onClick={() => toggle(key)} className="flex items-center justify-between rounded-2xl border border-border p-4 text-left"><span className="text-sm font-semibold">{label}</span><span className={`h-6 w-11 rounded-full p-1 transition ${event[key] ? "bg-primary" : "bg-muted"}`}><span className={`block h-4 w-4 rounded-full bg-card transition ${event[key] ? "translate-x-5" : ""}`} /></span></button>)}</div>{event.kiosk_enabled && <div className="mt-4 grid gap-3 rounded-2xl bg-muted/50 p-4 sm:grid-cols-3"><label className="text-xs font-semibold">Odliczanie<select value={event.kiosk_countdown_seconds} onChange={(e) => setEvent({ ...event, kiosk_countdown_seconds: Number(e.target.value) })} className="mt-2 w-full rounded-lg border border-input bg-background p-2 text-sm"><option value={0}>Bez odliczania</option><option value={3}>3 sekundy</option><option value={5}>5 sekund</option></select></label><label className="text-xs font-semibold">Seria zdjęć<select value={event.kiosk_burst_count} onChange={(e) => setEvent({ ...event, kiosk_burst_count: Number(e.target.value) })} className="mt-2 w-full rounded-lg border border-input bg-background p-2 text-sm"><option value={1}>1 zdjęcie</option><option value={3}>3 zdjęcia</option></select></label><label className="text-xs font-semibold">Styl ramki<select value={event.kiosk_frame_style} onChange={(e) => setEvent({ ...event, kiosk_frame_style: e.target.value as Event["kiosk_frame_style"] })} className="mt-2 w-full rounded-lg border border-input bg-background p-2 text-sm"><option value="classic">Classic</option><option value="film">Film strip</option><option value="neon">Neon</option><option value="minimal">Minimal</option></select></label></div>}<Button onClick={save} disabled={saving} className="mt-6 w-full gap-2"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz ustawienia"}</Button>{notice && <p className="mt-3 text-center text-sm text-primary">{notice}</p>}</section>
    <aside className="space-y-5"><div className="rounded-3xl border border-primary/15 bg-primary/[0.06] p-6"><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary"><QrCode className="h-5 w-5" /></span><h2 className="mt-4 font-display text-2xl">Link dla gości</h2><p className="mt-2 text-sm text-muted-foreground">Udostępnij go przez kod QR na stolikach.</p><div className="mt-4 break-all rounded-xl border border-primary/15 bg-card p-3 text-xs">{guestUrl}</div><Button onClick={() => copy(guestUrl)} variant="outline" className="mt-3 w-full gap-2"><Copy className="h-4 w-4" /> Kopiuj link</Button></div>{event.kiosk_enabled && <Link href={`/e/${event.slug}/fotobudka`}><Button variant="outline" className="w-full gap-2"><Camera className="h-4 w-4" /> Otwórz fotobudkę</Button></Link>}<Link href={`/e/${event.slug}/live`}><Button variant="outline" className="w-full gap-2"><MonitorPlay className="h-4 w-4" /> Otwórz Live Wall</Button></Link><Link href={`/e/${event.slug}`}><Button variant="outline" className="w-full gap-2"><Sparkles className="h-4 w-4" /> Podgląd strony gościa</Button></Link></aside></div>
    <StoryDesignManager eventId={event.id} />
    <EventStoryManager eventId={event.id} />
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><EventModeration eventId={event.id} /><div className="space-y-6"><EventQrCard coupleName={event.couple_name} guestUrl={guestUrl} />{event.kiosk_enabled && <EventQrCard coupleName={event.couple_name} guestUrl={photoBoothUrl} eyebrow="Zeskanuj i wejdź do fotobudki" caption="Zdjęcie, seria lub 8-sekundowy film" fileTag="fotobudka" />}</div></div>
  </div></main>;
}
