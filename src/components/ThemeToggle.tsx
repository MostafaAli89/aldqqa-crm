"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md border border-border bg-card hover:bg-muted transition"
      aria-label={isDark ? "التبديل إلى وضع النهار" : "التبديل إلى وضع الليل"}
      title={isDark ? "النهار" : "الليل"}
    >
      {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
    </button>
  );
}


