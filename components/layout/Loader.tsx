"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const reduceMotion = useReducedMotion();
  const { t, tList } = useTranslation();

  const loaderMessages = tList("loader.messages");
  const loaderMeta = [`10 ${t("loader.projects")}`, t("loader.discipline"), t("loader.location")];

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (reduceMotion) {
      setProgress(100);
      const t = setTimeout(finish, 150);
      return () => clearTimeout(t);
    }

    let raw = 0;
    const id = setInterval(() => {
      raw += Math.random() * 9 + 3;
      if (raw >= 100) {
        raw = 100;
        setProgress(100);
        clearInterval(id);
        setTimeout(finish, 220);
      } else {
        setProgress(raw);
      }
    }, 90);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    setDone(true);
    document.body.style.overflow = "";
  }

  const stage = Math.min(loaderMessages.length - 1, Math.floor(progress / 26));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[30px] bg-bg"
        >
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo size={80} wordmarkClassName="text-[15vw] md:text-[80px] gap-3" imageClassName="!rounded-2xl" />
          </motion.div>

          <div className="relative h-px w-[240px] overflow-hidden bg-border-strong">
            <div
              className="absolute left-0 top-0 h-full bg-accent transition-[width] duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[.12em] text-text-faint">
            <span>{loaderMessages[stage]}</span>
            <span className="text-accent">{Math.floor(progress)}%</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[9.5px] uppercase tracking-[.14em] text-text-faint/70">
            {loaderMeta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
