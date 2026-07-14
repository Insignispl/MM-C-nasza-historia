"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Film, PenLine, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

export function UploadForm() {
  const supabase = createClient();
  const [tab, setTab] = useState<"media" | "message">("media");
  const [files, setFiles] = useState<File[]>([]);
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => {
      if (f.size > MAX_FILE_SIZE) {
        setError("Plik jest za duży. Maksymalny rozmiar to 100 MB.");
        return false;
      }
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError("Nieprawidłowy format pliku. Dozwolone: zdjęcia i filmy.");
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...valid].slice(0, 10));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleMediaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (files.length === 0) {
      setError("Wybierz przynajmniej jeden plik.");
      return;
    }
    setLoading(true);

    try {
      for (const file of files) {
        const ext = file.name.split(".").pop() || "";
        const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        const publicUrl = urlData.publicUrl;

        const type = file.type.startsWith("video") ? "video" : "image";

        const { error: insertError } = await supabase.from("media").insert({
          type,
          storage_path: path,
          public_url: publicUrl,
          caption,
          guest_name: guestName || null,
        });

        if (insertError) throw insertError;
      }

      setFiles([]);
      setCaption("");
      setGuestName("");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas przesyłania.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMessageSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!authorName.trim() || !message.trim()) {
      setError("Wypełnij imię i wiadomość.");
      return;
    }
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from("guestbook_entries").insert({
        author_name: authorName.trim(),
        relation: relation.trim() || null,
        message: message.trim(),
      });

      if (insertError) throw insertError;

      setAuthorName("");
      setRelation("");
      setMessage("");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas zapisywania wpisu.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-border bg-white/80 p-10 text-center shadow-sm backdrop-blur-sm animation-fade-in">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
        <h2 className="mb-2 text-2xl font-medium text-foreground">Dziękujemy!</h2>
        <p className="mb-6 text-muted-foreground">
          Twoje wspomnienie zostało przesłane i pojawi się po zatwierdzeniu przez młodą parę.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Dodaj kolejne
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white/70 p-6 shadow-sm backdrop-blur-sm md:p-10">
      <div className="mb-8 flex justify-center gap-2">
        <Button
          type="button"
          variant={tab === "media" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("media")}
        >
          <ImageIcon className="mr-1 h-4 w-4" />
          Zdjęcie / film
        </Button>
        <Button
          type="button"
          variant={tab === "message" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("message")}
        >
          <PenLine className="mr-1 h-4 w-4" />
          Wpis do księgi
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {tab === "media" ? (
        <form onSubmit={handleMediaSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Twoje zdjęcia i filmy</label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8 text-muted-foreground transition hover:bg-muted"
            >
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm font-medium">Kliknij, aby wybrać pliki</span>
              <span className="text-xs">Maks. 100 MB / plik</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-white p-3 text-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {file.type.startsWith("video") ? (
                      <Film className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <ImageIcon className="h-5 w-5 shrink-0 text-primary" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Usuń
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label htmlFor="guestName" className="mb-2 block text-sm font-medium">
              Imię i nazwisko
            </label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Np. Kasia i Paweł"
            />
          </div>

          <div>
            <label htmlFor="caption" className="mb-2 block text-sm font-medium">
              Krótki opis / podpis
            </label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Co dzieje się na zdjęciu?"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Przesyłanie..." : "Prześlij zdjęcia / filmy"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleMessageSubmit} className="space-y-5">
          <div>
            <label htmlFor="authorName" className="mb-2 block text-sm font-medium">
              Imię i nazwisko
            </label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Twoje imię"
              required
            />
          </div>

          <div>
            <label htmlFor="relation" className="mb-2 block text-sm font-medium">
              Kim jesteś dla pary? (opcjonalnie)
            </label>
            <Input
              id="relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Np. rodzina, przyjaciel"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Życzenia / wspomnienie
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Napisz kilka ciepłych słów..."
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Zapisywanie..." : "Zapisz wpis w księdze"}
          </Button>
        </form>
      )}
    </div>
  );
}
