"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "theme";

function getPreferredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle({
  onChange,
  className,
}: {
  onChange?: (isDark: boolean) => void;
  className?: string;
}) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration fix: only read from localStorage after mounting
  useEffect(() => {
    setMounted(true);
    setIsDark(getPreferredTheme() === "dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    onChange?.(isDark);
  }, [isDark, onChange, mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return;
      setIsDark(event.matches);
    };

    media.addEventListener("change", handleMediaChange);
    return () => media.removeEventListener("change", handleMediaChange);
  }, [mounted]);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
  };

  // Prevent hydration mismatch by showing placeholder until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={
          className ??
          "inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-xs font-medium transition hover:-translate-y-0.5 opacity-50"
        }
        aria-label="Loading theme"
      >
        <div className="h-4 w-4" />
        <span>...</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-xs font-medium transition hover:-translate-y-0.5"
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? "روشن" : "تاریک"}</span>
    </button>
  );
}
