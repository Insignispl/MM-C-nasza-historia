"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { Check, Eye, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PendingItem {
  id: string;
  type: "media" | "entry";
  created_at: string;
  data: any;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === expectedPassword) {
      setLoggedIn(true);
      setError(null);
    } else {
      setError("Nieprawidłowe hasło.");
    }
  }

  useEffect(() => {
    if (!loggedIn) return;
    fetchPending();
  }, [loggedIn]);

  async function fetchPending() {
    setLoading(true);
    const supabase = createAdminClient();
    const [{ data: media }, { data: entries }] = await Promise.all([
      supabase.from("media").select("*").eq("approved", false).order("created_at", { ascending: false }),
      supabase.from("guestbook_entries").select("*").eq("approved", false).order("created_at", { ascending: false }),
    ]);

    const mapped: PendingItem[] = [
      ...(media || []).map((m) => ({ id: m.id, type: "media" as const, created_at: m.created_at, data: m })),
      ...(entries || []).map((e) => ({ id: e.id, type: "entry" as const, created_at: e.created_at, data: e })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setItems(mapped);
    setLoading(false);
  }

  async function approve(item: PendingItem, approved: boolean) {
    const supabase = createAdminClient();
    const table = item.type === "media" ? "media" : "guestbook_entries";
    const { error } = await supabase.from(table).update({ approved }).eq("id", item.id);
    if (error) {
      alert("Błąd: " + error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function deleteItem(item: PendingItem) {
    if (!confirm("Na pewno usunąć?")) return;
    const supabase = createAdminClient();
    const table = item.type === "media" ? "media" : "guestbook_entries";
    const { error } = await supabase.from(table).delete().eq("id", item.id);
    if (error) {
      alert("Błąd: " + error.message);
      return;
    }
    if (item.type === "media" && item.data.storage_path) {
      await supabase.storage.from("media").remove([item.data.storage_path]);
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  if (!loggedIn) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 pt-24">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Panel administratora</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={login} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło administratora"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full">
                Zaloguj
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Moderacja</h1>
            <p className="text-muted-foreground">Zatwierdzaj lub usuwaj wpisy gości.</p>
          </div>
          <Button variant="outline" onClick={fetchPending} disabled={loading}>
            Odśwież
          </Button>
        </div>

        {loading && <p className="text-center text-muted-foreground">Ładowanie...</p>}

        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-border bg-white/60 py-16 text-center text-muted-foreground backdrop-blur-sm">
            Brak elementów do moderacji.
          </div>
        )}

        <div className="grid gap-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-5">
                {item.type === "media" ? (
                  <div className="mb-4 overflow-hidden rounded-xl border border-border">
                    {item.data.type === "image" ? (
                      <Image
                        src={item.data.public_url}
                        alt="Podgląd"
                        width={800}
                        height={500}
                        className="w-full object-contain"
                      />
                    ) : (
                      <video src={item.data.public_url} controls className="w-full" />
                    )}
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl border border-border bg-muted/50 p-5">
                    <p className="mb-2 font-medium text-foreground">{item.data.author_name}</p>
                    <p className="whitespace-pre-line text-muted-foreground">{item.data.message}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {item.type === "media" ? "Zdjęcie / film" : "Wpis księgi"} ·{" "}
                    {new Date(item.created_at).toLocaleString("pl-PL")}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:bg-red-50"
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Usuń
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => approve(item, false)}
                    >
                      <X className="h-4 w-4" />
                      Odrzuć
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => approve(item, true)}>
                      <Check className="h-4 w-4" />
                      Zatwierdź
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
