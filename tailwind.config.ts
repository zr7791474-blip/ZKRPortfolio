import type { Config } from "tailwindcss";

/** RGB-triplet CSS variable with Tailwind alpha support. */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All colours are CSS variables (RGB triplets) defined per theme in app/globals.css,
        // so Tailwind opacity modifiers (bg-bg/80, border-border/60 …) keep working and every
        // component adapts to light / dark without per-component overrides.
        bg: v("bg"),
        surface: v("surface"),
        "surface-2": v("surface-2"),
        "surface-3": v("surface-3"),
        border: { DEFAULT: v("border"), strong: v("border-strong") },
        text: { DEFAULT: v("text"), dim: v("text-dim"), faint: v("text-faint") },
        accent: {
          DEFAULT: v("accent"), // readable accent (text, links, small labels)
          bright: v("accent-bright"), // hover / emphasis
          soft: "rgb(var(--brand) / 0.14)",
          line: "rgb(var(--brand) / 0.45)",
        },
        brand: v("brand"), // #52B69A — decorative fills, dots, bars (never small text)
        danger: v("danger"),
      },
      // Like `transition-all` but WITHOUT outline properties, so keyboard focus rings appear instantly
      // instead of fading in over 300–500ms.
      transitionProperty: {
        ui: "color, background-color, border-color, opacity, transform, box-shadow",
      },
      fontFamily: {
        // Typefaces are CSS variables (defined in app/globals.css) so the whole site can switch
        // font in one place — see "Typography" in the README.
        serif: ["var(--font-display)"],
        sans: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        wrap: "1280px",
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(.16,1,.3,1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--brand) / .45)" },
          "70%": { boxShadow: "0 0 0 8px rgb(var(--brand) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--brand) / 0)" },
        },
        "wa-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        "scroll-move": {
          "0%": { opacity: "0", transform: "scaleY(0)" },
          "40%": { opacity: "1", transform: "scaleY(1)" },
          "60%": { transform: "scaleY(1)" },
          "100%": { opacity: "0", transform: "scaleY(0)" },
        },
      },
      animation: {
        marquee: "marquee 26s linear infinite",
        "pulse-dot": "pulse-dot 2s infinite",
        "wa-pulse": "wa-pulse 1.8s infinite",
        "scroll-move": "scroll-move 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
