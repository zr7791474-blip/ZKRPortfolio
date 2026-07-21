"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial glow that follows the pointer. Pure transform updates via
 * requestAnimationFrame — no React re-renders per mouse move, and it never
 * mounts on touch devices or when the user prefers reduced motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isTouch || !ref.current) return;

    function loop() {
      if (ref.current) {
        ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    }

    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] hidden h-[480px] w-[480px] rounded-full md:block"
      style={{
        background:
          "radial-gradient(circle, rgba(205,160,90,0.07) 0%, transparent 70%)",
      }}
    />
  );
}
