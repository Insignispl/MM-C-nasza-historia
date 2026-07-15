"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { Building2, Loader2, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);

export function StudioOnboarding() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget); const studioName = String(form.get("studioName") || ""); const coupleName = String(form.get("coupleName") || "");
    const { error } = await supabase.rpc("create_studio_with_event", { studio_name: studioName, studio_slug: slugify(studioName), event_name: coupleName, event_slug: slugify(coupleName), event_date: String(form.get("date") || "") || null, event_location: String(form.get("location") || "") || null });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.reload();
  }
  return <section className="mt-8 mx-auto max-w-2xl rounded-[2rem] border border-primary/15 bg-white/80 p-7 shadow-sm sm:p-10"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Building2 className="h-6 w-6" /></span><p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary"><Sparkles className="h-4 w-4" /> Konfiguracja studia</p><h2 className="mt-2 font-serif text-3xl">Stwórz pierwsze wydarzenie</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">To zabezpiecza Twój obszar roboczy i oddziela dane każdego klienta.</p><form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2"><Input required name="studioName" className="sm:col-span-2" placeholder="Nazwa studia" /><Input required name="coupleName" className="sm:col-span-2" placeholder="Para Młoda, np. Anna i Piotr" /><Input name="date" type="date" /><Input name="location" placeholder="Miejsce wydarzenia" />{error && <p className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Button disabled={loading} className="sm:col-span-2 h-12 gap-2">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Tworzymy bezpieczną przestrzeń…" : "Utwórz studio i wydarzenie"}</Button></form></section>;
}
