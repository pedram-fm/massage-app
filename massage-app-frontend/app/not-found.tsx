import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[color:var(--surface)] text-[color:var(--brand)]">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold">404</h1>
        <p className="text-sm text-[color:var(--muted-text)]">
          صفحه مورد نظر پیدا نشد.
        </p>
        <Link
          href="/"
          className="rounded-full bg-[color:var(--brand)] px-5 py-2 text-sm text-[color:var(--brand-foreground)]"
        >
          بازگشت به خانه
        </Link>
      </div>
    </main>
  );
}
