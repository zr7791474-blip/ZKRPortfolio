"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

const NODE_POINTS = [
  { x: 0, y: 30 },
  { x: 80, y: 10 },
  { x: 160, y: 50 },
  { x: 240, y: 30 },
  { x: 300, y: 30 },
];

/**
 * The signature visual language for the showcase: a schematic-style panel
 * with a numbered feature list and an animated "system trace" — a drawn
 * line with pulsing data nodes that keep gently breathing after the initial
 * reveal, tinted with the project's accent color, so it reads as a living
 * diagram rather than a static engineering drawing.
 */
export default function SchematicPanel({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-b from-surface to-surface-2 p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[40%] h-[80%] w-[60%]"
        style={{ background: `radial-gradient(circle, ${project.accent.soft}, transparent 70%)` }}
      />

      {/* animated, living schematic trace */}
      <svg
        aria-hidden
        viewBox="0 0 300 60"
        className="pointer-events-none absolute right-6 top-6 h-10 w-[180px] opacity-80"
      >
        <motion.path
          d="M0 30 H60 L80 10 H140 L160 50 H220 L240 30 H300"
          fill="none"
          stroke={project.accent.hex}
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {!reduceMotion &&
          NODE_POINTS.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.4}
              fill={project.accent.hex}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
            />
          ))}
        {!reduceMotion && (
          <motion.circle
            r={2.2}
            fill={project.accent.hex}
            style={{
              offsetPath: 'path("M0 30 H60 L80 10 H140 L160 50 H220 L240 30 H300")',
              offsetRotate: "0deg",
            }}
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: 1.6 }}
          />
        )}
      </svg>

      <div className="mb-[18px] flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[.12em] text-text-faint">
        <span>{project.architecture.panelLabel}</span>
        <span>{project.architecture.panelMeta}</span>
      </div>

      <ul className="flex flex-col">
        {project.features.map((feature, i) => (
          <li
            key={feature.title}
            className="flex items-start gap-[14px] border-t border-border py-[14px] text-sm text-text-dim first:border-t-0"
          >
            <span className="flex-shrink-0 pt-px font-mono text-[11px]" style={{ color: project.accent.hex }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <b className="font-medium text-text">{feature.title}</b> — {feature.description}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-[22px] flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-[18px] font-mono text-[10.5px] uppercase tracking-[.1em] text-text-faint">
        {project.architecture.layers.map((layer, i) => (
          <span key={layer} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: project.accent.hex }}>→</span>}
            {layer}
          </span>
        ))}
      </div>
    </div>
  );
}
