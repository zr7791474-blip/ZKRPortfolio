# ZKR Portfolio — Next.js

Production Next.js (App Router) rebuild of the ZKR portfolio prototype. Same
visual identity, motion language, and content — proper component
architecture, TypeScript, and a data-driven project system underneath it.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · lucide-react

## Getting started

```bash
npm install
cp .env.example .env.local   # already pre-filled with the real contact details
npm run dev
```

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run build        # production build (also type-checks + lints)
npm run start         # serve the production build
```

## Project structure

```
app/
  layout.tsx            root layout: fonts, chrome (loader, nav, footer, dock)
  page.tsx               homepage — composes every section
  globals.css             Tailwind layers + the few things Tailwind can't express as config
  work/[slug]/page.tsx    dedicated, statically-generated case-study route per project
  api/contact/route.ts    contact form endpoint (see "Contact form" below)

components/
  layout/       Loader, Footer
  navigation/   NavigationRoot (shared scroll/menu state), Header, MobileMenu
  hero/         Hero, StatsBar
  about/        AboutSection
  projects/     ProjectsSection, ProjectCard, SchematicPanel (signature visual)
  case-studies/ CaseStudyContent, ScreenshotGallery — shared by the inline
                preview on the homepage AND the /work/[slug] route
  skills/       SkillsSection
  services/     ServicesSection
  process/      ProcessSection
  contact/      ContactSection, ContactTile, ContactForm, CopyEmailButton, FloatingDock
  ui/           Reveal, Magnetic, Counter, Marquee, CursorGlow, SectionHeading

data/
  projects.ts   single source of truth for all 4 projects — edit this file to
                 change any project content anywhere on the site
  content.ts    nav links, hero stats, skills, services, process steps, marquee

lib/
  site.ts       typed env-var accessor for contact details + mailto helper
  utils.ts      cn() class helper, email validation

