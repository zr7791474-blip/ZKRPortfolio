import Hero from "@/components/hero/Hero";
import StatsBar from "@/components/hero/StatsBar";
import Marquee from "@/components/ui/Marquee";
import ProjectsSection from "@/components/projects/ProjectsSection";
import AboutSection from "@/components/about/AboutSection";
import SkillsSection from "@/components/skills/SkillsSection";
import ServicesSection from "@/components/services/ServicesSection";
import ProcessSection from "@/components/process/ProcessSection";
import ContactSection from "@/components/contact/ContactSection";
import { marqueeTech } from "@/data/content";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Marquee items={marqueeTech} />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
