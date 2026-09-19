"use client";

import Reveal from "@/components/ui/Reveal";
import HtmlT from "@/components/ui/HtmlT";
import { useTranslation } from "@/lib/i18n/LanguageContext";

/**
 * Deliberately breaks from the dark theme — a warm, editorial "paper" moment
 * that gives the eye a rest between the hero/projects and the darker
 * skills/process/contact sections, per the site's color-rhythm system.
 */
export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="relative overflow-hidden bg-cream py-24 md:py-[150px] text-cream-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-0 h-[70%] w-[50%]"
        style={{ background: "radial-gradient(ellipse, rgba(74,93,78,0.14) 0%, transparent 70%)" }}
      />
      <div className="wrap relative grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <Reveal>
          <div className="mb-[18px] flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[.18em] text-pine">
            <span className="h-px w-5 bg-pine/50" />
            {t("about.eyebrow")}
          </div>
          <HtmlT
            k="about.quote"
            as="p"
            className="font-serif text-[clamp(24px,2.6vw,32px)] leading-[1.35] tracking-[-0.01em] [&_em]:font-serif [&_em]:italic [&_em]:text-burgundy"
          />
        </Reveal>
        <Reveal delay={0.1} className="space-y-5">
          <HtmlT k="about.p1" as="p" className="max-w-[560px] text-[15.5px] text-cream-ink/75 [&_strong]:font-medium [&_strong]:text-cream-ink" />
          <HtmlT k="about.p2" as="p" className="max-w-[560px] text-[15.5px] text-cream-ink/75 [&_strong]:font-medium [&_strong]:text-cream-ink" />
          <HtmlT k="about.p3" as="p" className="max-w-[560px] text-[15.5px] text-cream-ink/75 [&_strong]:font-medium [&_strong]:text-cream-ink" />
        </Reveal>
      </div>
    </section>
  );
}
