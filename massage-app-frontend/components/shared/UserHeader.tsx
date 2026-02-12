"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { LogOut, User, ChevronDown, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function UserHeader() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-4 py-2 transition-colors hover:bg-[color:var(--surface-muted)]"
      >
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand)] text-white">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`${user.f_name} ${user.l_name}`}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </div>

        {/* User Info */}
        <div className="text-right">
          <div className="text-sm font-medium">
            {user.f_name} {user.l_name}
          </div>
          <div className="text-xs text-[color:var(--muted-text)]">
            {user.role?.display_name || "کاربر"}
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-[color:var(--muted-text)] transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--card)] shadow-lg">
          <div className="p-4 border-b border-[color:var(--surface-muted)]">
            <div className="font-medium">
              {user.f_name} {user.l_name}
            </div>
            {user.username && (
              <div className="text-sm text-[color:var(--muted-text)]">
                @{user.username}
              </div>
            )}
            {user.email && (
              <div className="text-xs text-[color:var(--muted-text)] mt-1">
                {user.email}
              </div>
            )}
            {user.phone && (
              <div className="text-xs text-[color:var(--muted-text)]">
                {user.phone}
              </div>
            )}
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-[color:var(--brand)] bg-opacity-10 px-2 py-1 text-xs font-medium text-[color:var(--brand)]">
                {user.role?.display_name}
              </span>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-[color:var(--surface-muted)]"
            >
              <Settings className="h-4 w-4" />
              تنظیمات حساب
            </Link>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
