"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const VISIBLE_TAG_COUNT = 3;

/** Verified technologies when known, otherwise the product's real visible capabilities — never guessed. */
function tagsFor(project: Project): { tags: string[]; extra: number } {
  const source = project.technologies.length > 0 ? project.technologies : (project.highlights ?? []);
  return { tags: source.slice(0, VISIBLE_TAG_COUNT), extra: Math.max(0, source.length - VISIBLE_TAG_COUNT) };
}

function ExternalActions({ project, className = "" }: { project: Project; className?: string }) {
  const { t } = useTranslation();
  const base =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors duration-300 hover:border-accent hover:text-accent md:h-[32px] md:w-[32px]";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("projectCard.liveDemo")} — ${project.title}`}
          className={`${base} hover:!bg-accent hover:!text-bg`}
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
          className={base}
        >
          <Github className="h-[13px] w-[13px]" aria-hidden />
        </a>
      )}
    </div>
  );
}

/**
 * Featured project card — used for the top of the portfolio. Cover, project name, one-line
 * tagline, up to three technologies (or real highlights) and the actions. The longer description
 * lives on the case-study page.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots[0];
  const { t } = useTranslation();
  const { tags, extra } = tagsFor(project);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-md border border-border-strong bg-surface transition-[transform,border-color] duration-300 ease-signature hover:-translate-y-1 hover:border-brand motion-reduce:hover:translate-y-0">
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
      </Link>

      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[.1em] text-accent">{project.title}</div>
        <Link href={`/work/${project.slug}`}>
          <h3 className="line-clamp-2 min-h-[54px] font-serif text-[22px] leading-[1.2] tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
            {project.tagline}
          </h3>
        </Link>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-[6px]">
            {tags.map((tag) => (
              <span key={tag} className="tech-badge !px-[10px] !py-[5px] !text-[10.5px]">
                {tag}
              </span>
            ))}
            {extra > 0 && <span className="tech-badge !px-[10px] !py-[5px] !text-[10.5px] !text-text-faint">+{extra}</span>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
          <Link
            href={`/work/${project.slug}`}
            className="-my-[14px] inline-flex items-center gap-[6px] py-[14px] font-mono text-[11px] tracking-[.06em] text-text-dim transition-colors duration-300 hover:text-accent"
          >
            {t("projectCard.caseStudy")}
            <ArrowUpRight className="h-[12px] w-[12px] transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] motion-reduce:transform-none" aria-hidden />
          </Link>
          <ExternalActions project={project} />
        </div>
      </div>
    </div>
  );
}

/**
 * Compact row — used for the remaining projects below the featured grid. The whole row is one
 * link to the case study (stretched link); the external actions sit above it so they stay clickable.
 */
export function ProjectRow({ project }: { project: Project }) {
  const cover = project.screenshots[0];
  const { t } = useTranslation();
  const { tags } = tagsFor(project);

  return (
    <li className="group relative grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3 min-[400px]:grid-cols-[104px_minmax(0,1fr)] min-[400px]:gap-4 border-t border-border py-4 transition-colors duration-300 hover:bg-surface sm:grid-cols-[148px_minmax(0,1fr)_auto] sm:gap-6 sm:px-3 sm:py-5">
      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} — ${t("projectCard.caseStudy")}`}
        className="absolute inset-0 focus-visible:outline-offset-[-3px]"
      />
      <div className="pointer-events-none relative aspect-[16/10] overflow-hidden rounded-sm border border-border bg-surface-2">
        {cover && <SafeImage src={cover.src} alt="" fill sizes="148px" className="object-cover object-top" />}
      </div>
      <div className="pointer-events-none min-w-0">
        <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[.1em] text-accent">{project.title}</div>
        <h3 className="line-clamp-3 font-serif text-[16px] leading-[1.25] transition-colors duration-300 group-hover:text-accent min-[400px]:text-[17px] sm:line-clamp-2 sm:text-[19px]">
          {project.tagline}
        </h3>
        {tags.length > 0 && (
          <div className="mt-2 hidden flex-wrap gap-[6px] md:flex">
            {tags.map((tag) => (
              <span key={tag} className="tech-badge !px-[9px] !py-[3px] !text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="relative z-10 flex items-center gap-2">
        <ExternalActions project={project} className="hidden sm:flex" />
        <ArrowUpRight
          className="pointer-events-none hidden h-[14px] w-[14px] text-text-faint transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-accent sm:block motion-reduce:transform-none"
          aria-hidden
        />
      </div>
    </li>
  );
}
