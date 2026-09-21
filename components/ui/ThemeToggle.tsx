"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "zkr-theme";
const THEME_COLOR: Record<Theme, string> = { light: "#F4FAE0", dark: "#0C273C" };

/** Applies a theme to <html> and to the browser-UI colour. Does not persist. */
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", THEME_COLOR[theme]);
    meta.removeAttribute("media"); // a manual choice overrides the OS-scheme media queries
  });
}

function readSaved(): Theme | null {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

/**
 * Light / dark switch. The initial theme is set before first paint by the inline script in
 * app/layout.tsx (saved choice → OS preference → light); this component only toggles it,
 * persists the explicit choice, follows the OS while nothing is saved, and syncs other tabs.
 *
 * Both icons are always rendered and swapped with CSS (`dark:` variant) so server and client
 * markup match and there is no icon flash.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current: Theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current);
    applyTheme(current); // re-sync the theme-color metas (the inline script can run before they exist)

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readSaved()) return; // an explicit choice wins over the OS
      const next: Theme = media.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        applyTheme(e.newValue);
        setTheme(e.newValue);
      }
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggle() {
    const next: Theme = (theme ?? "light") === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked (private mode) — the choice still applies for this visit */
    }
  }

  const label = theme === null ? t("theme.toggle") : theme === "dark" ? t("theme.toLight") : t("theme.toDark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-theme-toggle
      className={cn(
        "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors hover:border-accent hover:text-accent",
        className
      )}
    >
      <Moon aria-hidden className="h-[18px] w-[18px] dark:hidden" strokeWidth={1.75} />
      <Sun aria-hidden className="hidden h-[18px] w-[18px] dark:block" strokeWidth={1.75} />
    </button>
  );
}
