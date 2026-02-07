import { Calendar, Clock, MapPin, User } from "lucide-react";

const appointments = [
  {
    name: "سارا محمدی",
    time: "۱۰:۳۰",
    date: "امروز",
    type: "دیپ تیشو",
    room: "اتاق ۲",
    status: "تایید شده",
  },
  {
    name: "میلاد ترابی",
    time: "۱۲:۰۰",
    date: "امروز",
    type: "سنگ داغ",
    room: "اتاق ۱",
    status: "در انتظار",
  },
  {
    name: "ترانه زمانی",
    time: "۱۴:۱۵",
    date: "امروز",
    type: "آروما فلو",
    room: "اتاق ۳",
    status: "تایید شده",
  },
  {
    name: "پیمان امانی",
    time: "۱۶:۰۰",
    date: "امروز",
    type: "ریکاوری ورزشی",
    room: "اتاق ۴",
    status: "تایید شده",
  },
];

export default function AppointmentsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
            جلسه های رزرو شده
          </p>
          <h1 className="mt-2 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
            برنامه جلسه های شما
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-xs text-[color:var(--muted-text)]">
          <Calendar className="h-4 w-4" />
          شنبه، ۷ فوریه ۲۰۲۶
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {appointments.map((item) => (
          <div
            key={`${item.name}-${item.time}`}
            className="rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-muted)]">
                  <User className="h-5 w-5 text-[color:var(--accent-strong)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.type}</p>
                  <p className="text-xs text-[color:var(--muted-text)]">درمانگر: {item.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[color:var(--muted-text)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] px-3 py-1">
                  <Clock className="h-4 w-4" />
                  {item.time}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] px-3 py-1">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] px-3 py-1">
                  <MapPin className="h-4 w-4" />
                  {item.room}
                </span>
              </div>

              <span className="rounded-full bg-[color:var(--surface-muted)] px-3 py-1 text-xs text-[color:var(--brand)]">
                {item.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-xs font-semibold text-[color:var(--brand-foreground)]">
                مشاهده جزئیات
              </button>
              <button className="rounded-full border border-[color:var(--surface-muted)] px-4 py-2 text-xs font-semibold text-[color:var(--brand)]">
                درخواست تغییر زمان
              </button>
              <button className="rounded-full border border-[color:var(--surface-muted)] px-4 py-2 text-xs font-semibold text-[color:var(--muted-text)]">
                پیام به درمانگر
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
