"use client";

import Link from "next/link";
import { nav } from "@/data/content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type HeaderProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  activeHref: string;
};

const navKeyByHref: Record<string, string> = {
  "#work": "work",
  "#about": "about",
  "#skills": "skills",
  "#services": "services",
  "#process": "process",
  "#contact": "contact",
};

export default function Header({ scrolled, menuOpen, onToggleMenu, activeHref }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[1000] border-b border-transparent py-[26px] transition-all duration-500 ease-signature",
        scrolled && "border-border bg-bg/80 py-4 backdrop-blur-2xl backdrop-saturate-150"
      )}
    >
      <nav className="wrap flex items-center justify-between gap-3">
        <Link href="#hero" className="flex min-w-0 items-center">
          <Logo size={30} />
        </Link>

        <div className="hidden items-center gap-[38px] md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "relative py-1 text-[13.5px] text-text-dim transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] after:duration-300 hover:text-text hover:after:w-full",
                activeHref === item.href && "text-text after:w-full"
              )}
            >
              {t(`nav.${navKeyByHref[item.href] ?? item.label.toLowerCase()}`)}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-[14px] md:flex">
          <LanguageSwitcher />
          <Magnetic
            as="a"
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost !px-[22px] !py-[11px] text-[13px]"
          >
            {t("header.github")}
          </Magnetic>
          <Magnetic as="a" href="#contact" className="btn btn-primary !px-[22px] !py-[11px] text-[13px]">
            {t("header.startProject")}
          </Magnetic>
        </div>

        {/* Mobile-only row: compact language switcher + hamburger, aligned and never overflowing */}
        <div className="flex flex-shrink-0 items-center gap-3 md:hidden">
          <LanguageSwitcher compact />
          <button
            aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
            className="z-[1100] flex h-[26px] w-[26px] flex-shrink-0 flex-col items-center justify-center gap-[5px]"
          >
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
          </button>
        </div>
      </nav>
    </header>
  );
}
