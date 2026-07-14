export default function AlbumLoading() {
  return (
    <section className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 aspect-square animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
