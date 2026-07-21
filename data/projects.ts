/**
 * Single source of truth for every project on the site.
 *
 * Everything here is verified against the real repositories — no invented
 * metrics, routes, or technologies. Update this file to change project
 * content anywhere on the site (showcase cards, case study panels, and the
 * /work/[slug] route all read from this array).
 *
 * To swap a placeholder for a real screenshot: drop the image into
 * /public/projects/<slug>/ and update the `screenshots` array below —
 * no component code needs to change.
 */

export type ProjectFeature = {
  title: string;
  description: string;
};

export type CaseStudySection = {
  heading: string;
  body: string;
};

export type ProjectAccent = {
  /** Tailwind-safe hex used for this project's schematic + highlights */
  hex: string;
  /** Soft translucent version for backgrounds/glows */
  soft: string;
  /** Secondary atmosphere tone blended into the section wash for a two-tone "color world" per project. */
  moodVia: string;
};

export type Screenshot = {
  /** Path relative to /public. Points at a placeholder until replaced. */
  src: string;
  alt: string;
  label: string;
  isPlaceholder: boolean;
};

export type Project = {
  slug: string;
  index: string; // "01" / "02" ...
  title: string;
  category: string;
  tagline: string;
  /** Short editorial statement shown large in the case-study hero. */
  statement: string;
  /** Drives the per-project art direction in ProjectCard. */
  layoutVariant: "editorial" | "commerce" | "technical" | "architectural";
  description: string;
  technologies: string[];
  features: ProjectFeature[];
  repositoryUrl: string;
  liveUrl: string;
  screenshots: Screenshot[];
  architecture: {
    layers: string[];
    panelLabel: string;
    panelMeta: string;
  };
  caseStudy: CaseStudySection[];
  accent: ProjectAccent;
};

