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
  globals.css             theme variables (light / dark / .tone-inverse) + Tailwind layers
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
  skills/       SkillsSection, TechIcon (simple-icons brand marks)
  assistant/    ZkrAssistant (dialog UI)
  services/     ServicesSection
  process/      ProcessSection
  contact/      ContactSection, ContactTile, ContactForm, CopyEmailButton, FloatingDock
  ui/           Reveal, Magnetic, Counter, Marquee, SectionHeading, ThemeToggle, SafeImage,
                MotionProvider, Logo, LanguageSwitcher

data/
  projects.ts   single source of truth for all 4 projects — edit this file to
                 change any project content anywhere on the site
  content.ts    nav links, hero stats, skills, services, process steps, marquee
  profile.ts    the only facts the Assistant may state

lib/
  site.ts       typed env-var accessor for contact details + mailto helper
  utils.ts      cn() class helper, email validation
  assistant/    engine.ts — local intent engine (see ZKR Assistant)
  i18n/         dictionaries (EN/FR/ES) + LanguageContext
  useAnchorNav.ts  route-aware #anchor links for the shared header/footer

public/projects/<slug>/   screenshot assets (see below)
```

## Projects

`data/projects.ts` is the single source of truth (cards, case-study pages and the Assistant all read
it). **The array order is the display order** — ordered by portfolio value, not by date or name. The
first `FEATURED_PROJECT_COUNT` (6) render as strong cards; the rest follow as a compact list. No
ranking numbers are shown anywhere.

Current order (13 projects):

1. ZKR Estate · 2. ZKR Verano · 3. ZKR Ecommerce · 4. ZKR FeelingApp · 5. ZKR Atelier · 6. ZKR Resume AI
7. ZKR Eclipse · 8. ZKR TaskFlow · 9. ZKR Company · 10. Fleurs Alliance · 11. Coffy° · 12. ZKR Festival · 13. ZKR Coffee

The first six are the priority work. The remaining seven are ordered by technical depth as recorded
in the data: Eclipse (dashboard platform + component library), TaskFlow (SaaS with auth and a kanban
board), Company (11-route agency site), Fleurs Alliance (bilingual storefront with ordering),
Coffy°, Festival and Coffee (marketing/concept sites).

**Only verified facts.** FeelingApp, Atelier and Resume AI were supplied as screenshots + a live URL,
without source or docs, so their entries contain only what those screenshots visibly show and have
`technologies: []` — the cards show a real `highlights` list instead. Add a technology list, a
`repositoryUrl`, or more detail only once verified.

To add or change a project: edit its entry (or insert a new one at the right position), drop the
screenshots into `public/projects/<slug>/`, and reference them in `screenshots`.

## Brand assets (logo, hero image & project screenshots)

The real files ship in `public/`:

| Asset | Path | Used in |
|---|---|---|
| ZKR logo (official branding) | `public/logo/zkr.jpg` | `components/ui/Logo.tsx` — nav, loader, footer, Agent; also the favicon / apple-touch-icon (`app/layout.tsx`) |
| Hero background | `public/hero/background.jpg` (aurora photo, ~3 MB — served through `next/image`) | `components/hero/HeroImage.tsx` |
| Project screenshots | `public/projects/<slug>/…` (13 folders) | project cards and the `/work/[slug]` gallery + lightbox |

If a file is ever missing the site degrades instead of breaking: `Logo` falls back to the "ZKR•"
wordmark, `HeroImage` to the plain blueprint grid, and project images (`components/ui/SafeImage.tsx`)
to a plain card-surface panel. Nothing is ever drawn or invented in place of a missing screenshot.

Never replace the official logo with a redrawn/SVG version — the brand mark is `public/logo/zkr.jpg`.

## Colour system & themes

The site uses the **Meadow Green** palette as one identity in two themes (light is the default):

`#D9ED92 · #B5E48C · #99D98C · #76C893 · #52B69A · #34A0A4 · #168AAD · #1A759F · #1E6091 · #184E77`
(yellow-green → teal → deep blue)

