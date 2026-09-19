import type { Project } from "@/data/projects";
import { cn, readableAccent } from "@/lib/utils";

export default function CaseStudyContent({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-6", compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-2")}>
      {project.caseStudy.map((section) => (
        <div key={section.heading}>
          <h4 className="mb-[10px] text-xs font-medium uppercase tracking-[.06em]" style={{ color: readableAccent(project.accent.hex) }}>
            {section.heading}
          </h4>
          <p className="text-[13.5px] leading-relaxed text-text-dim">{section.body}</p>
        </div>
      ))}
    </div>
  );
}
