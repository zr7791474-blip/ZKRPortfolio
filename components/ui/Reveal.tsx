"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Fades + translates content into view once, when it enters the viewport.
 * `viewport={{ once: true }}` avoids re-triggering on every scroll pass,
 * which keeps this cheap even with many instances on the page.
 *
 * Every section on the site (About, Skills, Services, Process, Contact,
 * Projects) uses this one component for its scroll reveal, so respecting
 * prefers-reduced-motion here — by dropping the vertical slide and keeping
 * only the fade — covers the whole site from a single place.
 */
export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? 0 : y;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduceMotion ? 0.4 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
