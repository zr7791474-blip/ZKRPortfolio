"use client";

import Reveal from "@/components/ui/Reveal";
import HtmlT from "@/components/ui/HtmlT";
import { useTranslation } from "@/lib/i18n/LanguageContext";

/** Editorial statement + short bio on a soft green surface — a calm break between Work and Experience. */
export default function AboutSection() {
  const { t } = useTranslation();
  const para =
    "max-w-[560px] text-[15.5px] text-text-dim [&_strong]:font-medium [&_strong]:text-text";

  return (
    <section id="about" className="relative border-t border-border bg-surface py-24 md:py-[150px]">
      <div className="wrap relative grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <Reveal>
          <div className="eyebrow">{t("about.eyebrow")}</div>
          <HtmlT
            k="about.quote"
            as="p"
            className="font-serif text-[clamp(26px,2.8vw,34px)] leading-[1.3] tracking-[-0.01em] [&_em]:font-serif [&_em]:italic [&_em]:text-accent"
          />
        </Reveal>
        <Reveal delay={0.1} className="space-y-5">
          <HtmlT k="about.p1" as="p" className={para} />
          <HtmlT k="about.p3" as="p" className={para} />
        </Reveal>
      </div>
    </section>
  );
}
