"use client";

import { cn } from "@/lib/utils";
import { Heart, Image, Menu, PenLine, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Historia", icon: Heart },
  { href: "/album", label: "Album", icon: Image },
  { href: "/ksiega", label: "Księga gości", icon: PenLine },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Maria & Michał</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  pathname === l.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/dodaj"
          className={cn(
            "hidden rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm transition hover:bg-secondary/90 md:inline-block",
            pathname === "/dodaj" && "ring-2 ring-ring ring-offset-2"
          )}
        >
          Dodaj wspomnienie
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-white/90 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                    pathname === l.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/dodaj"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-xl bg-secondary px-4 py-3 text-center text-sm font-semibold text-secondary-foreground"
              >
                Dodaj wspomnienie
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
