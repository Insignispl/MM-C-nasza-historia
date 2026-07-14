import { createClient } from "@/lib/supabase/server";
import { Media } from "@/types";
import { GalleryGrid } from "./GalleryGrid";

export const metadata = {
  title: "Album | Maria i Michał Czujko",
  description: "Zdjęcia i filmy z naszego ślubu w Polkowicach.",
};

export default async function AlbumPage() {
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Album wspomnień
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Wszystkie zdjęcia i filmy zarejestrowane przez nas i naszych gości.
            Kliknij, aby powiększyć.
          </p>
        </div>
        <GalleryGrid initialMedia={(media as Media[]) || []} />
      </div>
    </section>
  );
}
