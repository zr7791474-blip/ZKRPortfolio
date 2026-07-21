"use client";

import { motion, AnimatePresence } from "framer-motion";
import { nav } from "@/data/content";

export default function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
          exit={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1050] flex flex-col justify-center bg-bg px-8 md:hidden"
        >
          {nav.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="block py-[10px] font-serif text-[38px] text-text-dim"
            >
              {item.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
