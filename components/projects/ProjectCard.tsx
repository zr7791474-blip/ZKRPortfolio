"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Project } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import SchematicPanel from "./SchematicPanel";
import CaseStudyContent from "@/components/case-studies/CaseStudyContent";

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const mirrored = Number(project.index) % 2 === 0;
  const cover = project.screenshots[0];

  return (
    <section
      id={`project-${project.slug}`}
      className="relative overflow-hidden border-t border-border py-16 last:border-b md:py-20"
      style={{
        background: `linear-gradient(180deg, ${project.accent.soft}, ${project.accent.moodVia}22 55%, transparent 85%)`,
      }}
    >
      {/* oversized ghost index number — the shared archive motif, unique position/scale per project */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 select-none font-serif text-[220px] font-medium leading-none opacity-[0.05] md:text-[320px]"
        style={{ [mirrored ? "right" : "left"]: "-2%", color: project.accent.hex }}
      >
        {project.index}
      </span>

      <div className="wrap relative">
        <Reveal
          className="grid grid-cols-1 gap-9 md:grid-cols-[0.9fr_1.1fr] md:gap-[70px]"
        >
          <div className={mirrored ? "md:order-2" : undefined}>
            <div className="mb-5 font-mono text-xs" style={{ color: project.accent.hex }}>
              {project.index} / 04 — {project.title.toUpperCase()}
            </div>
            <h3 className="font-serif text-[clamp(30px,3.6vw,46px)] tracking-[-0.02em]">{project.tagline}</h3>
            <div className="mb-3 mt-[10px] text-sm font-medium" style={{ color: project.accent.hex }}>
              {project.category}
            </div>
            <p className="mb-6 max-w-[420px] font-serif text-[19px] italic text-text-dim">
              &ldquo;{project.statement}&rdquo;
            </p>
            <p className="mb-7 max-w-[420px] text-[15.5px] text-text-dim">{project.description}</p>

            <div className="mb-8 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-[14px]">
              <Magnetic
                as="a"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="OPEN"
                className="btn btn-primary !px-5 !py-3 text-[13px]"
              >
                Live Demo <ArrowUpRight className="h-[15px] w-[15px]" />
              </Magnetic>
              <Magnetic
                as="a"
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost !px-5 !py-3 text-[13px]"
              >
                GitHub
              </Magnetic>
              <Link href={`/work/${project.slug}`} data-cursor="EXPLORE" className="btn btn-ghost !px-5 !py-3 text-[13px]">
                Case Study <ArrowUpRight className="h-[15px] w-[15px]" />
              </Link>
            </div>
          </div>

          <div className={mirrored ? "md:order-1" : undefined}>
            {cover && (
              <Link
                href={`/work/${project.slug}`}
                data-cursor="EXPLORE"
                className="group relative mb-6 block aspect-[16/10] w-full overflow-hidden rounded-md border border-border"
              >
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-signature group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-bg/80 to-transparent px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[.1em] text-text-dim">{cover.label}</span>
                  {cover.isPlaceholder && (
                    <span className="font-mono text-[9px] uppercase tracking-[.06em] text-text-faint">Placeholder</span>
                  )}
                </div>
              </Link>
            )}

            <SchematicPanel project={project} />

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-[26px] flex w-full items-center gap-[10px] border-t border-border pt-5 font-mono text-[11.5px] tracking-[.06em] text-text-faint transition-colors hover:text-text"
            >
              <ChevronDown
                className="h-[13px] w-[13px] transition-transform duration-[400ms] ease-signature"
                style={{ transform: open ? "rotate(180deg)" : "none" }}
              />
              {open ? "Hide case study preview" : "View case study preview"}
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6">
                    <CaseStudyContent project={project} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
