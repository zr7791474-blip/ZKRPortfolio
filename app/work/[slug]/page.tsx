import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProjectBySlug } from "@/data/projects";
import CaseStudyContent from "@/components/case-studies/CaseStudyContent";
import ScreenshotGallery from "@/components/case-studies/ScreenshotGallery";
import SchematicPanel from "@/components/projects/SchematicPanel";
import Reveal from "@/components/ui/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study — ZKR`,
    description: project.description,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <main className="pt-[140px]">
      <div className="wrap">
        <Link
          href="/#work"
          className="mb-10 inline-flex items-center gap-2 font-mono text-xs text-text-faint transition-colors hover:text-text"
        >
          <ArrowLeft className="h-[14px] w-[14px]" /> Back to work
        </Link>

        <Reveal>
          <div className="mb-3 font-mono text-xs" style={{ color: project.accent.hex }}>
            {project.index} / 04 — {project.title.toUpperCase()}
          </div>
          <h1 className="max-w-3xl font-serif text-[clamp(36px,6vw,72px)] tracking-[-0.02em]">
            {project.tagline}
          </h1>
          <p className="mt-4 text-lg" style={{ color: project.accent.hex }}>
            {project.category}
          </p>
          <p className="mt-6 max-w-xl text-[16px] text-text-dim">{project.description}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span key={t} className="tech-badge">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-[14px]">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live Demo <ArrowUpRight className="h-[15px] w-[15px]" />
            </a>
            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub
            </a>
          </div>
        </Reveal>
      </div>

      <div className="wrap mt-20">
        <Reveal>
          <h2 className="mb-6 font-serif text-2xl">Screenshots</h2>
          <ScreenshotGallery project={project} />
        </Reveal>
      </div>

      <div className="wrap mt-20 grid grid-cols-1 gap-12 pb-32 md:grid-cols-[1fr_1fr]">
        <Reveal>
          <h2 className="mb-6 font-serif text-2xl">System overview</h2>
          <SchematicPanel project={project} />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-6 font-serif text-2xl">Case study</h2>
          <CaseStudyContent project={project} />
        </Reveal>
      </div>
    </main>
  );
}
