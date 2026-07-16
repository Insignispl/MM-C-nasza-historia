"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { Camera, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

export default function PhotographerStartPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    const normalizedEmail = email.trim().replace(/^["']|["']$/g, "");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (signInError) setError(signInError.message);
    else window.location.assign("/fotograf");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#fcf8fc] px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.25rem] border border-white bg-white shadow-2xl shadow-primary/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-gradient-to-br from-[#402b4c] via-primary to-[#cf82ad] p-8 text-white sm:p-12">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Camera className="h-7 w-7" /></span>
          <p className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70"><Sparkles className="h-4 w-4" /> Story Atelier CRM</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Twoje wydarzenia. Jedno miejsce.</h1>
          <p className="mt-5 max-w-md leading-7 text-white/80">Prywatne narzędzie do prowadzenia reportaży, albumów i cyfrowych pamiątek klientów Story Atelier.</p>
          <div className="mt-10 space-y-4 text-sm text-white/85">
            {["Wydarzenia niezależne dla każdej Pary", "Moderacja zdjęć, filmów i życzeń", "Gotowe do rozwoju o kiosk oraz Live Wall"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0" /> {item}</p>)}
          </div>
        </section>

        <section className="p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Panel właścicielki</p>
          <h2 className="mt-3 font-serif text-3xl">Witaj ponownie</h2>
          <p className="mt-2 text-sm text-muted-foreground">Zaloguj się do CRM Story Atelier.</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
            <Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło (min. 8 znaków)" />
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {notice && <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{notice}</p>}
            <Button className="h-12 w-full gap-2" disabled={loading}><Mail className="h-4 w-4" />{loading ? "Przetwarzanie…" : "Zaloguj się"}</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
