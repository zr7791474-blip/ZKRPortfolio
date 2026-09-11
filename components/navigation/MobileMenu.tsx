"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { nav } from "@/data/content";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const navKeyByHref: Record<string, string> = {
  "#work": "work",
  "#about": "about",
  "#skills": "skills",
  "#services": "services",
  "#process": "process",
  "#contact": "contact",
};

export default function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keep this a real modal for keyboard/screen-reader users: move focus in on
  // open, trap Tab within the dialog, close on Escape, and hand focus back
  // to the hamburger button that opened it.
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onNavigate();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.getElementById("mobile-menu-toggle")?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          id="mobile-menu"
          initial={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
          exit={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1050] flex flex-col justify-center bg-bg px-8 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("mobileMenu.title")}
          // tapping the backdrop (any empty space in the drawer) closes it, same as picking a link
          onClick={onNavigate}
        >
          <motion.button
            ref={closeButtonRef}
            type="button"
            aria-label={t("mobileMenu.close")}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-8 top-8 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors hover:border-accent hover:text-text active:scale-95"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {nav.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="block touch-manipulation py-[10px] font-serif text-[38px] text-text-dim transition-colors active:text-text"
            >
              {t(`nav.${navKeyByHref[item.href] ?? item.label.toLowerCase()}`)}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
