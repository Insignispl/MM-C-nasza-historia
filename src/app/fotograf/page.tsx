import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, Camera, ExternalLink, Images, LayoutDashboard, MonitorPlay, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Panel fotografa | Album ślubny",
  robots: { index: false, follow: false },
};

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Camera }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      </div>
      <p className="mt-4 font-serif text-4xl text-foreground">{value}</p>
    </div>
  );
}

export default async function PhotographerPage() {
  const supabase = await createClient();
  const [settingsResult, mediaResult, entriesResult, pendingMediaResult, pendingEntriesResult] = await Promise.all([
    supabase.from("wedding_settings").select("couple_name,wedding_date,location").single(),
    supabase.from("media").select("id", { count: "exact", head: true }).eq("approved", true),
    supabase.from("guestbook_entries").select("id", { count: "exact", head: true }).eq("approved", true),
    supabase.from("media").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase.from("guestbook_entries").select("id", { count: "exact", head: true }).eq("approved", false),
  ]);

  const settings = settingsResult.data;
  const photoCount = mediaResult.count ?? 0;
  const entryCount = entriesResult.count ?? 0;
  const pendingCount = (pendingMediaResult.count ?? 0) + (pendingEntriesResult.count ?? 0);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <section className="min-h-screen px-4 pb-20 pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#442e51] via-primary to-[#cc86af] p-7 text-white shadow-xl sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"><ShieldCheck className="h-4 w-4" /> Studio workspace</p>
              <h1 className="font-serif text-4xl sm:text-5xl">Panel fotografa</h1>
              <p className="mt-3 max-w-2xl text-white/80">Zarządzaj cyfrową pamiątką wydarzenia, moderuj materiały i udostępniaj gościom album.</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/10 px-5 py-4 text-sm">
              <p className="text-white/65">Aktywne wydarzenie</p>
              <p className="mt-1 text-lg font-semibold">{settings?.couple_name ?? "Wydarzenie ślubne"}</p>
              <p className="mt-1 text-white/70">{settings?.wedding_date} · {settings?.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Zatwierdzone media" value={photoCount} icon={Images} />
          <Metric label="Wpisy w księdze" value={entryCount} icon={Camera} />
          <Metric label="Czeka na moderację" value={pendingCount} icon={ShieldCheck} />
          <Metric label="Status wydarzenia" value={1} icon={BarChart3} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-border bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><LayoutDashboard className="h-5 w-5" /></span>
              <div><h2 className="font-serif text-2xl">Centrum wydarzenia</h2><p className="text-sm text-muted-foreground">Najważniejsze akcje przed, w trakcie i po weselu.</p></div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link href="/admin"><Button className="h-auto w-full justify-start gap-3 py-4"><ShieldCheck className="h-5 w-5" /> Moderuj materiały {pendingCount > 0 ? `(${pendingCount})` : ""}</Button></Link>
              <Link href="/dodaj"><Button variant="outline" className="h-auto w-full justify-start gap-3 py-4"><Camera className="h-5 w-5" /> Sprawdź formularz gościa</Button></Link>
              <Link href="/album"><Button variant="outline" className="h-auto w-full justify-start gap-3 py-4"><Images className="h-5 w-5" /> Otwórz album</Button></Link>
              <Link href="/ksiega"><Button variant="outline" className="h-auto w-full justify-start gap-3 py-4"><ExternalLink className="h-5 w-5" /> Otwórz księgę gości</Button></Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-primary/15 bg-primary/[0.06] p-6 sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm"><QrCode className="h-5 w-5" /></span>
            <h2 className="mt-5 font-serif text-2xl">Gotowe dla gości</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Udostępnij ten adres w kodzie QR na stolikach. Goście dodadzą zdjęcia, filmy i życzenia.</p>
            <div className="mt-5 break-all rounded-xl border border-primary/15 bg-white/80 p-3 text-xs text-muted-foreground">{baseUrl || "Ustaw NEXT_PUBLIC_BASE_URL"}</div>
            <Link href="/"><Button variant="outline" className="mt-4 w-full gap-2"><MonitorPlay className="h-4 w-4" /> Podgląd strony gościa</Button></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
