export default function Loading() {
  return (
    <section
      aria-live="polite"
      className="flex w-full flex-col gap-6"
      role="status"
    >
      <div className="h-4 w-32 animate-pulse rounded bg-amber-200" />
      <div className="h-10 w-full max-w-lg animate-pulse rounded bg-slate-200" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            key={item}
          >
            <div className="aspect-video animate-pulse bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
