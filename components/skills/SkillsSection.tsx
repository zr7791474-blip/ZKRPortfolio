"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TechIcon from "./TechIcon";
import { skillGroups } from "@/data/content";
import { useTranslation } from "@/lib/i18n/LanguageContext";

/**
 * A quiet logo wall: one labelled row per discipline, technology mark above its
 * name. No cards, pills, bars, percentages or claimed proficiency levels.
 *
 * Motion is a small CSS-only lift + tilt on hover. It is wrapped in `motion-safe:`
 * so visitors who prefer reduced motion get a colour change only, no movement.
 */
export default function SkillsSection() {
  const { t } = useTranslation();

  return (
    <section id="skills" className="relative overflow-hidden border-t border-border bg-surface py-24 md:py-[150px]">
      <div className="wrap relative">
        <SectionHeading
          title={
            <>
              {t("skills.title1")}
              <br />
              {t("skills.title2")}
            </>
          }
          description={t("skills.description")}
        />

        <div className="border-t border-border">
          {skillGroups.map((group) => (
            <Reveal
              key={group.key}
              className="grid grid-cols-1 gap-6 border-b border-border py-9 md:grid-cols-[200px_1fr] md:gap-10 md:py-11"
            >
              <h3 className="font-mono text-xs uppercase tracking-[.12em] text-accent">
                {t(`skills.groups.${group.key}`)}
              </h3>

              <ul
                aria-label={t(`skills.groups.${group.key}`)}
                className="grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-[repeat(auto-fill,minmax(112px,1fr))] md:gap-x-6 md:gap-y-9"
              >
                {group.items.map((item, i) => (
                  <li key={item.name} className="group flex min-w-0 flex-col items-start gap-3">
                    <span
                      className="skill-icon inline-flex h-11 w-11 items-center justify-center text-text-dim transition-[transform,color] duration-[350ms] ease-signature group-hover:text-text motion-safe:group-hover:-translate-y-[3px] motion-safe:group-hover:scale-[1.1] motion-safe:group-hover:rotate-[var(--tilt)]"
                      style={{ ["--tilt" as string]: i % 2 === 0 ? "-5deg" : "5deg" }}
                    >
                      <TechIcon name={item.icon} className="h-8 w-8" />
                    </span>
                    <span className="text-[13.5px] leading-snug text-text-dim transition-colors duration-300 group-hover:text-text">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
