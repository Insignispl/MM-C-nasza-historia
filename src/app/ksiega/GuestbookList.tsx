"use client";

import { GuestbookEntry } from "@/types";
import { formatWeddingDate } from "@/lib/utils";
import { Heart, MessageCircle, Quote, Sparkles } from "lucide-react";
import Image from "next/image";

export function GuestbookList({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
  if (initialEntries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white/60 py-16 text-center text-muted-foreground backdrop-blur-sm">
        <MessageCircle className="mx-auto mb-4 h-10 w-10 text-primary/50" />
        <p className="text-lg">Jeszcze nie ma wpisów.</p>
        <p className="text-sm">Bądź pierwszym, kto zostawi życzenia.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {initialEntries.map((entry, index) => {
        const initials = entry.author_name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

        return (
          <article
            key={entry.id}
            className={`group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_12px_35px_rgba(89,50,87,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(89,50,87,0.16)] ${index % 3 === 0 ? "sm:col-span-2" : ""}`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#e7aed1] to-secondary" />
            <Quote className="absolute right-5 top-6 h-16 w-16 text-primary/[0.07]" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#cb7eae] text-sm font-bold tracking-wide text-white shadow-lg shadow-primary/20">
                  {initials || <Heart className="h-4 w-4 fill-current" />}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">{entry.author_name}</h2>
                  {entry.relation && <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.14em] text-primary">{entry.relation}</p>}
                </div>
              </div>
              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-secondary-foreground/70" />
            </div>
            <p className="relative mt-6 whitespace-pre-line font-serif text-lg leading-8 text-foreground/85 sm:text-xl">
              {entry.message}
            </p>
            {entry.media_url && (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white shadow-sm">
                <Image
                  src={entry.media_url}
                  alt={`Wspomnienie od ${entry.author_name}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            )}
            <div className="relative mt-6 flex items-center justify-between border-t border-primary/10 pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 fill-primary text-primary" /> Dla Młodej Pary</span>
              <time>{formatWeddingDate(entry.created_at)}</time>
            </div>
          </article>
        );
      })}
    </div>
  );
}
