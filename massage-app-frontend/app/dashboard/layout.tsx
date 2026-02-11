"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardModals } from "@/components/DashboardModals";
import { NewReservationModal } from "@/components/NewReservationModal";
import { CloudCompanion } from "@/components/CloudCompanion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "نمای کلی", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "جلسه‌های من", icon: Calendar },
  { href: "/dashboard/notes", label: "یادداشت درمانگر", icon: ClipboardList },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);
  const apiBaseUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    if (typeof window !== "undefined") {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:8000`;
    }
    return "http://localhost:8000";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return null;
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    const tokenType = localStorage.getItem("token_type") ?? "Bearer";

    try {
      if (token) {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `${tokenType} ${token}`, Accept: "application/json" },
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("auth_user");
      router.replace("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)]">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 lg:flex-row-reverse lg:px-6 lg:py-8">
        <main className="flex-1 rounded-[32px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 p-5 shadow-sm lg:p-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2">
              <Search className="h-4 w-4 text-[color:var(--muted-text)]" />
              <input
                type="text"
                placeholder="جستجو در داشبورد..."
                className="w-full bg-transparent text-sm text-[color:var(--brand)] placeholder:text-[color:var(--muted-text)] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setOpenReservation(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-2 text-xs font-semibold text-[color:var(--brand-foreground)] transition hover:-translate-y-0.5"
              >
                رزرو جدید
              </button>
              <button
                onClick={() => setOpenSettings(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-xs font-medium text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                تنظیمات
              </button>
              <button
                onClick={() => setOpenProfile(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-xs font-medium text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
              >
                <User className="h-4 w-4" />
                پروفایل
              </button>
            </div>
          </header>

          <nav className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-xs text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {children}
        </main>

        <aside className="hidden w-72 flex-shrink-0 rounded-[32px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 p-6 shadow-sm lg:block">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--brand)] text-[color:var(--brand-foreground)]">
              <Home className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-[color:var(--muted-text)]">پنل مشتری</p>
              <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                ماساژ اپ
              </p>
            </div>
          </div>

          <nav className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm text-[color:var(--muted-text)] transition hover:border-[color:var(--surface-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand)]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface-muted)]/60 p-4 text-sm">
            <p className="text-[color:var(--muted-text)]">دسترسی سریع</p>
            <div className="mt-3 grid gap-2">
              <button
                onClick={() => setOpenReservation(true)}
                className="w-full rounded-xl bg-[color:var(--brand)] py-2 text-center text-xs font-semibold text-[color:var(--brand-foreground)]"
              >
                رزرو جدید
              </button>
              <button className="w-full rounded-xl border border-[color:var(--surface-muted)] py-2 text-xs font-semibold text-[color:var(--brand)]">
                گزارش امروز
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--surface-muted)] py-2 text-xs font-semibold text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </aside>
      </div>

      <DashboardModals
        openProfile={openProfile}
        openSettings={openSettings}
        onCloseProfile={() => setOpenProfile(false)}
        onCloseSettings={() => setOpenSettings(false)}
      />

      <NewReservationModal open={openReservation} onClose={() => setOpenReservation(false)} />
      <CloudCompanion />
    </div>
  );
}
