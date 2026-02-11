"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[color:var(--surface)] text-[color:var(--brand)]">
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-semibold">خطای غیرمنتظره</h1>
          <p className="text-sm text-[color:var(--muted-text)]">
            مشکلی در بارگذاری صفحه رخ داد. لطفا دوباره تلاش کنید.
          </p>
          {error.digest ? (
            <p className="text-xs text-[color:var(--muted-text)]">Digest: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[color:var(--brand)] px-5 py-2 text-sm text-[color:var(--brand-foreground)]"
          >
            تلاش مجدد
          </button>
        </main>
      </body>
    </html>
  );
}
