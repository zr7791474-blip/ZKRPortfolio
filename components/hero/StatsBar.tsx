import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import { heroStats } from "@/data/content";

export default function StatsBar() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto grid max-w-wrap grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {heroStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.06} className="px-6 py-7 md:px-10 md:py-11">
            <div>
              {stat.isNumber ? (
                <div className="font-serif text-[44px] text-accent">
                  <Counter target={Number(stat.value)} />
                </div>
              ) : (
                <div className="pt-[10px] font-serif text-[26px] text-accent">{stat.value}</div>
              )}
              <div className="mt-2 text-[13px] text-text-dim">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
