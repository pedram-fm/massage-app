"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bolt,
  Calendar,
  Flame,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const services = [
  {
    title: "ریست دیپ تیشو",
    description: "فشار هدفمند برای آزادسازی تنش های عمیق و اصلاح الگوی حرکتی.",
    duration: "۶۰ / ۹۰ دقیقه",
    icon: Flame,
  },
  {
    title: "آروما فلو",
    description: "حرکت های آهسته با رایحه های اختصاصی برای آرامش عصبی.",
    duration: "۶۰ دقیقه",
    icon: Waves,
  },
  {
    title: "سنگ های داغ",
    description: "گرمای کنترل شده برای کاهش استرس و افزایش گردش خون.",
    duration: "۷۵ دقیقه",
    icon: Sparkles,
  },
];

const articles = [
  {
    title: "چرا ماساژ دیپ تیشو برای بدن های پشت میز نشین ضروری است؟",
    summary:
      "وقتی ساعت ها روی صندلی می نشینیم، الگوی تنش به گردن و کمر منتقل می شود. این مقاله یک برنامه ۳۰ روزه بازگشت را توضیح می دهد.",
    tag: "سلامت ستون فقرات",
  },
  {
    title: "سه علامت که بدن شما نیاز به ریکاوری فوری دارد",
    summary:
      "از خواب سبک تا گرفتگی های مداوم، این نشانه ها می گویند زمان ماساژ تخصصی رسیده است.",
    tag: "سیگنال بدن",
  },
  {
    title: "چطور بعد از ماساژ، نتیجه را دو برابر کنیم",
    summary:
      "آب رسانی، تمرین های تنفسی و روتین کششی، ماندگاری اثر درمان را تقویت می کند.",
    tag: "مراقبت پس از درمان",
  },
];

const comments = [
  {
    name: "مریم ناصری",
    role: "کارمند محصول",
    quote: "برای اولین بار حس کردم کسی واقعا به بدنم گوش می دهد. نتیجه فوری بود.",
  },
  {
    name: "میلاد ترابی",
    role: "ورزشکار آماتور",
    quote: "دیپ تیشو دقیق و حرفه ای. درد شانه ام در دو جلسه کنترل شد.",
  },
  {
    name: "ترانه زمانی",
    role: "کارآفرین",
    quote: "فضا قدرتمند و لوکس است. انرژی بعد از جلسه فوق العاده بود.",
  },
];

