export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const heroStats = [
  { value: "4", suffix: "", label: "Featured Projects", isNumber: true },
  { value: "Full-Stack", suffix: "", label: "Frontend + Backend + Database", isNumber: false },
  { value: "Production-Ready", suffix: "", label: "Real auth, real data, real payments", isNumber: false },
  { value: "End-to-End", suffix: "", label: "From schema to shipped UI", isNumber: false },
] as const;

export const marqueeTech = [
  "NEXT.JS",
  "TYPESCRIPT",
  "REACT",
  "TAILWIND CSS",
  "PRISMA",
  "POSTGRESQL",
  "NEXTAUTH",
  "STRIPE",
  "FRAMER MOTION",
  "VITE",
  "ZUSTAND",
  "ZOD",
] as const;

export const skillGroups = [
  {
    title: "Frontend",
    items: [
      { name: "Next.js (14 & 16, App Router)", tag: "CORE" },
      { name: "React", tag: "CORE" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind CSS", tag: "STYLE" },
      { name: "Vite", tag: "TOOLING" },
      { name: "shadcn/ui", tag: "UI" },
    ],
  },
  {
    title: "Backend & Database",
    items: [
      { name: "Next.js API Routes / Server Actions", tag: "CORE" },
      { name: "Prisma ORM", tag: "DATA" },
      { name: "PostgreSQL / Neon", tag: "DATA" },
      { name: "NextAuth / Auth.js", tag: "AUTH" },
      { name: "Stripe", tag: "PAYMENTS" },
      { name: "Resend", tag: "EMAIL" },
    ],
  },
  {
    title: "Architecture & Motion",
    items: [
      { name: "Zustand", tag: "STATE" },
      { name: "React Hook Form + Zod", tag: "FORMS" },
      { name: "Framer Motion", tag: "MOTION" },
      { name: "CSS Design Tokens", tag: "SYSTEM" },
      { name: "Lucide React", tag: "ICONS" },
      { name: "ESLint", tag: "QUALITY" },
    ],
  },
] as const;

export const services = [
  {
    num: "01",
    title: "Full-Stack Web Development",
    description:
      "A complete site or app — frontend, backend, and database — built and shipped as one coherent product.",
  },
  {
    num: "02",
    title: "SaaS Dashboard Development",
    description:
      "Admin interfaces and internal tools with real component systems and design tokens, not one-off screens.",
  },
  {
    num: "03",
    title: "E-Commerce Development",
    description:
      "Storefronts with real carts, checkout, and admin analytics — commerce systems, not templated shops.",
  },
  {
    num: "04",
    title: "Business & Agency Websites",
    description:
      "Multi-page marketing sites with real content architecture, motion, and working forms.",
  },
  {
    num: "05",
    title: "Database & API Design",
    description:
      "Schema design, Prisma modeling, and API routes built to hold up under real usage and role-based access.",
  },
  {
    num: "06",
    title: "UI Implementation",
    description:
      "Turning a design or a rough idea into an accessible, responsive interface with intentional motion.",
  },
] as const;

export const processSteps = [
  {
    num: "01",
    title: "Discovery",
    description:
      "Understand the real problem, the users, and what \"done\" actually means before writing a line of code.",
  },
  {
    num: "02",
    title: "Planning",
    description:
      "Map the data model, the routes, and the technical decisions that will be expensive to reverse later.",
  },
  {
    num: "03",
    title: "Design",
    description:
      "Define the visual system — typography, spacing, motion — as a set of tokens, not one-off styling.",
  },
  {
    num: "04",
    title: "Development",
    description:
      "Build in vertical slices — a full feature end-to-end — so something real is testable early and often.",
  },
  {
    num: "05",
    title: "Testing",
    description:
      "Type checks, linting, and manual QA across breakpoints before anything is called finished.",
  },
  {
    num: "06",
    title: "Deployment",
    description:
      "Ship to production with real environment variables, real error handling, no placeholder states left in.",
  },
  {
    num: "07",
    title: "Iteration",
    description:
      "Ship, observe, and keep refining — a product is never really \"finished,\" just at its current version.",
  },
] as const;

export const loaderMessages = [
  "ZKR / System Initializing",
  "Loading Selected Work",
  "Preparing Portfolio",
  "Welcome to ZKR",
] as const;

export const loaderMeta = [
  "04 PROJECTS",
  "FULL-STACK DEVELOPMENT",
  "CASABLANCA, MOROCCO",
] as const;