export const projects: Project[] = [
  {
    slug: "zkr-company",
    index: "01",
    title: "ZKR Company",
    category: "Agency & marketing site",
    tagline: "Digital Solutions Studio",
    statement: "From brand presence to digital systems.",
    layoutVariant: "editorial",
    description:
      "A full multi-page redesign of the ZKR agency site — 11 real routes, editorial motion design, and a content-driven structure built for a studio that sells development services.",
    technologies: [
      "Next.js 16",
      "App Router",
      "TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
      "lucide-react",
    ],
    features: [
      {
        title: "Home",
        description:
          "Hero + condensed teasers for every section below, pricing, FAQ.",
      },
      {
        title: "Services",
        description: "All 9 services in depth, each with benefits and process.",
      },
      {
        title: "Work",
        description: "Portfolio with client-side category filtering.",
      },
      {
        title: "Process",
        description: "Full 7-stage project process.",
      },
      {
        title: "Technologies, About, Blog",
        description:
          "Stack grid by category, story/mission/timeline, and a 6-post insights grid.",
      },
      {
        title: "Contact, Careers, Legal",
        description:
          "Working contact API route, open roles, and privacy/terms pages.",
      },
    ],
    repositoryUrl: "https://github.com/zr7791474-blip/ZKRcompany",
    liveUrl: "https://zkrcompany.vercel.app",
    screenshots: [
      { src: "/projects/zkr-company/Hero.JPG", alt: "ZKR Company — Hero section", label: "Hero", isPlaceholder: false },
      { src: "/projects/zkr-company/About.JPG", alt: "ZKR Company — About section", label: "About", isPlaceholder: false },
      { src: "/projects/zkr-company/Process.JPG", alt: "ZKR Company — Process section", label: "Process", isPlaceholder: false },
      { src: "/projects/zkr-company/Projects.JPG", alt: "ZKR Company — Projects/portfolio section", label: "Projects", isPlaceholder: false },
      { src: "/projects/zkr-company/Contact.JPG", alt: "ZKR Company — Contact section", label: "Contact", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/layout.tsx (shared chrome)", "components/sections", "components/ui", "lib/content.ts"],
      panelLabel: "SITE MAP",
      panelMeta: "11 ROUTES",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Give a small development studio a marketing site that reads as a real product company, not a template — every nav link, footer link, and CTA points at a real page.",
      },
      {
        heading: "Solution",
        body: "Shared chrome (navbar, footer, loader, SEO) renders once in app/layout.tsx; per-route content is pulled from a single lib/content.ts file so copy stays consistent site-wide.",
      },
      {
        heading: "Architecture",
        body: "App Router with one folder per route, a components/sections layer reused between the homepage and sub-pages, and a components/ui layer for primitives like Container, Reveal, and MagneticButton.",
      },
      {
        heading: "Technical decisions",
        body: "Moved from Tailwind v4's native lightningcss binary to Tailwind v3 to remove a Windows-only install failure, keeping the CSS pipeline pure JS/PostCSS.",
      },
    ],
    accent: { hex: "#cda05a", soft: "rgba(205,160,90,0.16)", moodVia: "#16241c" }, // brass + forest — editorial
  },
  {
    slug: "zkr-ecommerce",
    index: "02",
    title: "ZKR Ecommerce",
    category: "Full-stack commerce platform",
    tagline: "Not Just a Storefront",
    statement: "Commerce that behaves like a real product.",
    layoutVariant: "commerce",
    description:
      "A production-ready e-commerce platform with a real database-backed cart and wishlist, working Stripe checkout, and an admin dashboard driven by genuine order data.",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Prisma",
      "PostgreSQL / Neon",
      "NextAuth",
      "Stripe",
      "Resend",
      "Zustand",
      "shadcn/ui",
    ],
    features: [
      {
        title: "Auth",
        description:
          "Credentials + Google + GitHub OAuth, 5-tier role-based access enforced in middleware and re-verified server-side.",
      },
      {
        title: "Shopping",
        description:
          "Debounced search with ⌘K, wishlist synced per user, compare up to 4 products, live flash-deal countdowns.",
      },
      {
        title: "Checkout",
        description:
          "Real Stripe Checkout session, guest cart gating, server-side auth re-check on the checkout API.",
      },
      {
        title: "Orders",
        description:
          "Public order tracking by order number + email, real status timeline (Placed → Paid → Processing → Shipped → Delivered).",
      },
      {
        title: "Admin",
        description:
          "Analytics computed from real Order/OrderItem data, month-over-month trends, product management with soft-delete.",
      },
    ],
    repositoryUrl: "https://github.com/zr7791474-blip/ZKR-Ecommerce",
    liveUrl: "https://zkr-ecommerce.vercel.app",
    screenshots: [
      { src: "/projects/zkr-ecommerce/Hero.JPG", alt: "ZKR Ecommerce — Hero section", label: "Hero", isPlaceholder: false },
      { src: "/projects/zkr-ecommerce/Featured Products.JPG", alt: "ZKR Ecommerce — Featured products", label: "Featured Products", isPlaceholder: false },
      { src: "/projects/zkr-ecommerce/Products.JPG", alt: "ZKR Ecommerce — Products listing", label: "Products", isPlaceholder: false },
      { src: "/projects/zkr-ecommerce/Blog.JPG", alt: "ZKR Ecommerce — Blog", label: "Blog", isPlaceholder: false },
      { src: "/projects/zkr-ecommerce/Login.JPG", alt: "ZKR Ecommerce — Login", label: "Login", isPlaceholder: false },
      { src: "/projects/zkr-ecommerce/Register.JPG", alt: "ZKR Ecommerce — Register", label: "Register", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/(public) storefront", "services/ (Prisma access)", "stores/ (Zustand)", "prisma/ schema"],
      panelLabel: "SYSTEM FEATURES",
      panelMeta: "DB-BACKED",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Ship a commerce platform where every visible feature is wired end-to-end — frontend to server action or API route to Prisma to PostgreSQL — instead of a UI shell over mock data.",
      },
      {
        heading: "Solution",
        body: "Route groups separate storefront, auth, admin, and account areas; a services/ layer holds every Prisma call so data access never leaks into components.",
      },
      {
        heading: "Architecture",
        body: "Zustand stores handle cart/wishlist/compare client state; React Hook Form + Zod validate every form; middleware enforces the five-role permission model on protected routes.",
      },
      {
        heading: "Honesty on scope",
        body: "Admin sections not yet built — categories, coupons, review moderation — show an explicit \"coming soon\" state rather than a fake table or a 404.",
      },
    ],
    accent: { hex: "#7a2e35", soft: "rgba(122,46,53,0.16)", moodVia: "#e8e0d0" }, // burgundy + cream — commerce
  },
  {
    slug: "zkr-eclipse",
    index: "03",
    title: "ZKR Eclipse",
    category: "Design-system-driven admin interface",
    tagline: "A Premium SaaS Dashboard",
    statement: "A system of tokens, not a page of styles.",
    layoutVariant: "technical",
    description:
      "A scalable dashboard platform with a token-based design system, a reusable component library, and workspace/project/order management views built on React + Vite.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "CSS Design Tokens",
      "React Context",
      "Custom Hooks",
    ],
    features: [
      {
        title: "Dashboard",
        description: "Analytics overview, statistics cards, interactive tables.",
      },
      {
        title: "Workspace",
        description: "Project organization, user & product management, orders.",
      },
      {
        title: "Component library",
        description: "Buttons, cards, modals, dropdowns, toasts, charts, forms.",
      },
      {
        title: "Reports & Live Preview",
        description: "Dedicated reporting and live-preview screens.",
      },
      {
        title: "AI Automation",
        description: "Interface scaffolded for future automated workflows.",
      },
    ],
    repositoryUrl: "https://github.com/zr7791474-blip/ZKR_Eclipse",
    liveUrl: "https://zkreclipse-seven.vercel.app/",
    screenshots: [
      { src: "/projects/zkr-eclipse/Home.JPG", alt: "ZKR Eclipse — Home", label: "Home", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/dashboard.JPG", alt: "ZKR Eclipse — Dashboard", label: "Dashboard", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/Workspace.JPG", alt: "ZKR Eclipse — Workspace", label: "Workspace", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/Projects.JPG", alt: "ZKR Eclipse — Projects", label: "Projects", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/Reports.JPG", alt: "ZKR Eclipse — Reports", label: "Reports", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/Features.JPG", alt: "ZKR Eclipse — Features", label: "Features", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/Live preview.JPG", alt: "ZKR Eclipse — Live preview", label: "Live Preview", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/AI automation.JPG", alt: "ZKR Eclipse — AI automation", label: "AI Automation", isPlaceholder: false },
      { src: "/projects/zkr-eclipse/login.JPG", alt: "ZKR Eclipse — Login", label: "Login", isPlaceholder: false },
    ],
    architecture: {
      layers: ["src/pages", "src/components (library)", "src/context + hooks", "src/styles/tokens.css"],
      panelLabel: "MAIN PAGES",
      panelMeta: "9 SCREENS",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Prove out a dashboard architecture that could plug into any SaaS product — consistent tokens and a real component system, not one-off styled screens.",
      },
      {
        heading: "Solution",
        body: "Design tokens (color, type, spacing, radius, shadow, motion) live in src/styles/tokens.css as CSS variables — updating a token updates every component that consumes it.",
      },
      {
        heading: "Architecture",
        body: "Context providers and custom hooks sit between the routing layer and the component library, keeping page components thin and the UI layer fully reusable.",
      },
      {
        heading: "Current status",
        body: "Frontend-complete on mock data; backend integration, real auth, and multi-tenant support are tracked as the next milestones, not claimed as shipped.",
      },
    ],
    accent: { hex: "#7c93b3", soft: "rgba(124,147,179,0.16)", moodVia: "#a99bc7" }, // dusty blue + lavender — technical
  },
  {
    slug: "zkr-estate",
    index: "04",
    title: "ZKR Estate",
    category: "Listings, agents, and appointments",
    tagline: "A Real-Estate Marketplace",
    statement: "Space, trust, and three kinds of users.",
    layoutVariant: "architectural",
    description:
      "A full-stack platform connecting property seekers with agents — search & filter, favorites, appointment booking, in-app messaging, and role-based dashboards.",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Auth.js",
      "Zustand",
      "React Hook Form",
      "Zod",
    ],
    features: [
      {
        title: "User",
        description: "Browse, save favorites, message agents, book appointments.",
      },
      {
        title: "Agent",
        description: "Manage property listings, view analytics.",
      },
      {
        title: "Admin",
        description: "Full system control across users and listings.",
      },
      {
        title: "Core models",
        description: "User, Property, Favorite, Message, Appointment.",
      },
      {
        title: "Auth",
        description:
          "Auth.js credentials login, protected routes via middleware, hashed passwords.",
      },
    ],
    repositoryUrl: "https://github.com/zr7791474-blip/ZKR-Estate",
    liveUrl: "https://zkr-estate-ten.vercel.app",
    screenshots: [
      { src: "/projects/zkr-estate/screen1.JPG", alt: "ZKR Estate — Screen 1", label: "Screen 1", isPlaceholder: false },
      { src: "/projects/zkr-estate/screen2.JPG", alt: "ZKR Estate — Screen 2", label: "Screen 2", isPlaceholder: false },
      { src: "/projects/zkr-estate/screen3.JPG", alt: "ZKR Estate — Screen 3", label: "Screen 3", isPlaceholder: false },
      { src: "/projects/zkr-estate/screen4.JPG", alt: "ZKR Estate — Screen 4", label: "Screen 4", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/ (App Router UI)", "actions/ (Server Actions)", "prisma/ + PostgreSQL", "middleware.ts (Auth.js)"],
      panelLabel: "ROLES & PERMISSIONS",
      panelMeta: "3 ROLES",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Model a real three-sided marketplace — seekers, agents, admins — with the access control and workflows that entails, not just a listings grid.",
      },
      {
        heading: "Solution",
        body: "A modular layer split — presentation (App Router UI), business logic (Server Actions & API routes), data (Prisma + PostgreSQL), and auth (Auth.js) — each with a clear boundary.",
      },
      {
        heading: "API surface",
        body: "Route handlers for /api/auth, /api/properties, /api/messages, /api/appointments, and /api/favorites.",
      },
      {
        heading: "Roadmap",
        body: "Email notifications, map-based search, and payment integration are tracked as future work, not presented as already live.",
      },
    ],
    accent: { hex: "#b98a63", soft: "rgba(185,138,99,0.16)", moodVia: "#4a5d4e" }, // clay + forest — architectural
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
