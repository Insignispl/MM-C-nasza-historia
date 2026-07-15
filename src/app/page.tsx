import { PhotographerLanding } from "./PhotographerLanding";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { formatWeddingDate } from "@/lib/utils";
import { CalendarHeart, Image as ImageIcon, PenLine, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  return <PhotographerLanding />;

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("wedding_settings")
    .select("*")
    .single();

  if (!settings) {
    redirect("/admin");
  }

  const { data: featuredMedia } = await supabase
    .from("media")
    .select("*")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-secondary/30 to-primary/10" />
        <div className="mx-auto max-w-3xl animation-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <CalendarHeart className="h-4 w-4 text-primary" />
            {formatWeddingDate(settings.wedding_date)} · {settings.location}
          </div>
          <h1 className="mb-6 text-balance text-5xl font-extralight tracking-tight text-foreground sm:text-7xl">
            {settings.couple_name}
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Zapraszamy Cię do naszego albumu ślubnego — miejsca pełnego wspomnień,
            śmiechu i miłości. Zostaw wpis, przejrzyj zdjęcia i filmy z tego
            wyjątkowego dnia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/album">
              <Button size="lg" className="gap-2">
                <ImageIcon className="h-5 w-5" />
                Zobacz album
              </Button>
            </Link>
            <Link href="/ksiega">
              <Button size="lg" variant="outline" className="gap-2">
                <PenLine className="h-5 w-5" />
                Księga gości
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-3xl border border-border bg-white/70 p-8 shadow-sm backdrop-blur-sm md:p-12">
          <h2 className="font-serif mb-6 text-center text-3xl font-light tracking-tight text-foreground">
            Nasza historia
          </h2>
          <div className="prose prose-lg mx-auto text-center text-muted-foreground">
            <p className="text-balance leading-relaxed">
              {settings.story_text ||
                "Maria Wiatrowska i Michał Czujko spotkali się w Polkowicach. Od pierwszego spotkania wiedzieli, że to coś wyjątkowego. 27 czerwca 2026 roku powiedzieli sobie tak, zaczynając wspólną podróż jako Maria i Michał Czujko."}
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-center">
            <div>
              <div className="font-serif text-3xl font-light text-primary">27</div>
              <div className="text-sm text-muted-foreground">czerwca 2026</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="font-serif text-3xl font-light text-primary">Polkowice</div>
              <div className="text-sm text-muted-foreground">miejsce ślubu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-serif mb-12 text-center text-3xl font-light tracking-tight text-foreground">
          Nasza podróż
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-border md:block" />
          <div className="space-y-12">
            {[
              { year: "Pierwsze spotkanie", label: "Polkowice", desc: "Tu wszystko się zaczęło." },
              { year: "2026", label: "Ślub", desc: "27 czerwca 2026 mówimy sobie tak." },
              { year: "Teraz", label: "Wesele", desc: "Świętujemy razem z Wami." },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`relative flex flex-col items-center gap-4 md:flex-row ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="flex-1 text-center md:w-1/2 md:text-right">
                  <div className="font-serif text-2xl font-light text-primary">{item.year}</div>
                  <div className="text-lg font-medium text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
                <div className="z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white md:absolute md:left-1/2 md:-translate-x-1/2" />
                <div className="flex-1 md:w-1/2 md:text-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured preview */}
      {(featuredMedia?.length ?? 0) > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-light tracking-tight">
            Wyróżnione wspomnienia
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMedia!.map((m) => (
              <Link
                key={m.id}
                href="/album"
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
              >
                <Image
                  src={m.public_url}
                  alt={m.caption || "Wspomnienie"}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* QR section */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm md:flex-row md:text-left">
          <div className="flex-1">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <QrCode className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-2xl font-light tracking-tight">
              Dodaj zdjęcie lub wpis w kilka sekund
            </h2>
            <p className="mb-6 text-muted-foreground">
              Zeskanuj kod QR telefonem, aby przejść do formularza. Nie wymaga
              logowania ani instalacji aplikacji — działa od razu.
            </p>
            <Link href="/dodaj">
              <Button size="lg" className="gap-2">
                <PenLine className="h-5 w-5" />
                Dodaj wspomnienie
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <QrCodePreview />
          </div>
        </div>
      </section>
    </>
  );
}

async function QrCodePreview() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const svg = await import("qrcode").then((m) =>
    m.toString(`${baseUrl}/dodaj`, { type: "svg", width: 160, margin: 2 })
  );
  return (
    <div
      className="h-40 w-40"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="Kod QR do dodawania wspomnień"
    />
  );
}
