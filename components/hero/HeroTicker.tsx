import { siteConfig } from "@/lib/site";

const items = [
  "FULL-STACK DEVELOPER",
  "SOFTWARE ENGINEER",
  "DIGITAL PRODUCT BUILDER",
  "PRODUCTION-READY SYSTEMS",
  (siteConfig.location || "CASABLANCA, MOROCCO").toUpperCase(),
  "AVAILABLE FOR SELECTED PROJECTS",
];

export default function HeroTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="group relative overflow-hidden border-t border-border bg-bg/40 backdrop-blur-sm">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap py-4 [animation-duration:34s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[.16em] text-text-dim">
            {item}
            <span className="h-[5px] w-[5px] rounded-full bg-accent/60" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
