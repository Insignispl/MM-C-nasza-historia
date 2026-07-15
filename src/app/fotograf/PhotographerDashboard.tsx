"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays, ExternalLink, Loader2, LogOut, MonitorPlay, Plus, QrCode, Settings2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Event = { id: string; studio_id: string; slug: string; couple_name: string; wedding_date: string | null; location: string | null; status: "draft" | "live" | "archived"; kiosk_enabled: boolean; live_wall_enabled: boolean };

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);

export function PhotographerDashboard() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [studioId, setStudioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      window.location.assign("/fotograf/start");
      return;
    }
    const { data: memberships, error: membershipError } = await supabase.from("studio_members").select("studio_id").eq("user_id", userData.user.id);
    if (membershipError) setError(membershipError.message);
    const ids = memberships?.map((member) => member.studio_id) ?? [];
    if (ids.length) {
      const { data, error: eventsError } = await supabase.from("events").select("id,studio_id,slug,couple_name,wedding_date,location,status,kiosk_enabled,live_wall_enabled").in("studio_id", ids).order("created_at", { ascending: false });
      if (eventsError) setError(eventsError.message);
      setEvents((data as Event[]) ?? []);
      setStudioId(ids[0]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const coupleName = String(data.get("coupleName") || "");
    const slug = slugify(String(data.get("slug") || coupleName));
    setCreating(true);
    setError("");
    const { error: createError } = await supabase.from("events").insert({
      studio_id: studioId,
      couple_name: coupleName,
      slug,
      wedding_date: String(data.get("date") || "") || null,
      location: String(data.get("location") || "") || null,
      status: "draft",
    });
    if (createError) setError(createError.message);
    else { setShowCreate(false); await load(); }
    setCreating(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign("/fotograf/start");
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></main>;

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-gradient-to-br from-[#402b4c] via-primary to-[#cf82ad] p-7 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Studio workspace</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">Twoje wydarzenia</h1><p className="mt-3 text-white/80">Twórz prywatne pamiątki i zarządzaj nimi z jednego miejsca.</p></div>
          <div className="flex gap-2"><Button onClick={() => setShowCreate(true)} className="gap-2 bg-white text-primary hover:bg-white/90"><Plus className="h-4 w-4" /> Nowe wydarzenie</Button><Button onClick={signOut} variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></Button></div>
        </header>

        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {showCreate && <form onSubmit={createEvent} className="mt-6 grid gap-4 rounded-3xl border border-primary/15 bg-white/80 p-6 shadow-sm sm:grid-cols-2"><Input required name="coupleName" placeholder="Para Młoda, np. Anna i Piotr" /><Input name="slug" placeholder="Unikalny adres (opcjonalnie)" /><Input name="date" type="date" /><Input name="location" placeholder="Miejsce wydarzenia" /><div className="flex gap-3 sm:col-span-2"><Button disabled={creating}>{creating ? "Tworzenie…" : "Utwórz wydarzenie"}</Button><Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Anuluj</Button></div></form>}

        {!events.length && !showCreate ? <div className="mt-8 rounded-3xl border border-dashed border-border bg-white/60 py-20 text-center"><CalendarDays className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-4 font-serif text-2xl">Pierwsze wydarzenie czeka</h2><p className="mt-2 text-muted-foreground">Utwórz album dla Pary Młodej i otrzymaj gotowy link dla gości.</p></div> : <div className="mt-8 grid gap-5 md:grid-cols-2">{events.map((event) => <article key={event.id} className="rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-sm"><div className="flex items-start justify-between gap-4"><div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${event.status === "live" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{event.status === "live" ? "Aktywne" : "Szkic"}</span><h2 className="mt-4 font-serif text-3xl">{event.couple_name}</h2><p className="mt-2 text-sm text-muted-foreground">{event.wedding_date || "Data do ustawienia"}{event.location ? ` · ${event.location}` : ""}</p></div><QrCode className="h-7 w-7 text-primary" /></div><div className="mt-6 grid grid-cols-2 gap-3"><Link href={`/e/${event.slug}`}><Button variant="outline" className="w-full gap-2"><ExternalLink className="h-4 w-4" /> Strona gościa</Button></Link><Link href={`/fotograf/${event.id}`}><Button className="w-full gap-2"><Settings2 className="h-4 w-4" /> Zarządzaj</Button></Link></div><div className="mt-4 flex gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><MonitorPlay className="h-3.5 w-3.5" /> Live Wall: {event.live_wall_enabled ? "włączony" : "wyłączony"}</span><span>Kiosk: {event.kiosk_enabled ? "włączony" : "wyłączony"}</span></div></article>)}</div>}
      </div>
    </main>
  );
}
