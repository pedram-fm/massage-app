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

  useEffect(() => {
    const theme = getPreferredTheme();
    const nextIsDark = theme === "dark";
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    onChange?.(nextIsDark);
  }, [onChange]);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");
    onChange?.(nextIsDark);
  };

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
