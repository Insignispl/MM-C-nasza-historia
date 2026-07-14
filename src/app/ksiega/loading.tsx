export default function GuestbookLoading() {
  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-80 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </section>
  );
}