public/projects/<slug>/   screenshot assets (see below)
```

## Updating project content

Everything shown for a project — title, description, tech badges, feature
list, schematic panel labels, case-study sections, links — comes from
`data/projects.ts`. No component needs to change to update copy, add a
feature, or fix a link.

## Brand assets (logo & hero image)

Two real assets are wired in but **not included** in this zip — drop them in and they activate automatically, no code changes needed:

| Asset | Path | Used in |
|---|---|---|
| ZKR logo | `public/zkr.jpg` | `components/ui/Logo.tsx` — nav, loader, footer, favicon |
| Hero background | `public/hero/background.jpg` | `components/hero/HeroImage.tsx` — cinematic hero visual |

Both components check for the file at runtime (`onError`) and fall back
gracefully if it's missing — `Logo` falls back to the "ZKR•" text wordmark,
`HeroImage` falls back to the ambient grid + glow treatment used elsewhere
on the site. Nothing breaks, no broken-image icons, no build failure —
you'll just see the fallback until the real files are added.

## Color rhythm

The site deliberately avoids "black background everywhere." Each section has
its own atmosphere, all still recognizably ZKR (dark, warm-accented,
technical), derived from tones present in the hero image:

- **Hero** — cinematic image + warm/aurora overlay
- **Projects** — each project gets a two-tone wash (`accent` + `moodVia` in `data/projects.ts`): brass+forest (Company), burgundy+cream (Ecommerce), dusty blue+lavender (Eclipse), clay+forest (Estate)
- **About** — a deliberate light "paper" moment: warm cream background, dark ink text, pine-green accent — the one section that isn't dark, by design, to prevent black fatigue
- **Skills** — deep midnight with an aurora-green ambient glow
- **Process** — a top-to-bottom gradient from forest → base → midnight, with a matching aurora→dusty-blue scroll-progress line
- **Contact** — obsidian with both a brass glow and an aurora glow, as the closing "climax" scene

All of these colors live in `tailwind.config.ts` under a clearly separated
"atmospheric palette" block, so the whole system is one file to retune.

## Signature interactions

- **Scroll progress** — a thin accent-colored bar across the very top of the viewport (`components/ui/ScrollProgress.tsx`), honest and functional, not decorative
- **Hero ticker** — a full-bleed, slow-moving info strip at the bottom of the hero (`components/hero/HeroTicker.tsx`), pauses on hover
- **Living schematic** — the system-diagram panel on every project has breathing nodes plus a small dot that continuously travels the trace line (`offset-path`, degrades gracefully to a static line on browsers without support)
- **Mouse-reactive hero frame** — the technical coordinate frame around the hero shifts a few pixels with the cursor (disabled under `prefers-reduced-motion`)

## Custom cursor

Desktop only (disabled on touch devices and under `prefers-reduced-motion`):
a small dot + trailing ring that shows a contextual label ("VIEW", "OPEN",
"EXPLORE") when hovering elements with a `data-cursor="..."` attribute —
already set on the hero CTAs, project links, and screenshot thumbnails in
`components/projects/ProjectCard.tsx` and `components/hero/Hero.tsx`. Add
the attribute to any new interactive element to give it a label.

## Screenshots (placeholder system)

Real screenshots were **not** fabricated. Each project ships with 3 generated
placeholder SVGs (dark, on-brand, clearly labeled "SCREENSHOT PLACEHOLDER")
so the layout — including the project cover image, the schematic panel, and
the lightbox gallery on the case-study route — is fully in place without
pretending to show a UI that wasn't verified.

To swap in a real screenshot:

1. Drop the image into `public/projects/<slug>/` (e.g. `public/projects/zkr-ecommerce/storefront.png`).
2. Update that shot's entry in that project's `screenshots` array in `data/projects.ts`:
   ```ts
   { src: "/projects/zkr-ecommerce/storefront.png", alt: "...", label: "Storefront", isPlaceholder: false },
   ```

That's it — the project cover image, the gallery grid, and the lightbox all
update automatically, and the "Placeholder" caption disappears once
`isPlaceholder` is `false`. Click any screenshot on a `/work/[slug]` page to
open it in the fullscreen lightbox.

## Contact form

`components/contact/ContactSection.tsx` is a two-column layout: left is
positioning/availability/direct email/socials (`lg:sticky` so it stays in
view while the form scrolls), right is the form — stacked to one column
below `lg` (tablet and mobile both get the simpler stacked layout).

Project Type options: Website, E-commerce, SaaS / Web Application, Custom
Software, API / Backend System, Other.
Budget options (optional): Not sure yet, Under $1,000, $1,000–$3,000,
$3,000–$10,000, $10,000+.

The form validates client-side, shows a loading state, and **never fakes a
successful submission**. It posts to `app/api/contact/route.ts`, which tries,
in order:

1. **Resend** (real email delivery), if `RESEND_API_KEY` is set — this is
   what actually puts the message in your inbox.
2. **A generic webhook** (Formspree, your own backend, etc.), if
   `CONTACT_FORM_ENDPOINT` is set instead.
3. **Neither configured** → responds with `{ fallback: "mailto" }`, and the
   client opens a pre-filled `mailto:` link so the visitor can send it
   themselves — the form is never a dead end, but this step requires the
   *visitor* to hit send in their own mail app; it does not land in your
   inbox automatically.

**To make submissions actually arrive in your email** (step 1):

1. Sign up free at [resend.com](https://resend.com) → API Keys → create one.
2. In `.env.local`, set `RESEND_API_KEY=re_...`.
3. Set `CONTACT_TO_EMAIL` (or just rely on `NEXT_PUBLIC_CONTACT_EMAIL`, already set).
4. For real production sending you'll eventually want to verify your own
   domain in Resend and set `RESEND_FROM_EMAIL="ZKR <contact@yourdomain.com>"` —
   but Resend's shared `onboarding@resend.dev` sender works immediately for
   testing, no domain setup required.
5. Redeploy (or restart `next dev`) after adding the env var.

Each email arrives with `Reply-To` set to the visitor's address, so you can
just hit "Reply" in your inbox to answer them directly.

All personal contact details (email, GitHub, X, WhatsApp, location) are read
from `NEXT_PUBLIC_*` env vars in `lib/site.ts` — nothing is hardcoded into
components. See `.env.example`.

## Notes on this build environment

- Fonts (Fraunces / Inter / JetBrains Mono) are loaded via a `<link>` tag in
  `app/layout.tsx` rather than `next/font/google`, because this sandbox's
  network egress doesn't allow `fonts.googleapis.com` at build time — the
  same constraint documented in the original ZKRcompany repo. On a normal
  host (Vercel, your machine with full internet), you can switch to
  `next/font/google` if you prefer self-hosted font optimization; the
  current approach works identically at runtime either way.
- `npm run build` was run and verified in this sandbox: 0 TypeScript errors,
  0 ESLint warnings/errors, all 9 routes (`/`, `/api/contact`, `/work/*` × 4,
  `/_not-found`) build and were smoke-tested with `next start` — every
  internal route returns 200, an unknown `/work/*` slug correctly 404s, and
  the contact API correctly returns its "no backend configured" fallback.

## What's deliberately not claimed

Per the source repos, a few things are called out as in-progress rather than
shipped (see each project's "Case study" section on its `/work/[slug]` page):
ZKR Ecommerce's admin coupon/review tooling, ZKR Eclipse's backend/auth
integration, and ZKR Estate's email notifications, map search, and payments.
