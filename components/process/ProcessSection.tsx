"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/content";

export default function ProcessSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, restDelta: 0.001 });

  return (
    <section
      id="process"
      className="relative overflow-hidden border-t border-border bg-gradient-to-b from-forest via-bg to-midnight py-[150px]"
    >
      <div className="wrap relative">
        <SectionHeading
          title={
            <>
              How I
              <br />
              Work.
            </>
          }
          description="The same seven-stage process behind every project on this page, from first call to post-launch iteration."
        />

        <div ref={trackRef} className="relative pl-[2px]">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-border">
            <motion.div
              className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-aurora to-dusty"
              style={{ scaleY: progress, height: "100%" }}
            />
          </div>

          {processSteps.map((step) => (
            <div
              key={step.num}
              className="grid grid-cols-1 gap-2 border-t border-border py-[34px] pl-8 last:border-b sm:grid-cols-[110px_1fr] sm:gap-[30px] sm:pl-10"
            >
              <div className="font-serif text-[34px] text-text-faint">{step.num}</div>
              <div>
                <h3 className="mb-2 font-serif text-[22px] font-medium">{step.title}</h3>
                <p className="max-w-[520px] text-[14.5px] text-text-dim">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
