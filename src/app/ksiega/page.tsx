import { createClient } from "@/lib/supabase/server";
import { GuestbookEntry } from "@/types";
import { GuestbookList } from "./GuestbookList";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PenLine } from "lucide-react";

export const metadata = {
  title: "Księga gości | Maria i Michał Czujko",
  description: "Zostaw wpis i życzenia dla nowożeńców.",
};

export default async function GuestbookPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("guestbook_entries")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Księga gości
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Wpisz kilka ciepłych słów, podziel się wspomnieniem lub życzeniem.
            To dla nas najpiękniejsza pamiątka.
          </p>
          <Link href="/dodaj">
            <Button size="lg" className="gap-2">
              <PenLine className="h-5 w-5" />
              Zostaw wpis
            </Button>
          </Link>
        </div>
        <GuestbookList initialEntries={(entries as GuestbookEntry[]) || []} />
      </div>
    </section>
  );
}
