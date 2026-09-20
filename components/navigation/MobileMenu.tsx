"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { nav } from "@/data/content";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAnchorNav } from "@/lib/useAnchorNav";

const navKeyByHref: Record<string, string> = {
  "#work": "work",
  "#about": "about",
  "#experience": "experience",
  "#skills": "skills",
  "#services": "services",
  "#process": "process",
  "#contact": "contact",
};

export default function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { t } = useTranslation();
  const anchor = useAnchorNav();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
          exit={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1050] flex flex-col overflow-y-auto bg-bg px-8 pb-10 pt-24 xl:hidden [&>a:first-of-type]:mt-auto [&>a:last-of-type]:mb-auto"
          role="dialog"
          aria-modal="true"
          aria-label={t("mobileMenu.label")}
          // tapping the backdrop (any empty space in the drawer) closes it, same as picking a link
          onClick={onNavigate}
        >
          <motion.button
            type="button"
            aria-label={t("mobileMenu.close")}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-8 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors hover:border-accent hover:text-text active:scale-95"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {nav.map((item, i) => (
            <motion.a
              key={item.href}
              href={anchor.href(item.href)}
              onClick={(e) => {
                e.stopPropagation();
                anchor.onClick(e, item.href);
                onNavigate();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="block min-h-[44px] touch-manipulation py-2 font-serif text-[clamp(28px,9vw,38px)] leading-tight text-text-dim transition-colors active:text-text focus-visible:text-text focus-visible:outline-none"
            >
              {t(`nav.${navKeyByHref[item.href] ?? item.label.toLowerCase()}`)}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
