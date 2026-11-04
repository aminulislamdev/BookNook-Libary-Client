"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme", "style"],
  });

  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export default function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink shadow-sm transition hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className="hidden h-5 w-5 text-amber-500 dark:block"
      />
      <Moon
        aria-hidden="true"
        className="block h-5 w-5 text-brand dark:hidden"
      />
    </button>
  );
}
