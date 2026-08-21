import { Aperture } from "lucide-react";
import Link from "next/link";
import { LOKALIZACJE } from "@/lib/oferta";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Aperture className="h-4 w-4 text-foreground" />
          <span><span className="font-logo text-xl leading-none">Story Atelier</span> · Fotografia, film i studio nagrań · {LOKALIZACJE.map((l) => l.miasto).join(" i ")}</span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/#uslugi" className="hover:text-foreground">Usługi</Link>
          <Link href="/studio" className="hover:text-foreground">Studio nagrań</Link>
          <Link href="/#realizacje" className="hover:text-foreground">Realizacje</Link>
          <Link href="/#kontakt" className="hover:text-foreground">Kontakt</Link>
          <Link href="/prywatnosc" className="hover:text-foreground">Prywatność</Link>
          <Link href="/fotograf" className="hover:text-foreground">Panel</Link>
        </div>
      </div>
    </footer>
  );
}