The palette has no near-white or near-black, so page tones are *derived* from it: the light paper
is `#D9ED92` lightened (`#F4FAE0`), the dark page is `#184E77` darkened (`#0C273C`). Text colours were
chosen for WCAG AA on every surface they sit on — on light, only `#184E77` / `#1E6091` / `#1A759F`
are dark enough for text, so the greens carry borders, fills and decoration instead.

| Role | Light | Dark |
|---|---|---|
| Page | `#F4FAE0` | `#0C273C` |
| Surfaces | `#EFF7D1` / `#E4F2B0` | `#133E5F` / `#184E77` |
| Borders | `#B5E48C` / `#99D98C` | `#1E6091` / `#1A759F` |
| Text (dim / faint) | `#184E77` (`#326384` / `#1C6A98`) | `#F4FAE0` (`#D8E1CC` / `#A3B0A7`) |
| Accent (links, labels) | `#1A759F` | `#76C893` |
| Decorative fills | `#52B69A` | `#52B69A` |
| Closing Contact + Footer band | `#184E77` | `#184E77` |

**How it works.** Every colour is a CSS variable (an RGB triplet) defined per theme in
`app/globals.css`; `tailwind.config.ts` maps them (`bg-bg`, `text-text`, `border-border`,
`text-accent`, `bg-brand` …) with alpha support, so components never hard-code a colour. The theme
lives on `<html data-theme>`:

- an inline script in `app/layout.tsx` sets it before first paint (saved choice → OS
  `prefers-color-scheme` → light), so there is no flash of the wrong theme;
- `components/ui/ThemeToggle.tsx` switches it, saves the choice in `localStorage` (`zkr-theme`),
  follows the OS live while nothing is saved, syncs other tabs and updates the browser `theme-color`.

There are no gradients, glows, blur or glass. To retune everything, edit the variable blocks
(`:root`, `[data-theme="dark"]`, `.tone-inverse`) in `app/globals.css`.

## Typography

Typefaces are three roles exposed as CSS variables (`app/globals.css`): `--font-display` (headings,
project titles), `--font-body` (body, navigation, buttons, forms, Agent) and `--font-mono` (labels,
tags). Today they resolve to Fraunces / Inter / JetBrains Mono, loaded by the `<link>` in
`app/layout.tsx`.

**A custom font has not been applied yet:** the material supplied for this round was a
font-pairing preview image (a script face paired with a serif, captioned in Poppins), not font
files, and no substitute was guessed. To adopt real fonts: put the files in `public/fonts/`, add
their `@font-face` rules (correct `font-weight` / `font-style` per file, `font-display: swap`) to
`app/globals.css`, and point the variables at them — every heading, nav item, button, form field,
footer line and the Agent follows. Note that a script face suits display accents only; keep the
body and interface roles on a readable text face.

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

A local, deterministic assistant — deliberately **no LLM, external API, database or
backend** — so every answer is traceable to real content in `data/profile.ts`, and
anything it can't match with enough confidence gets an honest "I don't have that
information" (in the visitor's language) instead of a guess.

- **Engine:** `lib/assistant/engine.ts`.
  1. *Normalise:* lower-case, strip accents, split into whole-word tokens, light
     consistent stemming (`skills→skill`, `competences→competenc`). Matching is always
     whole-token, so `nta` can never fire inside `contact`.
  2. *Score intents:* each intent (skills, contact, experience, education, projects,
     about, github, instagram, availability) has per-language keywords, weak hints and
     "combo" groups (question word × build-verb ⇒ *"What have you created?"* is Projects
     without a listed phrase). Phrase = its length, keyword = 2, combo = 3, weak hint = 1.
     Below `MIN_CONFIDENT_SCORE` (2) the honest fallback is returned; ties use a fixed
     priority. Pleasantries only answer short messages.
  3. *Language:* scored from function words, language-specific vocabulary and script
     hints (¿ ñ ç …); words shared by two languages cancel out; the website's language
     only breaks ties.
  4. *Answer:* concise `Label: value` lines from `data/profile.ts` + localized follow-up
     chips (Projects / Experience / Contact …) in the language of the reply.
