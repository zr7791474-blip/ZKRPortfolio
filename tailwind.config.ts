import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0b",
        surface: "#131316",
        "surface-2": "#18181c",
        "surface-3": "#1e1e23",
        border: {
          DEFAULT: "rgba(242,241,236,0.09)",
          strong: "rgba(242,241,236,0.16)",
        },
        text: {
          DEFAULT: "#f2f1ec",
          dim: "#a7a5a0",
          faint: "#6f6d6a",
        },
        accent: {
          DEFAULT: "#cda05a",
          bright: "#e0b876",
          soft: "rgba(205,160,90,0.14)",
          line: "rgba(205,160,90,0.35)",
        },
        sage: "#7f9284",
        cream: "#e8e0d0",
        burgundy: { DEFAULT: "#7a2e35", soft: "rgba(122,46,53,0.16)" },
        dusty: { DEFAULT: "#7c93b3", soft: "rgba(124,147,179,0.16)" },
        pine: { DEFAULT: "#4a5d4e", soft: "rgba(74,93,78,0.18)" },
        clay: { DEFAULT: "#b98a63", soft: "rgba(185,138,99,0.16)" },
        // Atmospheric palette pulled from the hero image — used to give each
        // section its own mood instead of repeating flat black everywhere.
        obsidian: "#08090a",
        forest: { DEFAULT: "#16241c", soft: "rgba(31,51,37,0.35)" },
        aurora: { DEFAULT: "#8fae6a", soft: "rgba(143,174,106,0.16)", line: "rgba(143,174,106,0.35)" },
        midnight: "#0d1526",
        mist: "#8b9296",
        lavender: { DEFAULT: "#a99bc7", soft: "rgba(169,155,199,0.14)" },
        rose: { DEFAULT: "#c98a94", soft: "rgba(201,138,148,0.14)" },
        "cream-ink": "#211c14",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
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
          "0%": { boxShadow: "0 0 0 0 rgba(127,146,132,.45)" },
          "70%": { boxShadow: "0 0 0 8px rgba(127,146,132,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(127,146,132,0)" },
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
