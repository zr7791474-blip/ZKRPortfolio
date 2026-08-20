"use client";

import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const statKeys = ["projects", "stack", "production", "endToEnd"] as const;
const isNumber: Record<(typeof statKeys)[number], boolean> = {
  projects: true,
  stack: false,
  production: false,
  endToEnd: false,
};

export default function StatsBar() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-border">
      <div className="mx-auto grid max-w-wrap grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {statKeys.map((key, i) => {
          const value = t(`statsBar.${key}.value`);
          const label = t(`statsBar.${key}.label`);
          return (
            <Reveal key={key} delay={i * 0.06} className="px-6 py-7 md:px-10 md:py-11">
              <div>
                {isNumber[key] ? (
                  <div className="font-serif text-[44px] text-accent">
                    <Counter target={Number(value)} />
                  </div>
                ) : (
                  <div className="pt-[10px] font-serif text-[26px] text-accent">{value}</div>
                )}
                <div className="mt-2 text-[13px] text-text-dim">{label}</div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
