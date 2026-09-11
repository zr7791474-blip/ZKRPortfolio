"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ProjectsSection() {
  const { t } = useTranslation();

  return (
    <section id="work" className="py-[150px] md:py-[150px]">
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
          {projects.map((project, index) => {
            // With 3 desktop columns, a project count of the form 3n+1 leaves
            // a single orphan card alone in the last row. Centering it under
            // the middle column reads intentional instead of accidental.
            const isOrphan = projects.length % 3 === 1 && index === projects.length - 1;
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                className={isOrphan ? "lg:col-start-2" : undefined}
              />
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
