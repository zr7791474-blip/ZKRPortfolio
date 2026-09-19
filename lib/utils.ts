export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb: [number, number, number]): number {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

/** WCAG 2.x contrast ratio between two #rrggbb colors. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(parseHex(a));
  const lb = luminance(parseHex(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Per-project accent colors are chosen for identity (strokes, glows, fills),
 * and a few of them (burgundy, terracotta…) are too dark to read as TEXT on the
 * dark surfaces. This lightens such a color toward white — keeping its hue —
 * only as far as needed to reach `min` contrast against `background`.
 * Colors that already pass are returned unchanged.
 */
export function readableAccent(hex: string, background = "#1a1b21", min = 4.5): string {
  if (contrastRatio(hex, background) >= min) return hex;
  const base = parseHex(hex);
  for (let step = 1; step <= 20; step++) {
    const t = step * 0.05;
    const mixed = toHex([
      base[0] + (255 - base[0]) * t,
      base[1] + (255 - base[1]) * t,
      base[2] + (255 - base[2]) * t,
    ]);
    if (contrastRatio(mixed, background) >= min) return mixed;
  }
  return "#ffffff";
}
