"use client";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, MessageCircle, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Item = { id: string; kind: "media" | "entry"; created_at: string; public_url?: string; type?: "image" | "video"; guest_name?: string | null; caption?: string | null; author_name?: string; message?: string };

export function EventModeration({ eventId }: { eventId: string }) {
  const supabase = createClient();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");

  async function load() {
    setLoading(true);
    const [{ data: media }, { data: entries }] = await Promise.all([
      supabase.from("event_media").select("id,created_at,public_url,type,guest_name,caption").eq("event_id", eventId).eq("approved", false).order("created_at", { ascending: false }),
      supabase.from("event_guestbook_entries").select("id,created_at,author_name,message").eq("event_id", eventId).eq("approved", false).order("created_at", { ascending: false }),
    ]);
    setItems([...(media || []).map((item) => ({ ...item, kind: "media" as const })), ...(entries || []).map((item) => ({ ...item, kind: "entry" as const }))].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)));
    setLoading(false);
  }

  useEffect(() => { load(); }, [eventId]);

  async function update(item: Item, action: "approve" | "delete") {
    setWorking(item.id);
    const table = item.kind === "media" ? "event_media" : "event_guestbook_entries";
    const request = action === "approve" ? supabase.from(table).update({ approved: true }).eq("id", item.id) : supabase.from(table).delete().eq("id", item.id);
    const { error } = await request;
    if (!error) setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    setWorking("");
  }

  return <section className="mt-6 rounded-3xl border border-border bg-white/75 p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-serif text-2xl">Moderacja</h2><p className="mt-1 text-sm text-muted-foreground">Akceptuj materiały, zanim zobaczą je goście.</p></div><Button variant="outline" size="sm" onClick={load}>Odśwież</Button></div>{loading ? <Loader2 className="mx-auto my-10 h-6 w-6 animate-spin text-primary" /> : !items.length ? <div className="py-10 text-center text-sm text-muted-foreground">Kolejka jest pusta.</div> : <div className="mt-5 grid gap-4">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-border"><div className="p-4">{item.kind === "media" ? <div>{item.type === "image" ? <div className="relative aspect-video overflow-hidden rounded-xl bg-muted"><Image src={item.public_url || ""} alt="Materiał do moderacji" fill className="object-cover" sizes="600px" /></div> : <video src={item.public_url} controls className="w-full rounded-xl" />}<p className="mt-3 text-sm font-semibold">{item.guest_name || "Gość"}</p>{item.caption && <p className="mt-1 text-sm text-muted-foreground">{item.caption}</p>}</div> : <div className="rounded-xl bg-muted/50 p-4"><MessageCircle className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold">{item.author_name}</p><p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{item.message}</p></div>}<div className="mt-4 flex justify-end gap-2"><Button size="sm" variant="outline" disabled={working === item.id} onClick={() => update(item, "delete")} className="gap-1 text-red-600"><Trash2 className="h-4 w-4" /> Usuń</Button><Button size="sm" disabled={working === item.id} onClick={() => update(item, "approve")} className="gap-1"><Check className="h-4 w-4" /> Zatwierdź</Button></div></div></article>)}</div>}</section>;
}
