"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

type Chapter = { id: string; title: string };

export function StoryActions({ chapters, title }: { chapters: Chapter[]; title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareData = { title: `Story Atelier · ${title}`, text: "Zobacz tę historię w Story Atelier.", url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="flex items-center gap-2"><div className="hidden max-w-[42vw] gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 lg:flex">{chapters.map((chapter, index) => <a key={chapter.id} href={`#chapter-${chapter.id}`} className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-white/65 transition hover:bg-white/10 hover:text-white">{String(index + 1).padStart(2, "0")} · {chapter.title}</a>)}</div><button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20" aria-label="Udostępnij historię">{copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{copied ? "Skopiowano" : "Udostępnij"}</button></div>;
}
