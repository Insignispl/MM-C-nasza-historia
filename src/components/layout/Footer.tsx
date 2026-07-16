import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 fill-primary text-primary" />
          <span>Story Atelier · Fotografia i Event Story</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/#portfolio" className="hover:text-foreground">Portfolio</Link>
          <Link href="/#kontakt" className="hover:text-foreground">Kontakt</Link>
          <Link href="/fotograf" className="hover:text-foreground">Panel fotografa</Link>
        </div>
      </div>
    </footer>
  );
}
