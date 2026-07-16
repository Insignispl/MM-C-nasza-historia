"use client";

import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const emojis = ["❤️", "🥂", "😂", "🔥", "👏"] as const;
type Emoji = typeof emojis[number];

export function ReactionBar({ eventId }: { eventId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [counts, setCounts] = useState<Record<Emoji, number>>({ "❤️": 0, "🥂": 0, "😂": 0, "🔥": 0, "👏": 0 });
  const [sending, setSending] = useState<Emoji | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("event_reactions").select("emoji").eq("event_id", eventId);
      const next = { "❤️": 0, "🥂": 0, "😂": 0, "🔥": 0, "👏": 0 };
      data?.forEach(({ emoji }) => { if (emoji in next) next[emoji as Emoji] += 1; });
      setCounts(next);
    }
    load();
    const channel = supabase.channel(`reactions-${eventId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "event_reactions", filter: `event_id=eq.${eventId}` }, ({ new: reaction }) => {
      const emoji = (reaction as { emoji: Emoji }).emoji;
      if (emoji in counts) setCounts((current) => ({ ...current, [emoji]: current[emoji] + 1 }));
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventId, supabase]);

  async function react(emoji: Emoji) {
    setSending(emoji);
    const { error } = await supabase.from("event_reactions").insert({ event_id: eventId, emoji });
    if (error) setSending(null);
    else window.setTimeout(() => setSending(null), 250);
  }

  return <section className="mx-auto max-w-3xl px-4 py-10 text-center"><div className="rounded-[2rem] border border-primary/10 bg-white/80 p-6 shadow-sm"><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Heart className="h-5 w-5 fill-current" /></span><h2 className="mt-3 font-serif text-3xl">Poczuj tę chwilę razem z Nimi</h2><p className="mt-2 text-sm text-muted-foreground">Zostaw reakcję — pojawi się także na Live Wall.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{emojis.map((emoji) => <button key={emoji} onClick={() => react(emoji)} disabled={sending !== null} className="inline-flex min-w-16 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-lg shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md disabled:opacity-60"><span>{emoji}</span><span className="text-xs font-semibold text-muted-foreground">{counts[emoji]}</span></button>)}</div></div></section>;
}
