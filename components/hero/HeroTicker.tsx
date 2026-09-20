"use client";

import { siteConfig } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function HeroTicker() {
  const { t } = useTranslation();

  const items = [
    t("ticker.fullStack").toUpperCase(),
    t("ticker.engineer").toUpperCase(),
    t("ticker.builder").toUpperCase(),
    t("ticker.systems").toUpperCase(),
    (siteConfig.location || t("loader.location")).toUpperCase(),
    t("ticker.available").toUpperCase(),
  ];
  const doubled = [...items, ...items];

  return (
    <div className="group relative overflow-hidden border-t border-border bg-surface">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap py-4 [animation-duration:34s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[.16em] text-text-dim">
            {item}
            <span className="h-[5px] w-[5px] rounded-full bg-accent/60" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
