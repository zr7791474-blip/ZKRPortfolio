"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { readableAccent } from "@/lib/utils";

const VISIBLE_TECH_COUNT = 3;

export default function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots[0];
  const { t } = useTranslation();
  const extraTech = project.technologies.length - VISIBLE_TECH_COUNT;

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface transition-all duration-500 ease-signature hover:-translate-y-1 hover:border-accent-line hover:shadow-[0_28px_56px_-32px_var(--card-glow)]"
      style={{ ["--card-glow" as string]: project.accent.soft }}
    >
      {/* subtle accent wash on hover — same per-project color language as the rest of the site */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(140% 70% at 50% 0%, ${project.accent.soft}, transparent 70%)` }}
      />

      <Link
        href={`/work/${project.slug}`}
        data-cursor="EXPLORE"
        className="relative block aspect-[16/10] w-full overflow-hidden border-b border-border"
      >
        {cover && (
          <SafeImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-signature group-hover:scale-[1.05]"
          />
        )}
        <span
          className="absolute left-3 top-3 rounded-full bg-bg/70 px-2 py-1 font-mono text-[10px] tracking-[.08em] backdrop-blur-sm"
          style={{ color: readableAccent(project.accent.hex) }}
        >
          {project.index} / 10
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-4 pb-3 pt-9">
          <span className="font-mono text-[10px] uppercase tracking-[.1em] text-text-faint">{project.category}</span>
        </div>
      </Link>

      <div className="relative flex flex-1 flex-col p-6">
        <Link href={`/work/${project.slug}`} data-cursor="EXPLORE">
          <h3 className="line-clamp-2 min-h-[50px] font-serif text-[21px] leading-[1.2] tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent-bright">
            {project.tagline}
          </h3>
        </Link>
        <p className="mt-[10px] line-clamp-2 min-h-[44px] text-[13.5px] leading-relaxed text-text-dim">
          {project.description}
        </p>

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

        <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
          <Link
            href={`/work/${project.slug}`}
            data-cursor="EXPLORE"
            className="-my-[14px] inline-flex items-center gap-[6px] py-[14px] font-mono text-[11px] tracking-[.06em] text-text-faint transition-colors duration-300 hover:text-accent-bright"
          >
            {t("projectCard.caseStudy")}
            <ArrowUpRight className="h-[12px] w-[12px] transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
          </Link>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="OPEN"
                aria-label={`${t("projectCard.liveDemo")} — ${project.title}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-all duration-300 ease-signature hover:border-accent hover:bg-accent hover:text-bg md:h-[30px] md:w-[30px]"
              >
                <ExternalLink className="h-[13px] w-[13px]" />
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("projectCard.github")} — ${project.title}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-all duration-300 ease-signature hover:border-accent-line hover:text-accent-bright md:h-[30px] md:w-[30px]"
              >
                <Github className="h-[13px] w-[13px]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
