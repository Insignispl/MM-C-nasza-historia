"use client";

import { Heart, LockKeyhole, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/site-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("To hasło nie jest prawidłowe. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fcf8fc] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(159,122,234,0.24),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(251,211,141,0.34),_transparent_42%)]" />
      <div className="absolute left-[10%] top-[14%] h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
      <div className="absolute bottom-[12%] right-[12%] h-32 w-32 rounded-full bg-secondary/40 blur-2xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-2xl shadow-primary/15 backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#c66ba6] text-white shadow-lg shadow-primary/25">
          <Heart className="h-7 w-7 fill-current" />
        </div>
        <div className="text-center">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Prywatne wspomnienia
          </p>
          <h1 className="font-serif text-4xl font-medium text-foreground">Maria i Michał</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Wpisz hasło otrzymane od Pary Młodej, aby otworzyć naszą historię.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <LockKeyhole className="h-4 w-4 text-primary" /> Hasło dostępu
            </span>
            <input
              autoFocus
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Wpisz hasło"
              className="h-13 w-full rounded-2xl border border-border bg-white px-4 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="h-13 w-full rounded-2xl bg-primary px-4 font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Otwieramy album…" : "Wejdź do albumu"}
          </button>
        </form>
      </section>
    </main>
  );
}
