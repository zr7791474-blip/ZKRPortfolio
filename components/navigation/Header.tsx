import Link from "next/link";
import { nav } from "@/data/content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";
import Logo from "@/components/ui/Logo";

type HeaderProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  activeHref: string;
};

export default function Header({ scrolled, menuOpen, onToggleMenu, activeHref }: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[1000] border-b border-transparent py-[26px] transition-all duration-500 ease-signature",
        scrolled && "border-border bg-bg/80 py-4 backdrop-blur-2xl backdrop-saturate-150"
      )}
    >
      <nav className="wrap flex items-center justify-between">
        <Link href="#hero" className="flex items-center">
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
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-[22px] md:flex">
          <Magnetic as="a" href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-[22px] !py-[11px] text-[13px]">
            GitHub
          </Magnetic>
          <Magnetic as="a" href="#contact" className="btn btn-primary !px-[22px] !py-[11px] text-[13px]">
            Start a Project
          </Magnetic>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
          className="z-[1100] flex w-[26px] flex-col gap-[5px] md:hidden"
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
      </nav>
    </header>
  );
}
