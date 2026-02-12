"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ListTodo, FileText, Calendar, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/todos", label: "تسک‌ها", icon: ListTodo },
    { href: "/admin/logs", label: "لاگ‌ها", icon: FileText },
    { href: "/admin/appointments", label: "رزروها", icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen bg-[color:var(--surface)]" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-64 border-l border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[color:var(--brand)]"
          >
            <Home className="h-6 w-6" />
            پنل مدیریت
          </Link>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[color:var(--brand)] text-[color:var(--brand-foreground)]"
                    : "text-[color:var(--muted-text)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 right-6 left-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[color:var(--muted-text)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand)]"
          >
            <LogOut className="h-5 w-5" />
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64 flex-1 p-6">{children}</main>
    </div>
  );
}