export default function HomePage() {
  return (
    <div
      className="bg-[color:var(--surface)] text-[color:var(--brand)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -top-56 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,#f1cbaa,transparent_60%)] opacity-90"
          animate={{ scale: [1, 1.08, 1], opacity: [0.75, 0.95, 0.75] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-40 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,#89d0c2,transparent_65%)] opacity-80"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,#f2b9a1,transparent_70%)] opacity-45"
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-3 font-semibold tracking-wide">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand)] text-[color:var(--brand-foreground)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
              سرنیتی اسپا
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden items-center gap-2 text-[color:var(--muted-text)] md:flex">
              <MapPin className="h-4 w-4" />
              سن متئو، کالیفرنیا
            </span>
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="rounded-full border border-[color:var(--brand)] px-5 py-2 font-medium transition hover:-translate-y-0.5 hover:bg-[color:var(--brand)] hover:text-[color:var(--brand-foreground)]"
            >
              ورود مشتریان
            </Link>
          </div>
        </header>

        <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-muted)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--muted-text)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Bolt className="h-4 w-4" />
              استودیو ماساژ پرانرژی
            </motion.p>
            <motion.h1
              className="text-4xl leading-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              ماساژی که بدن را ریست می کند، نه فقط آرام می کند.
            </motion.h1>
            <motion.p
              className="mt-5 max-w-xl text-base text-[color:var(--muted-text)] sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              رویکرد ما تهاجمی و دقیق است؛ عضلات سخت، الگوهای غلط و خستگی مزمن
              را با تکنیک های بالینی و آرامش لوکس هدف می گیریم.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                href="/auth/login"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-[color:var(--brand-foreground)] transition hover:-translate-y-0.5"
              >
                رزرو فوری
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-[color:var(--brand)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand)] hover:text-[color:var(--brand-foreground)]"
              >
                لیست خدمات
              </a>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "جلسه تخصصی", value: "۴۵۰+" },
                { label: "درمان فعال", value: "۳۰" },
                { label: "بازگشت مشتری", value: "۸۴٪" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/80 px-4 py-4 shadow-sm backdrop-blur"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {item.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -inset-8 rounded-[36px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/40 blur-sm" />
            <div className="relative rounded-[36px] bg-[color:var(--brand)] p-8 text-[color:var(--brand-foreground)] shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">وضعیت امروز</p>
                <span className="rounded-full border border-white/30 px-3 py-1 text-xs">باز تا ۸ شب</span>
              </div>
              <h2
                className="mt-6 text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                شانه ها را آزاد کن، انرژی را برگردان.
              </h2>
              <p className="mt-4 text-sm text-white/70">
                تحلیل فشار، گرما درمانی و نقشه شخصی عضلات در هر جلسه.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  { icon: Calendar, text: "نوبت همان روز" },
                  { icon: Heart, text: "فشار سفارشی" },
                  { icon: Star, text: "مراقبت ۵ ستاره" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <item.icon className="h-5 w-5 text-[color:var(--accent-strong)]" />
                    <span className="text-sm text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <section id="services" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
              درمان های ویژه
            </p>
            <h2 className="mt-3 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              خدمات تهاجمی برای بدن های خسته.
            </h2>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--card)] px-5 py-2 text-sm font-semibold text-[color:var(--brand)] shadow-sm transition hover:-translate-y-0.5"
          >
            دیدن نوبت ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-muted)]">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--muted-text)]">{service.description}</p>
              <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
                <span>{service.duration}</span>
                <span className="rounded-full bg-[color:var(--brand)] px-3 py-1 text-[color:var(--brand-foreground)]">
                  رزرو
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-8 rounded-[40px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/80 p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">ریتم درمانی</p>
            <h2 className="mt-3 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              بدن شما برای ریکاوری عمیق طراحی شده است.
            </h2>
            <p className="mt-4 text-sm text-[color:var(--muted-text)]">
              پروتکل های ما تهاجمی اما ایمن هستند: ابتدا تشخیص، سپس بازسازی، و در
              پایان تثبیت نتیجه.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "ارزیابی وضعیت بدنی در ۵ دقیقه",
              "نقشه فشار اختصاصی بر اساس سطح درد",
              "برنامه مراقبت خانگی و پیگیری",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 p-5 shadow-sm"
              >
                <p className="text-sm text-[color:var(--muted-text)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-[color:var(--surface-muted)] bg-[color:var(--brand)] p-8 text-[color:var(--brand-foreground)] shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">نظر مشتریان</p>
            <h2 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              نتیجه های واقعی، نظرات صریح.
            </h2>
            <p className="mt-3 text-sm text-white/70">
              ما با بدن شما صادق هستیم؛ نتیجه هم همین را نشان می دهد.
            </p>
            <div className="mt-6 grid gap-3">
              {comments.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm text-white/80">&ldquo;{item.quote}&rdquo;</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">
                    {item.name} · {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            <div className="rounded-[32px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 p-7 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">مقاله های جدید</p>
              <h3 className="mt-3 text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                محتوای تخصصی برای بدن های پرتنش.
              </h3>
              <div className="mt-5 grid gap-4">
                {articles.map((article) => (
                  <div
                    key={article.title}
                    className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)]/80 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
                      {article.tag}
                    </p>
                    <p className="mt-2 text-base" style={{ fontFamily: "var(--font-display)" }}>
                      {article.title}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--muted-text)]">{article.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 p-7 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">رزرو سریع</p>
              <h3 className="mt-3 text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                انرژی تان را پس بگیرید.
              </h3>
              <p className="mt-3 text-sm text-[color:var(--muted-text)]">
                رزرو آنلاین با تاییدیه فوری و پیشنهاد درمانگر مناسب شما.
              </p>
              <Link
                href="/auth/login"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-[color:var(--brand-foreground)] transition hover:-translate-y-0.5"
              >
                رزرو کنید
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

        <footer className="border-t border-[color:var(--surface-muted)] bg-[color:var(--card)]/80">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
            <span>سرنیتی اسپا</span>
            <span>ماساژ درمانی و تندرستی</span>
            <span>صرفا با رزرو قبلی</span>
          </div>
        </footer>
    </div>
  );
}
