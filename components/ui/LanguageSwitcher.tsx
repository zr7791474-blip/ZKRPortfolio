"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const LOCALE_CODE: Record<Locale, string> = { en: "EN", fr: "FR", es: "ES" };
const LOCALE_NAME: Record<Locale, string> = { en: "English", fr: "Français", es: "Español" };

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.label")}
        className={cn(
          "flex items-center gap-[6px] rounded-full border border-border-strong text-text-dim transition-colors hover:border-accent hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          compact ? "h-11 px-3.5 text-[12px]" : "!px-[18px] !py-[11px] text-[13px]"
        )}
      >
        <Globe className={compact ? "h-[14px] w-[14px]" : "h-[15px] w-[15px]"} />
        <span className="font-mono uppercase tracking-[.06em]">{LOCALE_CODE[locale]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("language.label")}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-[1200] mt-2 w-[150px] overflow-hidden rounded-md border border-border bg-surface py-1 shadow-xl"
          >
            {locales.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === l}
                  onClick={() => {
                    setLocale(l);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex min-h-[44px] w-full items-center justify-between px-4 text-left text-[13px] text-text-dim transition-colors hover:bg-bg hover:text-text focus-visible:bg-bg focus-visible:text-text focus-visible:outline-none",
                    locale === l && "text-accent"
                  )}
                >
                  <span>{LOCALE_NAME[l]}</span>
                  <span className="font-mono text-[10px] uppercase text-text-faint">{LOCALE_CODE[l]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
