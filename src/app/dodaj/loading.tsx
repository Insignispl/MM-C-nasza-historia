export default function AddLoading() {
  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-80 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-5 rounded-3xl border border-border bg-white/70 p-6 md:p-10">
          <div className="h-10 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-12 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </section>
  );
}
