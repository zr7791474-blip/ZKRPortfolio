import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section id="work" className="py-[150px] md:py-[150px]">
      <div className="wrap">
        <SectionHeading
          title={
            <>
              Selected
              <br />
              Work.
            </>
          }
          description="Ten complete products — agency and business sites, a commerce platform, a SaaS dashboard, a real-estate marketplace, a task-management tool, and a handful of brand/event/storefront concepts. Each one built end-to-end, not styled mockups."
        />
      </div>

      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </section>
  );
}
