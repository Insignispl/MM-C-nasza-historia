"use client";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Check, CircleDotDashed, Loader2, MoonStar, Palette, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Template = "romantic" | "editorial" | "midnight";
type Design = { story_template: Template; story_background_color: string; story_gradient_from: string; story_gradient_to: string; story_text_color: string };

const presets: { id: Template; name: string; description: string; icon: typeof Sparkles; colors: Pick<Design, "story_background_color" | "story_gradient_from" | "story_gradient_to" | "story_text_color"> }[] = [
  { id: "romantic", name: "Romantic Bloom", description: "Jasna, miękka historia z pastelową poświatą i osi czasu.", icon: Sparkles, colors: { story_background_color: "#fff9fc", story_gradient_from: "#f4d7e5", story_gradient_to: "#ddd2f0", story_text_color: "#38263d" } },
  { id: "editorial", name: "Editorial Ivory", description: "Minimalistyczny magazynowy układ: kość słoniowa, serif i dużo oddechu.", icon: CircleDotDashed, colors: { story_background_color: "#f7f3ec", story_gradient_from: "#e9ddc9", story_gradient_to: "#c5d4ce", story_text_color: "#20201e" } },
  { id: "midnight", name: "Midnight Cinema", description: "Ciemna, kinowa oprawa dla energicznego wieczoru i filmowych kadrów.", icon: MoonStar, colors: { story_background_color: "#15111c", story_gradient_from: "#5b315d", story_gradient_to: "#183b4d", story_text_color: "#f8f2f7" } },
];

export function StoryDesignManager({ eventId }: { eventId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.from("events").select("story_template,story_background_color,story_gradient_from,story_gradient_to,story_text_color").eq("id", eventId).single().then(({ data }) => {
      setDesign(data as Design | null);
      setLoading(false);
    });
  }, [eventId, supabase]);

  function choose(template: typeof presets[number]) {
    setDesign({ story_template: template.id, ...template.colors });
    setNotice("");
  }

  async function save() {
    if (!design) return;
    setSaving(true);
    const { error } = await supabase.from("events").update(design).eq("id", eventId);
    setNotice(error ? error.message : "Projekt historii zapisany.");
    setSaving(false);
  }

  if (loading || !design) return <section className="mt-6 flex min-h-44 items-center justify-center rounded-3xl border border-border bg-white/75"><Loader2 className="h-6 w-6 animate-spin text-primary" /></section>;

  return <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-white/75 shadow-sm"><div className="bg-gradient-to-r from-[#392142] via-[#75506f] to-[#b87e9e] p-6 text-white"><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70"><Palette className="h-4 w-4" /> Design Event Story</p><h2 className="mt-2 font-serif text-3xl">Wygląd, który pasuje do tej historii</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">Wybierz kompletny szablon, potem dopracuj tło, gradient oraz kolor tekstu. Te ustawienia zobaczą goście i odwiedzający portfolio.</p></div><div className="p-6"><div className="grid gap-4 lg:grid-cols-3">{presets.map((template) => { const Icon = template.icon; const selected = design.story_template === template.id; return <button key={template.id} type="button" onClick={() => choose(template)} className={`overflow-hidden rounded-2xl border text-left transition ${selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}><div className="h-24 p-4" style={{ background: `linear-gradient(135deg, ${template.colors.story_gradient_from}, ${template.colors.story_gradient_to})`, color: template.colors.story_text_color }}><span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/70"><Icon className="h-4 w-4" /></span><span className="float-right rounded-full bg-white/70 px-2 py-1 text-xs font-semibold">{selected ? "Wybrany" : "Wybierz"}</span></div><div className="p-4"><p className="font-semibold">{template.name}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{template.description}</p></div></button>; })}</div><div className="mt-6 grid gap-4 rounded-2xl bg-muted/45 p-4 sm:grid-cols-2 lg:grid-cols-4">{([['story_background_color', 'Tło strony'], ['story_gradient_from', 'Gradient od'], ['story_gradient_to', 'Gradient do'], ['story_text_color', 'Tekst']] as const).map(([key, label]) => <label key={key} className="rounded-xl bg-white p-3 text-xs font-semibold text-muted-foreground">{label}<span className="mt-2 flex items-center gap-2"><input type="color" value={design[key]} onChange={(event) => setDesign({ ...design, [key]: event.target.value })} className="h-9 w-11 cursor-pointer rounded border-0 bg-transparent p-0" /><input value={design[key]} onChange={(event) => setDesign({ ...design, [key]: event.target.value })} className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none" /></span></label>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{notice || "Zmiany są widoczne po zapisaniu."}</p><Button onClick={save} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? "Zapisuję…" : "Zapisz wygląd historii"}</Button></div></div></section>;
}
