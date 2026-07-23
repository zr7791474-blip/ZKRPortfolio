/**
 * Public contact details. These are pulled from environment variables when
 * available (see .env.example) but fall back to the real, public values
 * below — none of this is secret, so the site never has to show a broken
 * "Set NEXT_PUBLIC_..." placeholder just because a hosting provider (e.g.
 * Vercel project settings) wasn't configured with the env vars.
 */
const DEFAULTS = {
  email: "zr7791474@gmail.com",
  githubUrl: "https://github.com/zr7791474-blip",
  xUrl: "https://x.com/zkr_ad",
  instagramUrl: "https://instagram.com/zkr_ad",
  whatsappUrl: "https://wa.me/212657516301",
  location: "Casablanca, Morocco",
} as const;

export const siteConfig = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULTS.email,
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || DEFAULTS.githubUrl,
  xUrl: process.env.NEXT_PUBLIC_X_URL || DEFAULTS.xUrl,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULTS.instagramUrl,
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || DEFAULTS.whatsappUrl,
  location: process.env.NEXT_PUBLIC_LOCATION || DEFAULTS.location,
} as const;

export function mailtoHref(opts: {
  email: string;
  subject: string;
  body: string;
}): string {
  const params = new URLSearchParams({ subject: opts.subject, body: opts.body });
  // URLSearchParams encodes spaces as "+"; mailto wants %20.
  return `mailto:${opts.email}?${params.toString().replace(/\+/g, "%20")}`;
}
