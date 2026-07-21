"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function Counter({ target, className }: { target: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let raw = 0;
    const step = Math.max(1, target / 30);
    const id = setInterval(() => {
      raw += step;
      if (raw >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(Math.floor(raw));
      }
    }, 30);
    return () => clearInterval(id);
  }, [inView, target, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
