"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const VISIBLE_TECH_COUNT = 3;

/**
 * Scannable project card: cover, project name, one-line tagline, three key technologies,
 * and the actions. The longer description lives on the case-study page.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots[0];
  const { t } = useTranslation();
  const extraTech = project.technologies.length - VISIBLE_TECH_COUNT;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface transition-[transform,border-color] duration-300 ease-signature hover:-translate-y-1 hover:border-brand motion-reduce:hover:translate-y-0">
      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} — ${t("projectCard.caseStudy")}`}
        className="relative block aspect-[16/10] w-full overflow-hidden border-b border-border bg-surface-2"
      >
        {cover && (
          <SafeImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-signature group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-bg px-2.5 py-1 font-mono text-[10px] tracking-[.08em] text-accent">
          {project.index} / 10
        </span>
      </Link>

      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[.1em] text-accent">{project.title}</div>
        <Link href={`/work/${project.slug}`}>
          <h3 className="line-clamp-2 min-h-[54px] font-serif text-[22px] leading-[1.2] tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
            {project.tagline}
          </h3>
        </Link>

        <div className="mt-4 flex flex-wrap gap-[6px]">
          {project.technologies.slice(0, VISIBLE_TECH_COUNT).map((tech) => (
            <span key={tech} className="tech-badge !px-[10px] !py-[5px] !text-[10.5px]">
              {tech}
            </span>
          ))}
          {extraTech > 0 && (
            <span className="tech-badge !px-[10px] !py-[5px] !text-[10.5px] !text-text-faint">+{extraTech}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
          <Link
            href={`/work/${project.slug}`}
            className="-my-[14px] inline-flex items-center gap-[6px] py-[14px] font-mono text-[11px] tracking-[.06em] text-text-dim transition-colors duration-300 hover:text-accent"
          >
            {t("projectCard.caseStudy")}
            <ArrowUpRight className="h-[12px] w-[12px] transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] motion-reduce:transform-none" aria-hidden />
          </Link>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("projectCard.liveDemo")} — ${project.title}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-bg md:h-[32px] md:w-[32px]"
              >
                <ExternalLink className="h-[13px] w-[13px]" aria-hidden />
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("projectCard.github")} — ${project.title}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors duration-300 hover:border-accent hover:text-accent md:h-[32px] md:w-[32px]"
              >
                <Github className="h-[13px] w-[13px]" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
