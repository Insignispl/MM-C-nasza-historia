import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // Strony realizacji to jedyne tresciowe adresy w serwisie: nazwy miejsc, rodzaj
  // wydarzenia, opisy rozdzialow. Wczesniej nie bylo ich tu wcale, wiec caly
  // najbogatszy material czekal, az wyszukiwarka sama trafi na niego z linku.
  const supabase = await createClient();
  const { data: realizacje } = await supabase
    .from("events")
    .select("slug,wedding_date")
    .eq("is_portfolio", true)
    .eq("status", "live")
    .order("wedding_date", { ascending: false });

  // Swiadomie BEZ lastModified na stronach statycznych. new Date() przy kazdym
  // zadaniu oznacza "zmienilo sie wlasnie teraz" i przy powtarzaniu tego w kazdym
  // odpytaniu przestaje cokolwiek znaczyc. Lepiej nie podawac pola, niz podac nieprawde.
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/studio`, changeFrequency: "monthly", priority: 0.9 },
    ...(realizacje ?? []).map((realizacja) => ({
      url: `${baseUrl}/historia/${realizacja.slug}`,
      lastModified: new Date(realizacja.wedding_date),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/prywatnosc`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
