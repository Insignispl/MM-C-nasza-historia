import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "Nie znaleziono strony | Album Ślubny",
};

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-extralight text-primary">404</h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Wygląda na to, że ta strona zgubiła się w tańcu. Wróć na główną.
      </p>
      <Link href="/">
        <Button size="lg">Wróć na stronę główną</Button>
      </Link>
    </section>
  );
}
