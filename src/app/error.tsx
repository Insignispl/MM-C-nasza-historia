"use client";

import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-light text-foreground">Ups, coś poszło nie tak</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Wystąpił błąd podczas ładowania strony. Spróbuj odświeżyć.
      </p>
      <Button onClick={reset} size="lg">
        Spróbuj ponownie
      </Button>
    </section>
  );
}
