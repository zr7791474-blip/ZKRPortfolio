import { siteConfig } from "@/lib/site";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border py-[50px]">
      <div className="wrap flex flex-wrap items-center justify-between gap-5">
        <a href="#hero" className="flex items-center">
          <Logo size={26} />
        </a>
        <div className="flex gap-[26px]">
          <a href={siteConfig.githubUrl} target="_blank" rel="noopener" className="text-[13px] text-text-dim transition-colors hover:text-accent">
            GitHub
          </a>
          <a href={siteConfig.xUrl} target="_blank" rel="noopener" className="text-[13px] text-text-dim transition-colors hover:text-accent">
            X
          </a>
          <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener" className="text-[13px] text-text-dim transition-colors hover:text-accent">
            WhatsApp
          </a>
          <a href={`mailto:${siteConfig.email}`} className="text-[13px] text-text-dim transition-colors hover:text-accent">
            Email
          </a>
        </div>
        <span className="font-mono text-[11px] text-text-faint">© 2026 ZAKARIA ADLI — BUILT WITH INTENT</span>
      </div>
    </footer>
  );
}
