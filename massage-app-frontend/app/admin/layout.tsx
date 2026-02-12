"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ListTodo, FileText, Calendar, Settings, LogOut, Users, X, ChevronRight, ChevronLeft } from "lucide-react";
import { AdminOnly } from "@/components/auth/RoleGuard";
import { useAuth } from "@/hooks/auth/useAuth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import * as tokenManager from "@/lib/auth/tokenManager";
import { ROUTES } from "@/lib/navigation/routes";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      <div className="flex min-h-screen bg-[color:var(--surface)] overflow-x-hidden" dir="rtl">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed right-0 top-0 z-40 h-screen border-l border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6 transition-all duration-300 flex flex-col ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          } ${
            isCollapsed ? "md:w-20" : "md:w-64"
          } w-64`}
        >
          <div className="mb-8 flex items-center justify-between shrink-0">
            <Link
              href="/"
              className={`flex items-center gap-2 text-xl font-bold text-[color:var(--brand)] overflow-hidden transition-all ${
                isCollapsed ? "md:justify-center" : ""
              }`}
            >
              <Home className="h-6 w-6 shrink-0" />
              <span className={`${isCollapsed ? "md:hidden" : ""}`}>پنل مدیریت</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-[color:var(--muted-text)]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Collapse Toggle Button - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -left-3 top-20 z-50 items-center justify-center w-6 h-6 rounded-full bg-[color:var(--brand)] text-white shadow-lg hover:bg-[color:var(--brand)]/90 transition-colors"
            title={isCollapsed ? "باز کردن منو" : "بستن منو"}
          >
            {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[color:var(--brand)] text-[color:var(--brand-foreground)]"
                      : "text-[color:var(--muted-text)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand)]"
                  } ${
                    isCollapsed ? "md:justify-center" : ""
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={`${isCollapsed ? "md:hidden" : ""}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout - Bottom of Sidebar */}
          <div className="mt-auto pt-6 border-t border-[color:var(--surface-muted)] shrink-0 space-y-3">
            {/* User Avatar Display */}
            <div className={`flex items-center gap-3 ${ 
              isCollapsed ? "md:justify-center" : "justify-center"
            }`}>
              <div className="relative group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand)] to-purple-600 text-base font-bold text-white shadow-lg ring-2 ring-white dark:ring-gray-800 transition-all group-hover:scale-105">
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
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                tokenManager.clearAuth();
                window.location.href = ROUTES.LOGIN;
              }}
              title="خروج از حساب"
              className={`flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 border border-red-200 ${
                isCollapsed ? "md:justify-center" : "justify-center"
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className={`${isCollapsed ? "md:hidden" : ""}`}>خروج از حساب</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "md:mr-20" : "md:mr-64"
        }`}>
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </AdminOnly>
  );
}
