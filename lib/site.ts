/**
 * Public contact details, sourced from environment variables so nothing
 * personal is hardcoded into components. See .env.example.
 */
export const siteConfig = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
  xUrl: process.env.NEXT_PUBLIC_X_URL ?? "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "",
  location: process.env.NEXT_PUBLIC_LOCATION ?? "",
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
