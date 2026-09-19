"use client";

import { motion } from "framer-motion";
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
 * `amount: "some"` (any pixel visible) rather than a fixed ratio: the
 * IntersectionObserver ratio is measured against the element's TOTAL height,
 * so a tall block (e.g. the ten-card project grid, ~5,400px on a phone) can
 * never reach a 25% threshold inside a ~700px viewport and would stay
 * invisible forever. A small negative bottom margin keeps the reveal from
 * firing the instant an element's first pixel peeks in.
 */
export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
