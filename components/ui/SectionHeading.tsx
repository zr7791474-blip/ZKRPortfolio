import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHeading({
  title,
  description,
}: {
  title: ReactNode;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 md:mb-[70px] flex flex-col items-start justify-between gap-[18px] md:flex-row md:items-end md:gap-10">
        <h2 className="font-serif text-[clamp(32px,4.4vw,54px)] leading-[1.05] tracking-[-0.02em]">
          {title}
        </h2>
        {description && <p className="max-w-[360px] text-[15px] text-text-dim">{description}</p>}
      </div>
    </Reveal>
  );
}