- **Generic "work"** (*"Tell me about your work"*, *"Parle-moi de ton travail"*) is
  answered as Experience, which also lists what was shipped; explicit "projects /
  réalisations / show me your work" go to Projects.
- **Education** is honestly "not listed" — no degree is invented.
- **UI:** `components/assistant/ZkrAssistant.tsx` — answers are instant (no fake typing
  state); the panel is a mobile bottom sheet / desktop card, a labelled dialog with
  focus trap, Escape and focus return; the email and URLs in answers are clickable.
- **Add a topic:** add it to `INTENTS` (keywords per language) and `buildResponses()`.

## Accessibility & motion

- The theme toggle has a localized accessible name that says what it will do ("Switch to dark mode").
- Every focusable control shows an instant, visible focus ring (`transition-ui` deliberately excludes outline properties; the hidden contact dock is `visibility:hidden` so it is not tabbable).
- Touch targets are ≥ 44px on phones; form inputs are 16px so iOS Safari does not zoom.
- The Agent is a labelled dialog with a focus trap, Escape, focus return and a live region for answers.
- `MotionConfig reducedMotion="user"` (`components/ui/MotionProvider.tsx`) makes every Framer Motion animation honour `prefers-reduced-motion`; CSS animations are neutralised in `globals.css`.
- Header, mobile menu and footer links are route-aware (`lib/useAnchorNav.ts`): `#work` on the home page, `/#work` on `/work/*` pages.

## Signature interactions

- **Scroll progress** — a thin accent-colored bar across the very top of the viewport (`components/ui/ScrollProgress.tsx`), honest and functional, not decorative
- **Hero ticker** — a full-bleed, slow-moving info strip at the bottom of the hero (`components/hero/HeroTicker.tsx`), pauses on hover
- **Living schematic** — the system-diagram panel on every project has breathing nodes plus a small dot that continuously travels the trace line (`offset-path`, degrades gracefully to a static line on browsers without support)
- **Mouse-reactive hero frame** — the technical coordinate frame around the hero shifts a few pixels with the cursor (disabled under `prefers-reduced-motion`)



## Screenshots

Real screenshots are never fabricated. Each project's screenshots live in
`public/projects/<slug>/` and are listed in its `screenshots` array in `data/projects.ts`. A shot
with `isPlaceholder: true` would be captioned "Placeholder" in the gallery — currently none are.

To add or swap a screenshot:

1. Drop the image into `public/projects/<slug>/`.
2. Add or update its entry in the project's `screenshots` array:
   ```ts
   { src: "/projects/zkr-ecommerce/storefront.png", alt: "...", label: "Storefront", isPlaceholder: false },
   ```

The project cover (the first screenshot), the gallery grid and the lightbox all update automatically.
Click any screenshot on a `/work/[slug]` page to open it in the fullscreen lightbox.

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
  desktop and on 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440px in EN, FR and ES,
  in both the light and dark theme (13 project routes, plus a themed 404).
- The contact API deliberately answers **503** with `{ fallback: "mailto" }` when
  neither `RESEND_API_KEY` nor `CONTACT_FORM_ENDPOINT` is set; the form then
  opens a pre-filled email. Browsers log that 503 in the console — it is expected
  and goes away once a mail backend is configured.

## What's deliberately not claimed

Per the source repos, a few things are called out as in-progress rather than
shipped (see each project's "Case study" section on its `/work/[slug]` page):
ZKR Ecommerce's admin coupon/review tooling, ZKR Eclipse's backend/auth
integration, and ZKR Estate's email notifications, map search, and payments.
