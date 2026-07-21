"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Renders /public/hero/background.jpg as a cinematic, parallaxing hero
 * visual with a grain overlay and a warm gradient wash. If that file isn't
 * present yet, onError swaps to the same ambient grid + glow treatment used
 * elsewhere on the site, so the hero never shows a broken image.
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
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div
          className="absolute left-1/2 top-[10%] h-[600px] w-[900px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse, rgba(205,160,90,0.12) 0%, transparent 65%)" }}
        />
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

      {/* warm cinematic wash + readability gradient, tuned to the ZKR palette */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/55 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-bg/60" />
      {/* guarantees text contrast in the lower zone (where the headline/CTAs/ticker live)
          without darkening the upper aurora — keeps the background beautiful but never
          competing with the copy */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-bg via-bg/55 to-transparent" />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(205,160,90,0.35), transparent 60%)" }}
      />

      {/* grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
