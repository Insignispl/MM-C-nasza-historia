import { UploadForm } from "./UploadForm";

export const metadata = {
  title: "Dodaj wspomnienie | Maria i Michał Czujko",
  description: "Dodaj zdjęcie, film lub wpis do księgi gości.",
};

export default function AddPage() {
  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Dodaj wspomnienie
          </h1>
          <p className="text-muted-foreground">
            Podziel się zdjęciem, filmem lub życzeniami dla Marii i Michała Czujko.
          </p>
        </div>
        <UploadForm />
      </div>
    </section>
  );
}
