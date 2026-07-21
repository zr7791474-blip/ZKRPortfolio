"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/data/content";

export default function ServicesSection() {
  return (
    <section id="services" className="border-t border-border py-[150px]">
      <div className="wrap">
        <SectionHeading
          title={
            <>
              What I
              <br />
              Solve.
            </>
          }
          description="Services framed around the business problem, not the tech stack behind it."
        />

        <Reveal className="border-t border-border">
          {services.map((service) => (
            <motion.div
              key={service.num}
              whileHover={{ paddingLeft: 14 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[40px_1fr] items-center gap-6 border-b border-border py-7 md:grid-cols-[60px_1fr_auto] md:gap-[30px]"
            >
              <span className="font-mono text-[13px] text-text-faint">{service.num}</span>
              <div>
                <h3 className="font-serif text-2xl font-medium">{service.title}</h3>
                <p className="mt-[6px] max-w-[520px] text-[13.5px] text-text-dim">{service.description}</p>
              </div>
              <div className="hidden h-[34px] w-[34px] items-center justify-center rounded-full border border-border-strong transition-all duration-[400ms] ease-signature group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-bg md:flex">
                <ArrowUpRight className="h-[14px] w-[14px]" />
              </div>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
