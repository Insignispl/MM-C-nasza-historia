"use client";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Media, MediaType } from "@/types";
import { Film, Image as ImageIcon, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function GalleryGrid({ initialMedia }: { initialMedia: Media[] }) {
  const [filter, setFilter] = useState<MediaType | "all">("all");

  const filtered =
    filter === "all"
      ? initialMedia
      : initialMedia.filter((m) => m.type === filter);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Wszystko
        </Button>
        <Button
          variant={filter === "image" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("image")}
        >
          <ImageIcon className="mr-1 h-4 w-4" />
          Zdjęcia
        </Button>
        <Button
          variant={filter === "video" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("video")}
        >
          <Film className="mr-1 h-4 w-4" />
          Filmy
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white/60 py-20 text-center text-muted-foreground backdrop-blur-sm">
          <p className="mb-2 text-lg">Album jest jeszcze pusty.</p>
          <p className="text-sm">Bądź pierwszym gościem, który doda wspomnienie.</p>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((m) => (
            <Dialog key={m.id}>
              <DialogTrigger asChild>
                <div className="group relative mb-4 cursor-pointer overflow-hidden rounded-2xl border border-border bg-muted break-inside-avoid">
                  {m.type === "image" ? (
                    <Image
                      src={m.public_url}
                      alt={m.caption || "Zdjęcie z wesela"}
                      width={600}
                      height={800}
                      className="w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative aspect-video w-full">
                      <video
                        src={m.public_url}
                        className="h-full w-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                        <Play className="h-12 w-12 text-white drop-shadow-md" />
                      </div>
                    </div>
                  )}
                  {m.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 transition group-hover:opacity-100">
                      <p className="text-sm font-medium">{m.caption}</p>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent>
                {m.type === "image" ? (
                  <Image
                    src={m.public_url}
                    alt={m.caption || "Zdjęcie z wesela"}
                    width={1200}
                    height={900}
                    className="h-auto max-h-[80vh] w-full rounded-xl object-contain"
                  />
                ) : (
                  <video
                    src={m.public_url}
                    controls
                    className="w-full rounded-xl"
                  />
                )}
                {m.caption && (
                  <p className="px-6 pb-6 pt-2 text-center text-muted-foreground">
                    {m.caption}
                  </p>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </>
  );
}
