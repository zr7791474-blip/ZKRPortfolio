"use client";

import { useRef, type MouseEvent, type ReactNode, type ElementType } from "react";
import { useReducedMotion } from "framer-motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  strength?: number;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Read by CustomCursor to show a contextual label ("VIEW", "OPEN", ...) on hover. */
  "data-cursor"?: string;
};

/**
 * Wraps interactive elements (buttons, links) with a subtle magnetic pull
 * toward the cursor. Uses transform only (no layout thrash) and is a no-op
 * under prefers-reduced-motion.
 */
export default function Magnetic({
  children,
  className,
  as: Tag = "div",
  strength = 0.22,
  href,
  target,
  rel,
  onClick,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  function handleMove(e: React.MouseEvent) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * (strength * 1.3)}px)`;
  }

  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "";
  }

  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: "transform .25s cubic-bezier(.16,1,.3,1)" }}
      {...rest}
    >
      {children}
    </Component>
  );
}
