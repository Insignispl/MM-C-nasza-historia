"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { Camera, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export default function PhotographerStartPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studioName, setStudioName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    const normalizedEmail = email.trim().replace(/^["']|["']$/g, "");

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (signInError) setError(signInError.message);
      else window.location.assign("/fotograf");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({ email: normalizedEmail, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setNotice("Sprawdź skrzynkę e-mail i potwierdź konto. Następnie wróć tutaj, aby utworzyć pierwsze wydarzenie.");
      setLoading(false);
      return;
    }

    const studioSlug = slugify(studioName);
    const eventSlug = slugify(eventName);
    const { error: setupError } = await supabase.rpc("create_studio_with_event", {
      studio_name: studioName,
      studio_slug: studioSlug,
      event_name: eventName,
      event_slug: eventSlug,
      event_date: eventDate || null,
      event_location: eventLocation || null,
    });

    if (setupError) setError(setupError.message);
    else window.location.assign("/fotograf");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#fcf8fc] px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.25rem] border border-white bg-white shadow-2xl shadow-primary/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-gradient-to-br from-[#402b4c] via-primary to-[#cf82ad] p-8 text-white sm:p-12">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Camera className="h-7 w-7" /></span>
          <p className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70"><Sparkles className="h-4 w-4" /> Wedding memory platform</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Twoje studio. Każde wspomnienie.</h1>
          <p className="mt-5 max-w-md leading-7 text-white/80">Twórz eleganckie, prywatne cyfrowe pamiątki dla Par Młodych — z QR, albumem, księgą gości i moderacją.</p>
          <div className="mt-10 space-y-4 text-sm text-white/85">
            {["Wydarzenia niezależne dla każdej Pary", "Moderacja zdjęć, filmów i życzeń", "Gotowe do rozwoju o kiosk oraz Live Wall"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0" /> {item}</p>)}
          </div>
        </section>

        <section className="p-8 sm:p-12">
          <div className="flex rounded-2xl bg-muted p-1 text-sm font-medium">
            <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-xl px-3 py-2 transition ${mode === "signup" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>Załóż studio</button>
            <button type="button" onClick={() => setMode("signin")} className={`flex-1 rounded-xl px-3 py-2 transition ${mode === "signin" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>Zaloguj się</button>
          </div>
          <h2 className="mt-8 font-serif text-3xl">{mode === "signup" ? "Zacznij pierwsze wydarzenie" : "Witaj ponownie"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "signup" ? "Konto fotografa i pierwsze wydarzenie utworzysz w jednym kroku." : "Zaloguj się do panelu studia."}</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
            <Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło (min. 8 znaków)" />
            {mode === "signup" && <>
              <Input required value={studioName} onChange={(e) => setStudioName(e.target.value)} placeholder="Nazwa studia, np. Kadr Miłości" />
              <Input required value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Para Młoda, np. Anna i Piotr" />
              <div className="grid gap-4 sm:grid-cols-2"><Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /><Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Miejsce wydarzenia" /></div>
            </>}
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {notice && <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{notice}</p>}
            <Button className="h-12 w-full gap-2" disabled={loading}><Mail className="h-4 w-4" />{loading ? "Przetwarzanie…" : mode === "signup" ? "Utwórz studio" : "Zaloguj się"}</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
