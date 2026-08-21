import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "Nie znaleziono strony",
};

export default function NotFoundPage() {
  return (
    <section className="surface-studio flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Błąd 404</p>
      <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
        Tej strony tu nie ma.
      </h1>
      <p className="mt-6 max-w-md leading-7 text-muted-foreground">
        Adres mógł się zmienić albo zawiera literówkę. Zajrzyj na stronę główną — usługi, realizacje i studio są tam.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/"><Button size="lg">Strona główna</Button></Link>
        <Link href="/studio"><Button size="lg" variant="outline">Studio nagrań</Button></Link>
      </div>
    </section>
  );
}