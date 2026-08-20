"use client";

import { mailtoHref, siteConfig } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();
  const emailHref = siteConfig.email
    ? mailtoHref({
        email: siteConfig.email,
        subject: "Project Inquiry",
        body: "Hello Zakaria,\n\nI would like to contact you regarding...",
      })
    : "#contact";

  const links = [
    { label: "GitHub", href: siteConfig.githubUrl, external: true },
    { label: "X", href: siteConfig.xUrl, external: true },
    { label: "Instagram", href: siteConfig.instagramUrl, external: true },
    { label: "WhatsApp", href: siteConfig.whatsappUrl, external: true },
    { label: "Email", href: emailHref, external: false },
  ].filter((l) => l.href);

  return (
    <footer className="border-t border-border py-[50px]">
      <div className="wrap flex flex-wrap items-center justify-between gap-5">
        <a href="#hero" className="flex items-center" aria-label="Back to top">
          <Logo size={26} />
        </a>
        <div className="flex gap-[26px]">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              aria-label={l.label}
              className="text-[13px] text-text-dim transition-colors hover:text-accent"
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
