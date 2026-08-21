"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Image as ImageIcon, Loader2, MessageCircle, Upload } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

export default function EventSubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = useMemo(() => createClient(), []);
  const [slug, setSlug] = useState(""); const [eventId, setEventId] = useState(""); const [chapters, setChapters] = useState<{ id: string; title: string }[]>([]); const [chapterId, setChapterId] = useState(""); const [tab, setTab] = useState<"media" | "entry">("media"); const [file, setFile] = useState<File | null>(null); const [name, setName] = useState(""); const [caption, setCaption] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false); const [postep, setPostep] = useState<number | null>(null); const [notice, setNotice] = useState(""); const [error, setError] = useState(""); const input = useRef<HTMLInputElement>(null);
  useEffect(() => { params.then(({ slug }) => { setSlug(slug); supabase.from("events").select("id").eq("slug", slug).single().then(async ({ data }) => { if (!data?.id) return; setEventId(data.id); const { data: storyChapters } = await supabase.from("event_story_chapters").select("id,title").eq("event_id", data.id).order("sort_order"); setChapters(storyChapters || []); }); }); }, [params, supabase]);
  /**
   * Wysylka pliku z licznikiem procentow. Nie da sie tego zrobic przez
   * supabase.storage.upload(): tamta metoda stoi na fetch, a fetch nie raportuje
   * postepu WYSYLANIA. Licznik ma tylko XMLHttpRequest, przez upload.onprogress.
   *
   * Przy limicie 250 MB i weselnym wifi to nie ozdoba - bez licznika gosc po minucie
   * uznaje, ze sie zawiesilo, i zamyka strone w polowie transferu.
   *
   * Kształt zadania jest CELOWO taki sam, jak sklada je biblioteka Supabase:
   * FormData z polem cacheControl i plikiem pod pusta nazwa. Inaczej serwer
   * storage odrzuca zawartosc.
   */
  function wyslijPlik(path: string, plik: File) {
    return new Promise<void>((resolve, reject) => {
      const adres = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/event-media/${path}`;
      const klucz = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const dane = new FormData();
      dane.append("cacheControl", "3600");
      dane.append("", plik);

      const zadanie = new XMLHttpRequest();
      zadanie.open("POST", adres, true);
      zadanie.setRequestHeader("authorization", `Bearer ${klucz}`);
      zadanie.setRequestHeader("apikey", klucz);
      zadanie.setRequestHeader("x-upsert", "false");
      zadanie.upload.onprogress = (zdarzenie) => {
        if (zdarzenie.lengthComputable) setPostep(Math.round((zdarzenie.loaded / zdarzenie.total) * 100));
      };
      zadanie.onload = () => {
        if (zadanie.status >= 200 && zadanie.status < 300) { setPostep(100); resolve(); return; }
        // Serwer storage odpowiada JSON-em z polem message. Gdy odpowiedz nie jest
        // JSON-em, pokazujemy kod - lepszy niz cisza.
        let powod = `Serwer odrzucil plik (${zadanie.status}).`;
        try { powod = (JSON.parse(zadanie.responseText) as { message?: string }).message || powod; } catch {}
        reject(new Error(powod));
      };
      zadanie.onerror = () => reject(new Error("Połączenie przerwane w trakcie wysyłania. Spróbuj ponownie."));
      zadanie.onabort = () => reject(new Error("Wysyłanie zostało przerwane."));
      zadanie.send(dane);
    });
  }

  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(""); try { if (!eventId) throw new Error("Wydarzenie nie jest dostępne."); if (tab === "entry") { const { error } = await supabase.from("event_guestbook_entries").insert({ event_id: eventId, author_name: name || "Gość", message, approved: false }); if (error) throw error; } else { if (!file) throw new Error("Wybierz zdjęcie lub film."); if (file.size > 250 * 1024 * 1024) throw new Error("Maksymalny rozmiar pliku to 250 MB."); const ext = file.name.split(".").pop() || "bin"; const path = `events/${eventId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`; setPostep(0); await wyslijPlik(path, file); const { data: url } = supabase.storage.from("event-media").getPublicUrl(path); const { error: insertError } = await supabase.from("event_media").insert({ event_id: eventId, type: file.type.startsWith("video") ? "video" : "image", storage_path: path, public_url: url.publicUrl, caption, guest_name: name || null, chapter_id: chapterId || null, approved: false }); if (insertError) throw insertError; } setNotice("Dziękujemy! Materiał czeka na zatwierdzenie przez fotografa."); setFile(null); setName(""); setCaption(""); setMessage(""); } catch (value) { setError(value instanceof Error ? value.message : "Nie udało się przesłać wspomnienia."); } finally { setLoading(false); setPostep(null); } }
  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-24"><section className="w-full max-w-xl rounded-[2rem] border border-border bg-card/85 p-7 shadow-xl sm:p-10"><Link href={`/e/${slug}`} className="text-sm text-muted-foreground">← Wróć do albumu</Link><h1 className="mt-5 font-display text-4xl">Dodaj wspomnienie</h1><p className="mt-2 text-sm text-muted-foreground">Twoja treść pojawi się po akceptacji fotografa.</p><div className="mt-7 flex rounded-2xl bg-muted p-1"><button onClick={() => setTab("media")} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${tab === "media" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Zdjęcie / film</button><button onClick={() => setTab("entry")} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${tab === "entry" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Życzenia</button></div>{notice ? <div className="mt-7 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-green-500" /><p className="mt-3 font-medium">{notice}</p><Link href={`/e/${slug}`}><Button className="mt-5">Wróć do albumu</Button></Link></div> : <form onSubmit={submit} className="mt-6 space-y-4"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Twoje imię (opcjonalnie)" />{tab === "media" ? <><button type="button" onClick={() => input.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border p-8 text-muted-foreground"><ImageIcon className="h-8 w-8" /><span className="text-sm font-medium">{file ? file.name : "Wybierz zdjęcie lub film"}</span><span className="text-xs">Maks. 250 MB</span></button><input ref={input} onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/*,video/*" type="file" className="hidden" /><Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Opis wspomnienia (opcjonalnie)" />{chapters.length > 0 && <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none"><option value="">Dodaj do całego albumu</option>{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select>}</> : <Textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Napisz kilka słów dla Pary Młodej…" className="min-h-40" />}{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{postep !== null && <div><div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${postep}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{postep < 100 ? `Wysyłanie… ${postep}%. Nie zamykaj tej strony.` : "Zapisujemy w albumie…"}</p></div>}<Button disabled={loading} className="w-full gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : tab === "media" ? <Upload className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}{loading ? (postep !== null && postep < 100 ? `Wysyłanie ${postep}%` : "Wysyłanie…") : "Wyślij do akceptacji"}</Button></form>}</section></main>;
}
