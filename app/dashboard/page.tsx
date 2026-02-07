import { Calendar, Flame, HeartPulse, Sparkles, Star } from "lucide-react";

const stats = [
  { label: "جلسه های پیش رو", value: "۳", icon: Calendar },
  { label: "جلسه های انجام شده", value: "۱۲", icon: HeartPulse },
  { label: "امتیاز شما", value: "۴.۹", icon: Star },
  { label: "پروتکل اختصاصی", value: "۲", icon: Flame },
];

const upcoming = [
  { name: "جلسه دیپ تیشو", time: "۱۰:۳۰", type: "درمانگر: ندا حسینی" },
  { name: "آروما فلو", time: "۱۲:۰۰", type: "درمانگر: سارا قنبری" },
  { name: "ریکاوری ورزشی", time: "۱۴:۱۵", type: "درمانگر: مهسا رضایی" },
];

const notes = [
  "تمرکز روی آزادسازی شانه راست، کشش روزانه ۵ دقیقه.",
  "مصرف آب بعد از جلسه و استراحت ۸ ساعت توصیه شد.",
  "جلسه بعدی با فشار متوسط برای کمربند لگنی.",
];

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
            پنل مشتری
          </p>
          <h1 className="mt-2 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
            خوش آمدید، مسیر آرامش شما آماده است.
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-xs text-[color:var(--muted-text)]">
          <Sparkles className="h-4 w-4" />
          بروزرسانی ۵ دقیقه پیش
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
                {item.label}
              </p>
              <item.icon className="h-4 w-4 text-[color:var(--accent-strong)]" />
            </div>
            <p className="mt-4 text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
            جلسه های آینده شما
          </h2>
            <button className="text-xs text-[color:var(--accent-strong)]">مشاهده همه</button>
          </div>
          <div className="mt-4 grid gap-3">
            {upcoming.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/80 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-[color:var(--muted-text)]">{item.type}</p>
                </div>
                <span className="text-xs text-[color:var(--muted-text)]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-6">
          <h2 className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
            یادداشت های درمانگر
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted-text)]">
            {notes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/80 px-4 py-3"
              >
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
