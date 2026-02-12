"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ListTodo, FileText, Calendar, Settings, LogOut, Users, X } from "lucide-react";
import { AdminOnly } from "@/components/auth/RoleGuard";
import { useAuth } from "@/hooks/auth/useAuth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/admin/users", label: "مدیریت کاربران", icon: Users },
    { href: "/admin/todos", label: "تسک‌ها", icon: ListTodo },
    { href: "/admin/logs", label: "لاگ‌ها", icon: FileText },
    { href: "/admin/appointments", label: "رزروها", icon: Calendar },
  ];

  return (
    <AdminOnly>
      <div className="flex min-h-screen bg-[color:var(--surface)]" dir="rtl">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed right-0 top-0 z-40 h-screen w-64 border-l border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6 transition-transform duration-300 flex flex-col ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }`}
        >
          <div className="mb-8 flex items-center justify-between shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-[color:var(--brand)]"
            >
              <Home className="h-6 w-6" />
              پنل مدیریت
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-[color:var(--muted-text)]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
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

          {/* User Profile Card & Logout - Bottom of Sidebar */}
          <div className="mt-auto space-y-3 pt-6 border-t border-[color:var(--surface-muted)] shrink-0">
            {/* User Profile Card */}
            <div className="rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand)] to-purple-600 text-sm font-bold text-white shrink-0">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={`${user?.f_name} ${user?.l_name}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.f_name?.[0]}
                      {user?.l_name?.[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {user?.f_name} {user?.l_name}
                  </div>
                  <div className="text-xs text-[color:var(--muted-text)] truncate">
                    {user?.email || user?.phone}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-[color:var(--brand)] bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-[color:var(--brand)]">
                  {user?.role?.display_name}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
                localStorage.removeItem("token_type");
                window.location.href = "/auth/login";
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 border border-red-200"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 md:mr-64">
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </AdminOnly>
  );
}
