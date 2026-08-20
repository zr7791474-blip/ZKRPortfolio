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
  /** Omit when no verified public repository exists — never fabricate one. */
  repositoryUrl?: string;
  /** Omit when no verified live deployment exists — never fabricate one. */
  liveUrl?: string;
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
  {
    slug: "coffy-network",
    index: "05",
    title: "Coffy°",
    category: "Café & brunch spot — bilingual marketing site",
    tagline: "Un Lieu Pour Brunch, Café et Matcha",
    statement: "A real café's menu and address, done properly online.",
    layoutVariant: "editorial",
    description:
      "A bilingual (FR/AR) marketing site for a real Casablanca café — a digital menu transcribed directly from the physical card, a brunch & crêpes program, and a map straight to the door on Rue Ramallah.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Google Maps Embed",
    ],
    features: [
      {
        title: "Home",
        description: "Full-bleed hero with real café photography and quick links into the menu.",
      },
      {
        title: "Menu",
        description: "13 drink families transcribed from the physical menu, hot/iced pricing in MAD.",
      },
      {
        title: "Café, Brunch & Crêpes",
        description: "Dedicated pages for the specialty coffee program and the brunch menu.",
      },
      {
        title: "Matcha",
        description: "A standalone section for the matcha drink line.",
      },
      {
        title: "Nous trouver",
        description: "Embedded map, address, hours, and contact for the Rue Ramallah 07 location.",
      },
      {
        title: "Bilingual",
        description: "FR / AR language toggle in the header, for a local Casablanca audience.",
      },
    ],
    liveUrl: "https://coffyhousee.netlify.app/",
    screenshots: [
      { src: "/projects/coffy-network/hero.JPG", alt: "Coffy° — Hero section", label: "Hero", isPlaceholder: false },
      { src: "/projects/coffy-network/menu.JPG", alt: "Coffy° — Menu", label: "Menu", isPlaceholder: false },
      { src: "/projects/coffy-network/brunch crepes.JPG", alt: "Coffy° — Brunch & Crêpes", label: "Brunch & Crêpes", isPlaceholder: false },
      { src: "/projects/coffy-network/nous trover.JPG", alt: "Coffy° — Find us / location", label: "Find Us", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/ (marketing routes)", "components/sections", "i18n (FR/AR)", "menu content data"],
      panelLabel: "SITE MAP",
      panelMeta: "6 ROUTES",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Give a real neighborhood café a site that answers the only three questions people actually have — what's on the menu, what does it cost, and where is it — without the usual template bloat.",
      },
      {
        heading: "Solution",
        body: "The full physical menu card was transcribed into structured content so pricing and descriptions stay accurate, with hot/iced variants handled as a single data shape instead of duplicated entries.",
      },
      {
        heading: "Architecture",
        body: "A small set of marketing routes share one layout; an FR/AR toggle swaps copy at the layer closest to the content instead of duplicating whole pages.",
      },
      {
        heading: "Details",
        body: "An embedded, pre-pinned map and one-tap directions link remove the friction of a first-time visitor finding Rue Ramallah 07 from a phone.",
      },
    ],
    accent: { hex: "#b3453a", soft: "rgba(179,69,58,0.16)", moodVia: "#241209" }, // terracotta + espresso — editorial
  },
  {
    slug: "zkr-coffee",
    index: "06",
    title: "ZKR Coffee",
    category: "Coffee brand concept site",
    tagline: "ZKRCoffee — Dekka",
    statement: "Premium coffee, presented like a product launch.",
    layoutVariant: "editorial",
    description:
      "A concept storefront for a premium coffee brand — a curated seven-drink collection, a farm-to-cup process timeline, and a dark, gold-accented visual language built to feel handcrafted rather than templated.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      {
        title: "Hero",
        description: "Today's special callout over a live espresso shot, with dual Order Now / Explore Menu CTAs.",
      },
      {
        title: "Collection",
        description: "Curated selection of 7 coffees with MAD pricing and a short tasting note per drink.",
      },
      {
        title: "Experience",
        description: "Fresh Beans, Barista Art, and Premium Machines — the standards behind the brand.",
      },
      {
        title: "About",
        description: "Brand story, sourcing philosophy, and single-origin bean details.",
      },
      {
        title: "Process",
        description: "A six-step \"Farm to Cup\" timeline from harvest through serving.",
      },
    ],
    liveUrl: "https://zkrcoffee.vercel.app/",
    screenshots: [
      { src: "/projects/zkr-coffee/hero.JPG", alt: "ZKR Coffee — Hero section", label: "Hero", isPlaceholder: false },
      { src: "/projects/zkr-coffee/collection.JPG", alt: "ZKR Coffee — Curated coffee collection", label: "Collection", isPlaceholder: false },
      { src: "/projects/zkr-coffee/experience.JPG", alt: "ZKR Coffee — The ZKRCoffee difference", label: "Experience", isPlaceholder: false },
      { src: "/projects/zkr-coffee/menu.JPG", alt: "ZKR Coffee — About / brand story", label: "About", isPlaceholder: false },
      { src: "/projects/zkr-coffee/process.JPG", alt: "ZKR Coffee — Farm to Cup process", label: "Process", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/ (marketing routes)", "components/sections", "components/ui", "content/collection data"],
      panelLabel: "SITE MAP",
      panelMeta: "8 ROUTES",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Show that a coffee brand's site can carry the same weight as its packaging — moody photography, considered type, and copy that reads like it was written by someone who roasts.",
      },
      {
        heading: "Solution",
        body: "A single dark, gold-accented palette runs through every section, with the today's-special hero card as the one bright, focal element on the page.",
      },
      {
        heading: "Architecture",
        body: "Collection items, process steps, and testimonials are all driven from typed content arrays, so the catalog can grow without touching layout components.",
      },
      {
        heading: "Details",
        body: "The Farm to Cup timeline mirrors the actual sourcing chain — farm, harvest, roasting, grinding, brewing, serving — rather than a generic \"our story\" block.",
      },
    ],
    accent: { hex: "#c99b4e", soft: "rgba(201,155,78,0.16)", moodVia: "#1c130a" }, // gold + roasted brown — editorial
  },
  {
    slug: "zkr-festival",
    index: "07",
    title: "ZKR Festival",
    category: "Event & ticketing landing page",
    tagline: "Experience the Future of Music",
    statement: "Three nights, one page, built to sell tickets.",
    layoutVariant: "editorial",
    description:
      "A high-energy landing page for a fictional three-day music festival — full lineup grid, gallery, and a persistent ticket CTA, designed around the same one-page-does-the-selling logic as a real event site.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      {
        title: "Hero",
        description: "Date, location, duration, lineup size, and format surfaced above the fold, with Buy Tickets and Watch Trailer CTAs.",
      },
      {
        title: "Lineup",
        description: "40+ artist cards with genre tags, stage, and day, in a responsive grid.",
      },
      {
        title: "Experience",
        description: "Section walking through what a festival day actually feels like on-site.",
      },
      {
        title: "Gallery",
        description: "Photo wall of crowd, stage, and lighting shots for social proof.",
      },
      {
        title: "Tickets & Schedule",
        description: "Persistent header CTA and a dedicated schedule/tickets flow.",
      },
    ],
    liveUrl: "https://zkrfestival.vercel.app/",
    screenshots: [
      { src: "/projects/zkr-festival/hero.JPG", alt: "ZKR Festival — Hero section", label: "Hero", isPlaceholder: false },
      { src: "/projects/zkr-festival/lineup.JPG", alt: "ZKR Festival — Artist lineup", label: "Lineup", isPlaceholder: false },
      { src: "/projects/zkr-festival/experience.JPG", alt: "ZKR Festival — Experience section", label: "Experience", isPlaceholder: false },
      { src: "/projects/zkr-festival/gallery.JPG", alt: "ZKR Festival — Photo gallery", label: "Gallery", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/ (single-page sections)", "components/sections", "components/ui", "content/lineup data"],
      panelLabel: "SITE MAP",
      panelMeta: "7 SECTIONS",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Build the kind of one-page event site that has to convert a scroll into a ticket purchase — pace, hierarchy, and CTA placement all had to earn their spot.",
      },
      {
        heading: "Solution",
        body: "A dark, neon-lit palette and heavy type set the tone immediately, while a compact stats bar in the hero answers the five questions a buyer has before they scroll further.",
      },
      {
        heading: "Architecture",
        body: "The lineup grid renders from a typed artist array (name, genre, stage, day), so swapping a real bill in means editing data, not markup.",
      },
      {
        heading: "Details",
        body: "The ticket CTA stays pinned in the header across every section, keeping the primary action one tap away regardless of scroll depth.",
      },
    ],
    accent: { hex: "#c2469e", soft: "rgba(194,70,158,0.16)", moodVia: "#1c1030" }, // magenta + deep violet — editorial
  },
  {
    slug: "zkr-taskflow",
    index: "08",
    title: "ZKR TaskFlow",
    category: "Project & task management SaaS",
    tagline: "Manage Your Projects With Precision",
    statement: "A dashboard that treats project data as real data.",
    layoutVariant: "technical",
    description:
      "A project-management dashboard with an analytics overview, a drag-and-drop kanban board, and a project list — the core screens of a real TaskFlow-style SaaS product.",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Recharts",
    ],
    features: [
      {
        title: "Auth",
        description: "Sign in / sign up flow with a demo account for quick evaluation.",
      },
      {
        title: "Dashboard",
        description: "Stat cards for projects, active tasks, hours logged, and team size, plus a productivity chart.",
      },
      {
        title: "Kanban Board",
        description: "Drag-and-drop task columns — To Do, In Progress, In Review, Completed — with tags and assignees.",
      },
      {
        title: "Projects",
        description: "Sortable project table with status, progress bars, task counts, and team avatars.",
      },
      {
        title: "Recent Activity",
        description: "Live feed of task completions, team joins, and upcoming deadlines.",
      },
    ],
    screenshots: [
      { src: "/projects/zkr-taskflow/index.PNG", alt: "ZKR TaskFlow — Sign in", label: "Sign In", isPlaceholder: false },
      { src: "/projects/zkr-taskflow/dashboard.PNG", alt: "ZKR TaskFlow — Dashboard", label: "Dashboard", isPlaceholder: false },
      { src: "/projects/zkr-taskflow/kanban.PNG", alt: "ZKR TaskFlow — Kanban board", label: "Kanban Board", isPlaceholder: false },
      { src: "/projects/zkr-taskflow/projects.PNG", alt: "ZKR TaskFlow — Projects list", label: "Projects", isPlaceholder: false },
    ],
    architecture: {
      layers: ["src/pages", "src/components (kanban, charts, tables)", "src/context + hooks", "src/styles/tokens.css"],
      panelLabel: "MAIN PAGES",
      panelMeta: "4 SCREENS",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Build the four screens that make or break a task-management tool — dashboard, board, project list, auth — with real interaction, not static mockups.",
      },
      {
        heading: "Solution",
        body: "The kanban board uses native drag-and-drop between typed column states, so moving a card actually mutates the task's status rather than just its position.",
      },
      {
        heading: "Architecture",
        body: "A shared sidebar/topbar shell wraps every authenticated screen, with page components kept thin and stat/chart/board logic isolated in their own components.",
      },
      {
        heading: "Current status",
        body: "Frontend-complete on mock data; a persistence layer and real multi-user collaboration are the next milestones, not claimed as shipped.",
      },
    ],
    accent: { hex: "#6366f1", soft: "rgba(99,102,241,0.16)", moodVia: "#0e1024" }, // indigo + midnight — technical
  },
  {
    slug: "zkr-verano",
    index: "09",
    title: "ZKR Verano",
    category: "Personal archive — editorial media journal",
    tagline: "A Personal Archive of Summer",
    statement: "The things I watched, listened to, and wanted to remember.",
    layoutVariant: "editorial",
    description:
      "A personal, editorial-style archive site — full-bleed video/photo hero, an anime log, a music playlist, and a gallery — built as a slow, typographic scrapbook rather than a portfolio.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      {
        title: "Home",
        description: "Full-bleed ambient video hero with a numbered side nav into each section.",
      },
      {
        title: "Anime",
        description: "A watched-list with cover art, genre, year, and status per title.",
      },
      {
        title: "Music",
        description: "A running playlist log with track, artist, and genre tags, and a now-playing panel.",
      },
      {
        title: "Gallery & Favorites",
        description: "A visual scrapbook of saved images alongside a shorter, curated favorites list.",
      },
      {
        title: "About",
        description: "A single large editorial statement explaining the site's purpose as a personal archive.",
      },
    ],
    liveUrl: "https://zkrverano.vercel.app/",
    screenshots: [
      { src: "/projects/zkr-verano/hero.JPG", alt: "ZKR Verano — Hero section", label: "Hero", isPlaceholder: false },
      { src: "/projects/zkr-verano/anime.JPG", alt: "ZKR Verano — Anime log", label: "Anime", isPlaceholder: false },
      { src: "/projects/zkr-verano/music.JPG", alt: "ZKR Verano — Music playlist", label: "Music", isPlaceholder: false },
      { src: "/projects/zkr-verano/about.JPG", alt: "ZKR Verano — About statement", label: "About", isPlaceholder: false },
    ],
    architecture: {
      layers: ["app/ (single-page sections)", "components/sections", "components/ui", "content/log data"],
      panelLabel: "SITE MAP",
      panelMeta: "6 SECTIONS",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Build a personal site that reads like a kept journal, not a resume — slow pacing, large serif type, and content that's allowed to just be a list of things enjoyed.",
      },
      {
        heading: "Solution",
        body: "A single ambient hero sets the tone, then each section (anime, music, gallery) reuses the same numbered, editorial list pattern so the whole site feels like one continuous archive.",
      },
      {
        heading: "Architecture",
        body: "Anime and music entries are driven from typed log arrays, so new entries are appended to data rather than hand-built as new markup each time.",
      },
      {
        heading: "Details",
        body: "The About section is a single oversized statement rather than a bio, treating the \"why\" of the archive as the most important line on the page.",
      },
    ],
    accent: { hex: "#2fb7c9", soft: "rgba(47,183,201,0.16)", moodVia: "#08161c" }, // ocean teal + midnight — editorial
  },
  {
    slug: "fleurs-alliance",
    index: "10",
    title: "Fleurs Alliance",
    category: "Florist — catalogue & delivery site",
    tagline: "Des Fleurs Composées Avec Soin, Livrées à Casablanca",
    statement: "A neighborhood florist's catalogue, ordering, and delivery, in one place.",
    layoutVariant: "commerce",
    description:
      "A bilingual (FR/AR) storefront for Lorist by Fleurs Alliance, a Casablanca florist — a browsable catalogue of natural, artificial, and dried flower arrangements, an address-based delivery estimate, and WhatsApp-first ordering.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      {
        title: "Home",
        description: "Full-bleed hero with the current arrangement, a Natural / Artificial / Dried filter, and a live delivery-fee callout.",
      },
      {
        title: "Catalogue",
        description: "Full product catalogue organized by category (Bouquet, Box Fleurs, Plantes, Compositions Séchées) with pricing.",
      },
      {
        title: "Ordering",
        description: "WhatsApp-first ordering flow, so a customer can go from browsing to a real conversation in one tap.",
      },
      {
        title: "Delivery estimate",
        description: "Neighborhood-based address picker that surfaces an estimated delivery time before checkout.",
      },
      {
        title: "L'atelier / Find us",
        description: "Workshop gallery, trust stats (average rating, category count), and the Gauthier workshop address and hours.",
      },
      {
        title: "Bilingual",
        description: "FR / AR language toggle in the header, for a local Casablanca audience.",
      },
    ],
    liveUrl: "https://fleurs-alliance.netlify.app/",
    screenshots: [
      {
        src: "/projects/fleurs-alliance/hero.jpg",
        alt: "Fleurs Alliance — placeholder cover, see the live site for real screens",
        label: "Hero",
        isPlaceholder: true,
      },
    ],
    architecture: {
      layers: ["app/ (marketing + catalogue routes)", "components/sections", "i18n (FR/AR)", "catalogue content data"],
      panelLabel: "SITE MAP",
      panelMeta: "5 ROUTES",
    },
    caseStudy: [
      {
        heading: "Objective",
        body: "Give a real Casablanca florist a WhatsApp-first storefront — a catalogue people can actually browse and an ordering path that doesn't force a phone call to get a price.",
      },
      {
        heading: "Solution",
        body: "Catalogue items are grouped into the same categories the workshop already sells by (bouquets, box arrangements, plants, dried compositions), so the site maps onto how staff actually work, not a generic e-commerce taxonomy.",
      },
      {
        heading: "Architecture",
        body: "A shared marketing shell carries the home page and catalogue routes, with an FR/AR toggle swapping copy at the content layer instead of duplicating pages.",
      },
      {
        heading: "Details",
        body: "An address-based delivery estimate sits right in the hero, answering the one question — \"can I get this delivered, and roughly when\" — before a visitor has to scroll.",
      },
    ],
    accent: { hex: "#c76b83", soft: "rgba(199,107,131,0.16)", moodVia: "#1c0f14" }, // rose + deep plum — commerce
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
