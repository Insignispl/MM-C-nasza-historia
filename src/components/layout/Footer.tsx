import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 fill-primary text-primary" />
          <span>
            Maria i Michał Czujko · 27 czerwca 2026 · Polkowice
          </span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/album" className="hover:text-foreground">Album</Link>
          <Link href="/ksiega" className="hover:text-foreground">Księga gości</Link>
          <Link href="/dodaj" className="hover:text-foreground">Dodaj wspomnienie</Link>
        </div>
      </div>
    </footer>
  );
}
