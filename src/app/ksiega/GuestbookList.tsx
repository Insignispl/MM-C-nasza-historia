"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { GuestbookEntry } from "@/types";
import { formatWeddingDate } from "@/lib/utils";
import { Heart, MessageCircle } from "lucide-react";
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
    <div className="grid gap-6 sm:grid-cols-2">
      {initialEntries.map((entry) => (
        <Card key={entry.id} className="bg-white/70 backdrop-blur-sm transition hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart className="h-4 w-4" />
              </span>
              {entry.author_name}
            </CardTitle>
            {entry.relation && (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {entry.relation}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {entry.message}
            </p>
            {entry.media_url && (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <Image
                  src={entry.media_url}
                  alt="Załączone zdjęcie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <p className="text-right text-xs text-muted-foreground">
              {formatWeddingDate(entry.created_at)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
