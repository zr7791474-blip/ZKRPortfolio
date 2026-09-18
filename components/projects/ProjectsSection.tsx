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
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
