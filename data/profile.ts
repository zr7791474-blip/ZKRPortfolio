/**
 * Single source of truth for everything the ZKR assistant (and the
 * Experience section) is allowed to say about Zakaria.
 *
 * Every field here is derived from real content that already exists
 * elsewhere in this repo (lib/site.ts, data/content.ts, data/projects.ts,
 * lib/i18n/dictionaries.ts). Nothing is invented — if a fact isn't listed
 * here, the assistant is instructed to say it doesn't have that
 * information rather than guess.
 *
 * Keep this file in sync if the real facts above change.
 */

import { siteConfig } from "@/lib/site";
import { projects } from "./projects";

export type ExperienceHighlight = {
  num: string;
  title: string;
  description: string;
};

export const experience: ExperienceHighlight[] = [
  {
    num: "01",
    title: "Independent Full-Stack Developer",
    description:
      "Working under the name ZKR, based in Casablanca, Morocco — owning projects from the first line of code to production deployment.",
  },
  {
    num: "02",
    title: "Frontend, Backend & Database",
    description:
      "Every project on this site spans the full stack: the interface, the business logic behind it, and the data model underneath.",
  },
  {
    num: "03",
    title: "10 Shipped, Production-Ready Products",
    description:
      "Agency sites, an e-commerce platform, a SaaS dashboard, a real-estate marketplace, and more — each a complete system, not a mockup.",
  },
  {
    num: "04",
    title: "Open to New Projects",
    description: "Currently available for selected full-stack engagements — see the contact section to start a conversation.",
  },
];

/**
 * Same real technologies already listed in data/content.ts (skillGroups),
 * just organized into narrower categories for the assistant's structured
 * answers. This file does not change what's shown in the visible Skills
 * section — see data/content.ts for that.
 */
export const skillsByCategory = {
  frontend: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Vite", "shadcn/ui"],
  backend: ["Next.js API Routes / Server Actions", "NextAuth / Auth.js", "Stripe", "Resend"],
  database: ["Prisma ORM", "PostgreSQL / Neon"],
  tools: ["Zustand", "React Hook Form + Zod", "Framer Motion", "Lucide React", "ESLint"],
  other: ["CSS Design Tokens (design systems)"],
} as const;

export const profile = {
  name: "Zakaria Adli",
  alias: "ZKR",
  role: "Full-Stack Developer",
  location: siteConfig.location,
  availability: "Available for selected projects",
  bio: "Zakaria Adli, working under the name ZKR, is a full-stack developer based in Casablanca, Morocco. His work spans the full stack of a real product — frontend interfaces, backend logic, and the database design everything else depends on — with a habit of designing the system first, then the interface on top of it.",
  experience,
  skills: skillsByCategory,
  /** No formal education is listed anywhere on this portfolio — left honest rather than invented. */
  education: null as string | null,
  currentlyWorkingOn:
    "Currently available for new full-stack projects — head to the contact section to start a conversation.",
  contact: {
    email: siteConfig.email,
    github: siteConfig.githubUrl,
    x: siteConfig.xUrl,
    instagram: siteConfig.instagramUrl,
    whatsapp: siteConfig.whatsappUrl,
    location: siteConfig.location,
  },
  projects: projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    technologies: p.technologies,
    liveUrl: p.liveUrl,
    repositoryUrl: p.repositoryUrl,
  })),
} as const;

export type Profile = typeof profile;
