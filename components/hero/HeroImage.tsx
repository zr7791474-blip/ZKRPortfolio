"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Renders /public/hero/background.jpg as a cinematic, parallaxing hero
 * visual behind a page-colour readability wash. If that file isn't present
 * yet, onError swaps to the plain blueprint grid, so the hero never shows a
 * broken image.
 */
export default function HeroImage() {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.05, 1.2]);

  if (failed) {
    return (
      <div className="absolute inset-0" aria-hidden>
        <div className="bg-grid absolute inset-0 opacity-70" />
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/hero/background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          onError={() => setFailed(true)}
        />
      </motion.div>

      {/* readability wash in the page colour — the photo stays a quiet backdrop in both themes */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/70 to-bg" />
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-bg via-bg/60 to-transparent" />
    </div>
  );
}
