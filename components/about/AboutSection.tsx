import Reveal from "@/components/ui/Reveal";

/**
 * Deliberately breaks from the dark theme — a warm, editorial "paper" moment
 * that gives the eye a rest between the hero/projects and the darker
 * skills/process/contact sections, per the site's color-rhythm system.
 */
export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream py-[150px] text-cream-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-0 h-[70%] w-[50%]"
        style={{ background: "radial-gradient(ellipse, rgba(74,93,78,0.14) 0%, transparent 70%)" }}
      />
      <div className="wrap relative grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <Reveal>
          <div className="mb-[18px] flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[.18em] text-pine">
            <span className="h-px w-5 bg-pine/50" />
            About
          </div>
          <p className="font-serif text-[clamp(24px,2.6vw,32px)] leading-[1.35] tracking-[-0.01em]">
            I like taking a system apart until I understand{" "}
            <em className="font-serif italic text-burgundy">why</em> it works — then
            building the version that solves the actual problem.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5">
          <p className="max-w-[560px] text-[15.5px] text-cream-ink/75">
            I&rsquo;m <strong className="font-medium text-cream-ink">Zakaria Adli</strong>, a
            full-stack developer based in Morocco, working under the name{" "}
            <strong className="font-medium text-cream-ink">ZKR</strong>. My work spans the
            full stack of a real product: frontend interfaces people actually enjoy
            using, backend logic that holds up under real data, and the database
            design that everything else depends on.
          </p>
          <p className="max-w-[560px] text-[15.5px] text-cream-ink/75">
            What ties the ten projects on this page together isn&rsquo;t a shared
            visual style — it&rsquo;s the same habit of thinking in{" "}
            <strong className="font-medium text-cream-ink">systems</strong>. An e-commerce
            checkout is a system of roles, states, and edge cases. A dashboard is a
            system of tokens and reusable parts. A real-estate marketplace is a
            system of permissions between three different kinds of users. I design
            the system first, then the interface on top of it.
          </p>
          <p className="max-w-[560px] text-[15.5px] text-cream-ink/75">
            I care about <strong className="font-medium text-cream-ink">product thinking</strong>{" "}
            as much as code — features marked &ldquo;coming soon&rdquo; instead of
            faked, admin numbers computed from real data instead of hardcoded, and
            every navigation link pointing somewhere real. That standard is what I
            bring to client work.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
