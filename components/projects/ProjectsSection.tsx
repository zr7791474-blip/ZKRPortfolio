"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ProjectCard, { ProjectRow } from "./ProjectCard";
import { FEATURED_PROJECT_COUNT, projects } from "@/data/projects";
import { useTranslation } from "@/lib/i18n/LanguageContext";

/**
 * data/projects.ts is ordered by portfolio value. The first FEATURED_PROJECT_COUNT get the stronger
 * card treatment; the rest follow as a compact list. No ranking numbers are shown.
 */
export default function ProjectsSection() {
  const { t } = useTranslation();
  const featured = projects.slice(0, FEATURED_PROJECT_COUNT);
  const more = projects.slice(FEATURED_PROJECT_COUNT);

  return (
    <section id="work" className="py-24 md:py-[150px]">
      <div className="wrap">
        <SectionHeading
          title={
            <>
              {t("projectsSection.title1")}
              <br />
              {t("projectsSection.title2")}
            </>
          }
          description={t("projectsSection.description")}
        />

        <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Reveal>

        {more.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[.16em] text-text-faint">
              {t("projectsSection.more")}
            </h3>
            <Reveal>
              <ul className="border-b border-border">
                {more.map((project) => (
                  <ProjectRow key={project.slug} project={project} />
                ))}
              </ul>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
