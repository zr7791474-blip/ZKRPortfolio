"use client";

import { mailtoHref, siteConfig } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAnchorNav } from "@/lib/useAnchorNav";

export default function Footer() {
  const { t } = useTranslation();
  const anchor = useAnchorNav();
  const emailHref = siteConfig.email
    ? mailtoHref({
        email: siteConfig.email,
        subject: "Project Inquiry",
        body: "Hello Zakaria,\n\nI would like to contact you regarding...",
      })
    : anchor.href("#contact");

  const links = [
    { label: "GitHub", href: siteConfig.githubUrl, external: true },
    { label: "X", href: siteConfig.xUrl, external: true },
    { label: "Instagram", href: siteConfig.instagramUrl, external: true },
    { label: "WhatsApp", href: siteConfig.whatsappUrl, external: true },
    { label: "Email", href: emailHref, external: false },
  ].filter((l) => l.href);

  return (
    <footer className="border-t border-border py-[50px]">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-5 gap-y-4">
        <a href={anchor.isHome ? "#hero" : "#"} className="flex min-h-[44px] items-center" aria-label="Back to top">
          <Logo size={26} />
        </a>
        <div className="flex flex-wrap gap-x-1 gap-y-1 md:gap-x-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              aria-label={l.label}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-[13px] text-text-dim transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </div>
        <span className="font-mono text-[11px] text-text-faint">© 2026 ZAKARIA ADLI — {t("footer.builtWith")}</span>
      </div>
    </footer>
  );
}
