export default function Loading() {
  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)] px-6 py-10">
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-40 rounded-full bg-[color:var(--surface-muted)]" />
          <div className="h-10 w-28 rounded-full bg-[color:var(--surface-muted)]" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="h-6 w-48 rounded-full bg-[color:var(--surface-muted)]" />
            <div className="mt-6 h-12 w-full rounded-3xl bg-[color:var(--surface-muted)]" />
            <div className="mt-4 h-12 w-4/5 rounded-3xl bg-[color:var(--surface-muted)]" />
            <div className="mt-6 h-5 w-3/5 rounded-full bg-[color:var(--surface-muted)]" />
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="h-12 w-36 rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-12 w-32 rounded-full bg-[color:var(--surface-muted)]" />
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 rounded-2xl bg-[color:var(--surface-muted)]"
                />
              ))}
            </div>
          </div>
          <div className="h-80 rounded-[36px] bg-[color:var(--surface-muted)]" />
        </div>

        <div className="mt-16">
          <div className="h-8 w-64 rounded-full bg-[color:var(--surface-muted)]" />
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-3xl bg-[color:var(--surface-muted)]"
              />
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="h-96 rounded-[32px] bg-[color:var(--surface-muted)]" />
          <div className="grid gap-6">
            <div className="h-64 rounded-[32px] bg-[color:var(--surface-muted)]" />
            <div className="h-56 rounded-[32px] bg-[color:var(--surface-muted)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
