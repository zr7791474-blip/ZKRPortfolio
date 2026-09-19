import {
  siEslint,
  siFramer,
  siLucide,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siReacthookform,
  siResend,
  siShadcnui,
  siStripe,
  siTailwindcss,
  siTypescript,
  siVite,
  siZod,
  type SimpleIcon,
} from "simple-icons";
import { Boxes, KeyRound, Palette, type LucideIcon } from "lucide-react";
import type { SkillIconKey } from "@/data/content";

/**
 * Official brand marks come from `simple-icons` (CC0 data set) — nothing here
 * is redrawn or invented. Where that set has no mark for a technology
 * (Auth.js, Zustand) or the item is a concept rather than a product (design
 * tokens), a neutral lucide-react glyph is used instead of a made-up logo.
 */
const BRAND: Partial<Record<SkillIconKey, SimpleIcon>> = {
  nextjs: siNextdotjs,
  react: siReact,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  vite: siVite,
  shadcn: siShadcnui,
  prisma: siPrisma,
  postgresql: siPostgresql,
  stripe: siStripe,
  resend: siResend,
  reacthookform: siReacthookform,
  zod: siZod,
  framer: siFramer,
  lucide: siLucide,
  eslint: siEslint,
};

const GLYPH: Partial<Record<SkillIconKey, LucideIcon>> = {
  auth: KeyRound,
  zustand: Boxes,
  tokens: Palette,
};

/** Decorative — the visible label next to it carries the accessible name. */
export default function TechIcon({ name, className }: { name: SkillIconKey; className?: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className} fill="currentColor">
        <path d={brand.path} />
      </svg>
    );
  }
  const Glyph = GLYPH[name];
  if (Glyph) return <Glyph aria-hidden focusable="false" className={className} strokeWidth={1.5} />;
  return null;
}
