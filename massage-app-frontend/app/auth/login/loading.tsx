export default function Loading() {
  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-pulse">
        <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--surface-muted)]" />
        <div className="mt-6 h-6 w-40 mx-auto rounded-full bg-[color:var(--surface-muted)]" />
        <div className="mt-3 h-4 w-56 mx-auto rounded-full bg-[color:var(--surface-muted)]" />

        <div className="mt-8 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/80 p-8">
          <div className="h-4 w-20 rounded-full bg-[color:var(--surface-muted)]" />
          <div className="mt-3 h-11 w-full rounded-xl bg-[color:var(--surface-muted)]" />

          <div className="mt-6 h-4 w-24 rounded-full bg-[color:var(--surface-muted)]" />
          <div className="mt-3 h-11 w-full rounded-xl bg-[color:var(--surface-muted)]" />

          <div className="mt-6 h-4 w-32 rounded-full bg-[color:var(--surface-muted)]" />
          <div className="mt-3 h-11 w-full rounded-xl bg-[color:var(--surface-muted)]" />

          <div className="mt-8 h-12 w-full rounded-xl bg-[color:var(--surface-muted)]" />
        </div>
      </div>
    </div>
  );
}
