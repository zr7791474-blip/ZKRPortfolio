# ZKR Portfolio — Next.js

Production Next.js (App Router) rebuild of the ZKR portfolio prototype. Same
visual identity, motion language, and content — proper component
architecture, TypeScript, and a data-driven project system underneath it.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · lucide-react · simple-icons

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

## Brand assets (logo, hero image & project screenshots)

**No binary assets are included in this zip.** The code references them and is
wired to pick them up automatically — drop the real files in at these paths, no
code changes needed:

| Asset | Path | Used in |
|---|---|---|
| ZKR logo (official branding) | `public/logo/zkr.jpg` | `components/ui/Logo.tsx` — nav, loader, footer, Agent; also the favicon / apple-touch-icon (`app/layout.tsx`) |
| Hero background | `public/hero/background.jpg` | `components/hero/HeroImage.tsx` — cinematic hero visual |
| Project screenshots | `public/projects/<slug>/…` (file names are listed per project in `data/projects.ts`) | project cards and the `/work/[slug]` gallery + lightbox |

Until the real files exist, everything degrades instead of breaking:

- `Logo` falls back to the "ZKR•" text wordmark.
- `HeroImage` falls back to the ambient grid + glow treatment used elsewhere on the site.
- Project images (`components/ui/SafeImage.tsx`) fall back to a plain card-surface panel — nothing is drawn or invented in place of a missing screenshot.
- No build failure. The only visible symptoms are the browser's 404 for the favicon and for the image requests.

Never replace the official logo with a redrawn/SVG version — the brand mark is `public/logo/zkr.jpg`.

## Color rhythm

The site deliberately avoids "black background everywhere." Each section has
its own atmosphere, all still recognizably ZKR (dark, warm-accented,
technical), derived from tones present in the hero image:

- **Hero** — cinematic image + warm/aurora overlay
- **Projects** — each project gets a two-tone wash (`accent` + `moodVia` in `data/projects.ts`): brass+forest (Company), burgundy+cream (Ecommerce), dusty blue+lavender (Eclipse), clay+forest (Estate)
- **About** — a deliberate light "paper" moment: warm cream background, dark ink text, pine-green accent — the one section that isn't dark, by design, to prevent black fatigue
- **Experience** — blue-charcoal (`midnight`)
- **Skills** — a quiet neutral `ink` tone, no gradients or glows: just the logo wall (see below)
- **Process** — a top-to-bottom gradient from forest → base → midnight, with a matching aurora→dusty-blue scroll-progress line
- **Contact** — obsidian with both a brass glow and an aurora glow, as the closing "climax" scene

All of these colors live in `tailwind.config.ts` under a clearly separated
"atmospheric palette" block, so the whole system is one file to retune.

The base palette is a soft charcoal rather than near-black (`bg #121317`,
`surface #1a1b21`, `surface-2 #21222a`, `ink #181a21`, `midnight #141c2e`),
with `text-dim #bdbbb5` / `text-faint #918f8b` chosen to stay above WCAG AA
(4.5:1) on every surface. Per-project accent colours that are too dark to read
as text are lightened (hue preserved) by `readableAccent()` in `lib/utils.ts`.

The site is a single dark theme by design (plus the cream About section) —
there is no theme toggle and no `prefers-color-scheme` handling; the OS colour
scheme does not change how it renders.

## Skills section

A quiet logo wall: one labelled row per discipline, technology mark above its
name. No cards, pills, progress bars, percentages or claimed proficiency levels.

- Data: `skillGroups` in `data/content.ts` (each item has an `icon` key).
- Icons: `components/skills/TechIcon.tsx`. Official brand marks come from
  [`simple-icons`](https://simpleicons.org) (CC0 data; the marks themselves are
  trademarks of their respective owners and are used only to identify the
  technologies). Where that set has no mark (Auth.js, Zustand) or the item is a
  concept (design tokens) a neutral `lucide-react` glyph is used — no logos are
  drawn or invented.
- Motion: a small CSS-only lift + tilt on hover, written with `motion-safe:` so
  it disappears entirely under `prefers-reduced-motion`.
- To add a skill: add it to `skillGroups`, import its `si…` icon in
  `TechIcon.tsx` and register the key.

## ZKR Assistant (EN / FR / ES)

A local, deterministic assistant — deliberately **no LLM / external API** — so
every answer is traceable to real content in `data/profile.ts` and unmatched
questions get an honest "I don't have that information" in the visitor's
language instead of a guess.

- Engine: `lib/assistant/engine.ts`. Input is accent-folded and tokenised;
  keywords match only as whole words (never substrings). The language is chosen
  by score (function words, language-specific vocabulary, ¿ ñ ç …); words shared
  by two languages cancel out; on a tie the website's current language wins.
- UI: `components/assistant/ZkrAssistant.tsx` — labels, placeholder and
  suggestion chips follow the site language; the welcome message re-localises
  when the language changes.
- Add a topic: add its keywords per language in `TOPIC_KEYWORDS` and its answer
  text per language in `buildResponses()`.

## Accessibility & motion

- Touch targets are ≥ 44px on phones; form inputs are 16px so iOS Safari does not zoom.
- The Agent is a labelled dialog with a focus trap, Escape, focus return and a live region for answers.
- `MotionConfig reducedMotion="user"` (`components/ui/MotionProvider.tsx`) makes every Framer Motion animation honour `prefers-reduced-motion`; CSS animations are neutralised in `globals.css`.
- Header, mobile menu and footer links are route-aware (`lib/useAnchorNav.ts`): `#work` on the home page, `/#work` on `/work/*` pages.

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

## Screenshots

Real screenshots are never fabricated. `data/projects.ts` lists the real screenshot
files each project expects under `public/projects/<slug>/` (these image files are
**not** in this zip). Entries marked `isPlaceholder: true` (currently the
Fleurs Alliance shots) are captioned "Placeholder" in the gallery.

To add or swap a screenshot:

1. Drop the image into `public/projects/<slug>/`.
2. Update that shot's entry in the project's `screenshots` array in `data/projects.ts`:
   ```ts
   { src: "/projects/zkr-ecommerce/storefront.png", alt: "...", label: "Storefront", isPlaceholder: false },
   ```

The project cover, the gallery grid and the lightbox all update automatically,
and the "Placeholder" caption disappears once `isPlaceholder` is `false`. Click
any screenshot on a `/work/[slug]` page to open it in the fullscreen lightbox.

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
- `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass (0 TypeScript
  errors, 0 ESLint errors). The routes — `/`, `/api/contact`, the 10
  `/work/[slug]` pages and the 404 page — were smoke-tested in real Chromium on
  desktop and on 320 / 375 / 390 / 430px phones in EN, FR and ES.
- The contact API deliberately answers **503** with `{ fallback: "mailto" }` when
  neither `RESEND_API_KEY` nor `CONTACT_FORM_ENDPOINT` is set; the form then
  opens a pre-filled email. Browsers log that 503 in the console — it is expected
  and goes away once a mail backend is configured.

## What's deliberately not claimed

Per the source repos, a few things are called out as in-progress rather than
shipped (see each project's "Case study" section on its `/work/[slug]` page):
ZKR Ecommerce's admin coupon/review tooling, ZKR Eclipse's backend/auth
integration, and ZKR Estate's email notifications, map search, and payments.
