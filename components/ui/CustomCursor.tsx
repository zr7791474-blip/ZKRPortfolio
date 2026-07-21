"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "3D Frozen Lake Pixel Cursor"
 *
 * Desktop-only custom cursor: a small pixel-art ice shard (built from a
 * single element's box-shadow — no images, no canvas, no dependencies)
 * with a subtle 3D tilt driven by pointer velocity, an icy glow, and a
 * faded/blurred "reflection" beneath it, like light on a frozen lake.
 *
 * Reads a `data-cursor="LABEL"` attribute off whatever's under the pointer
 * (same contract as before — Magnetic/ProjectCard/etc. already set this)
 * to show contextual labels like "VIEW" / "OPEN" / "EXPLORE" in the trailing
 * frost halo.
 *
 * Perf: everything is a direct style mutation inside a single rAF loop
 * (no React state per frame), and only `transform`, `opacity`, and `filter`
 * are animated — all compositor-friendly, so this stays cheap even though
 * the shard "sprite" itself is a fairly dense box-shadow list.
 */

const PIXEL = 3; // px per pixel-art "pixel"

// 7-wide x 7-tall diamond ice shard, banded top→bottom for a simple bevel:
// icy white-cyan highlight up top, mid blue through the middle, deep blue
// shadow at the base — reads as a faceted ice chip, not a flat circle.
const HIGHLIGHT = "#eaf8ff";
const MID = "#8fd3f0";
const DEEP = "#3f7ea8";
const GLINT = "#ffffff";

type Px = { x: number; y: number; color: string };

function buildDiamond(): Px[] {
  const rows: Array<{ y: number; span: [number, number]; color: string }> = [
    { y: -3, span: [0, 0], color: HIGHLIGHT },
    { y: -2, span: [-1, 1], color: HIGHLIGHT },
    { y: -1, span: [-2, 2], color: MID },
    { y: 0, span: [-3, 3], color: MID },
    { y: 1, span: [-2, 2], color: DEEP },
    { y: 2, span: [-1, 1], color: DEEP },
    { y: 3, span: [0, 0], color: DEEP },
  ];
  const px: Px[] = [];
  for (const row of rows) {
    for (let x = row.span[0]; x <= row.span[1]; x++) {
      px.push({ x, y: row.y, color: row.color });
    }
  }
  // single glint pixel — the "reflective" 3D highlight on the top-left facet
  px.push({ x: -1, y: -2, color: GLINT });
  return px;
}

function shadowString(pixels: Px[], size: number): string {
  return pixels
    .map((p) => `${p.x * size}px ${p.y * size}px 0 0 ${p.color}`)
    .join(", ");
}

const DIAMOND = buildDiamond();
const SHARD_SHADOW = shadowString(DIAMOND, PIXEL);
const SHARD_SPAN = 7 * PIXEL; // bounding box, used to offset the reflection

export default function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isTouch) return;
    setEnabled(true);

    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;
    let haloX = 0;
    let haloY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let raf: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor], a, button");
      const label = target?.getAttribute("data-cursor") ?? "";
      if (labelRef.current) labelRef.current.textContent = label;
      if (haloRef.current) {
        const isInteractive = !!target;
        const size = isInteractive ? (label ? 90 : 58) : 38;
        haloRef.current.style.width = `${size}px`;
        haloRef.current.style.height = `${size}px`;
        haloRef.current.style.opacity = isInteractive ? "1" : "0.55";
      }
    }

    function loop() {
      // velocity → subtle 3D tilt, springing back toward flat when idle
      const vx = mouseX - prevX;
      const vy = mouseY - prevY;
      prevX = mouseX;
      prevY = mouseY;
      const targetTiltY = Math.max(-14, Math.min(14, vx * 1.4));
      const targetTiltX = Math.max(-14, Math.min(14, -vy * 1.4));
      tiltX += (targetTiltX - tiltX) * 0.18;
      tiltY += (targetTiltY - tiltY) * 0.18;

      if (coreRef.current) {
        coreRef.current.style.transform =
          `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) ` +
          `perspective(240px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
      if (reflectionRef.current) {
        reflectionRef.current.style.transform =
          `translate(${mouseX}px, ${mouseY + SHARD_SPAN / 2 + 3}px) translate(-50%, -50%) scaleY(-1)`;
      }

      haloX += (mouseX - haloX) * 0.16;
      haloY += (mouseY - haloY) * 0.16;
      if (haloRef.current) {
        haloRef.current.style.left = `${haloX}px`;
        haloRef.current.style.top = `${haloY}px`;
      }

      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* frost halo — trailing, shows contextual VIEW/OPEN/EXPLORE label */}
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed z-[9997] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(143,211,240,0.45)] bg-[rgba(143,211,240,0.06)] backdrop-blur-[1px] transition-[width,height,opacity] duration-300 ease-out"
        style={{ boxShadow: "0 0 16px rgba(143,211,240,0.35), inset 0 0 10px rgba(234,248,255,0.15)" }}
      >
        <span ref={labelRef} className="font-mono text-[9px] tracking-[.1em] text-[#eaf8ff]" />
      </div>

      {/* reflection — faded, blurred mirror of the shard, like ice underfoot */}
      <div
        ref={reflectionRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9996] opacity-[0.22] blur-[1.5px]"
        style={{
          width: PIXEL,
          height: PIXEL,
          boxShadow: SHARD_SHADOW,
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      {/* core — the pixel-art ice shard itself, with a soft cyan glow */}
      <div
        ref={coreRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          width: PIXEL,
          height: PIXEL,
          boxShadow: SHARD_SHADOW,
          filter:
            "drop-shadow(0 0 3px rgba(234,248,255,0.9)) drop-shadow(0 0 9px rgba(143,211,240,0.55))",
        }}
      />
    </>
  );
}
