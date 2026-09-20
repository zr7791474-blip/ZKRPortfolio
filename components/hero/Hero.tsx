"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import HeroImage from "./HeroImage";
import HeroTicker from "./HeroTicker";
import { siteConfig } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 1.6 },
  },
};

const lineUp = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
};

const lineDown = {
  hidden: { y: "-90%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
};

const year = new Date().getFullYear();

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    sectionRef.current.style.setProperty("--hero-px", String(px));
    sectionRef.current.style.setProperty("--hero-py", String(py));
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-0 pt-[160px]"
      style={{ ["--hero-px" as string]: 0, ["--hero-py" as string]: 0 }}
    >
      <HeroImage />

      {/* technical coordinate frame — a ZKR signature motif, subtly reacts to the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-6 z-[2] hidden border border-border/60 md:block"
        style={{
          transform: reduceMotion
            ? undefined
            : "translate(calc(var(--hero-px) * 6px), calc(var(--hero-py) * 6px))",
        }}
      />
      <div
        className="pointer-events-none absolute left-9 top-[100px] z-[2] hidden flex-col gap-1 font-mono text-[10px] uppercase tracking-[.14em] text-text-faint md:flex"
        aria-hidden
      >
        <span>ZKR / 001</span>
        <span className="flex items-center gap-[6px]">
          <span className="relative flex h-[5px] w-[5px]">
            <span className="absolute inset-0 rounded-full bg-brand" />
            <span className="absolute inset-0 animate-ping rounded-full bg-brand motion-reduce:animate-none" />
          </span>
          SYS.STATUS — ACTIVE
        </span>
      </div>
      <div
        className="pointer-events-none absolute right-9 top-[100px] z-[2] hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[.14em] text-text-faint md:flex"
        aria-hidden
      >
        <span>34.02°N / 6.83°W</span>
        <span>{year}</span>
      </div>

      <div className="wrap relative z-[2]">
        <motion.h1 variants={container} initial="hidden" animate="show" className="leading-[0.95]">
          <span className="block overflow-hidden">
            <motion.span
              variants={lineUp}
              className="inline-block font-serif text-[clamp(38px,6.4vw,84px)] font-normal tracking-[-0.02em]"
            >
              BUILDING
            </motion.span>
          </span>
          <span className="-mt-[0.05em] block overflow-hidden">
            <motion.span
              variants={lineDown}
              className="inline-block font-serif text-[clamp(44px,8.4vw,112px)] font-semibold tracking-[-0.03em]"
            >
              DIGITAL
            </motion.span>
          </span>
          <span className="block overflow-hidden pl-[5vw]">
            <motion.span
              variants={lineUp}
              className="inline-block font-serif text-[clamp(38px,6.8vw,90px)] font-medium tracking-[-0.02em] text-accent"
            >
              SYSTEMS.
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 1.95 }}
          className="mt-6 flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[.1em] text-accent"
        >
          <span className="relative flex h-[6px] w-[6px]">
            <span className="absolute inset-0 rounded-full bg-brand" />
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-brand" />
          </span>
          {t("hero.availability")}
        </motion.div>

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 2.05 }}
            className="max-w-[460px] text-[16.5px] text-text-dim"
          >
            {t("hero.description", { location: siteConfig.location || "Morocco" })}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 2.15 }}
            className="flex flex-wrap gap-4"
          >
            <Magnetic as="a" href="#work" className="btn btn-primary" data-cursor="VIEW">
              {t("hero.ctaView")} <ArrowUpRight className="h-[15px] w-[15px]" />
            </Magnetic>
            <Magnetic
              as="a"
              href="#contact"
              className="btn border-accent-line text-accent-bright hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft"
              data-cursor="OPEN"
            >
              {t("hero.ctaStart")} <ArrowUpRight className="h-[15px] w-[15px]" />
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-[86px] left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-[10px] text-text-faint md:flex">
        <span className="font-mono text-[10px] tracking-[.1em]">{t("hero.scroll").toUpperCase()}</span>
        <span className="h-[38px] w-px animate-scroll-move bg-brand motion-reduce:animate-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[3]"
      >
        <HeroTicker />
      </motion.div>
    </section>
  );
}
