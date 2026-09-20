"use client";

import Link from "next/link";
import { nav } from "@/data/content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAnchorNav } from "@/lib/useAnchorNav";
import ThemeToggle from "@/components/ui/ThemeToggle";

type HeaderProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  activeHref: string;
};

const navKeyByHref: Record<string, string> = {
  "#work": "work",
  "#about": "about",
  "#experience": "experience",
  "#skills": "skills",
  "#services": "services",
  "#process": "process",
  "#contact": "contact",
};

export default function Header({ scrolled, menuOpen, onToggleMenu, activeHref }: HeaderProps) {
  const { t } = useTranslation();
  const anchor = useAnchorNav();

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[1000] border-b border-transparent transition-all duration-500 ease-signature",
        // Mutually exclusive padding classes: two utilities for the same property (py-[14px] / py-2)
        // are resolved by stylesheet order, not class order, so the "compact on scroll" state
        // would never apply if both were present.
        scrolled
          ? "border-border bg-bg/95 py-2 md:py-4"
          : "py-[14px] md:py-[26px]"
      )}
    >
      <nav className="wrap flex items-center justify-between gap-3">
        <Link href={anchor.isHome ? "#hero" : "/"} className="flex min-h-[44px] min-w-0 items-center">
          <Logo size={30} />
        </Link>

        {/* Full desktop nav only from 1280px: 7 links + language + theme + 2 buttons need ~1,200px in FR/ES.
            Below that the compact header (logo · language · theme · menu) is used. */}
        <div className="hidden items-center gap-[38px] xl:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={anchor.href(item.href)}
              onClick={(e) => anchor.onClick(e, item.href)}
              className={cn(
                "relative py-1 text-[13.5px] text-text-dim transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] after:duration-300 hover:text-text hover:after:w-full",
                activeHref === item.href && "text-text after:w-full"
              )}
            >
              {t(`nav.${navKeyByHref[item.href] ?? item.label.toLowerCase()}`)}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-[14px] xl:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Magnetic
            as="a"
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost !px-[22px] !py-[11px] text-[13px]"
          >
            {t("header.github")}
          </Magnetic>
          <Magnetic as="a" href={anchor.href("#contact")} onClick={(e) => anchor.onClick(e, "#contact")} className="btn btn-primary !px-[22px] !py-[11px] text-[13px]">
            {t("header.startProject")}
          </Magnetic>
        </div>

        {/* Mobile-only row: compact language switcher + hamburger, aligned and never overflowing */}
        <div className="flex flex-shrink-0 items-center gap-1.5 xl:hidden">
          <LanguageSwitcher compact />
          <ThemeToggle />
          <button
            aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
            className="z-[1100] -mr-[9px] flex h-11 w-11 flex-shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
          >
            <span className="flex h-[26px] w-[26px] flex-col items-center justify-center gap-[5px]">
              <span
                className={cn(
                  "h-px w-full bg-text transition-all duration-[400ms] ease-signature",
                  menuOpen && "translate-y-[6px] rotate-45"
                )}
              />
              <span className={cn("h-px w-full bg-text transition-all duration-[400ms] ease-signature", menuOpen && "opacity-0")} />
              <span
                className={cn(
                  "h-px w-full bg-text transition-all duration-[400ms] ease-signature",
                  menuOpen && "-translate-y-[6px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
