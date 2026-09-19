"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every framer-motion animation on the site honour the visitor's
 * `prefers-reduced-motion` setting: transform / layout animations (Reveal's
 * slide-up, hover nudges, the menu's clip-path reveal) are disabled, while
 * plain opacity changes are kept so content still fades in gracefully.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
