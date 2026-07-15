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
        <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[230px] sm:grid-cols-4 sm:gap-4">
          {filtered.map((m, index) => {
            const isFeature = index % 7 === 0;
            const isTall = !isFeature && index % 5 === 2;
            const tileClass = isFeature
              ? "col-span-2 row-span-2"
              : isTall
                ? "row-span-2"
                : "col-span-1 row-span-1";

            return (
            <Dialog key={m.id}>
              <DialogTrigger asChild>
                <div className={`group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/70 bg-muted shadow-sm transition duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-xl ${tileClass}`}>
                  {m.type === "image" ? (
                    <Image
                      src={m.public_url}
                      alt={m.caption || "Zdjęcie z wesela"}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="relative h-full w-full">
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                    {m.caption && <p className="text-sm font-medium">{m.caption}</p>}
                    {m.guest_name && <p className="mt-1 text-xs text-white/80">od {m.guest_name}</p>}
                  </div>
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
            );
          })}
        </div>
      )}
    </>
  );
}
