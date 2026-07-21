"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { skillGroups } from "@/data/content";

export default function SkillsSection() {
  return (
    <section id="skills" className="relative overflow-hidden border-t border-border bg-midnight py-[150px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-0 h-[60%] w-[50%]"
        style={{ background: "radial-gradient(ellipse, rgba(143,174,106,0.10) 0%, transparent 70%)" }}
      />
      <div className="wrap relative">
        <SectionHeading
          title={
            <>
              Technical
              <br />
              Toolkit.
            </>
          }
          description="Only technologies actually used and shipped across ZKR Company, ZKR Ecommerce, ZKR Eclipse, and ZKR Estate."
        />
      </div>

      <div className="wrap">
        {/* connecting trace tying the toolkit to the same schematic language as the project panels */}
        <svg aria-hidden viewBox="0 0 900 40" className="mb-[-1px] hidden w-full opacity-40 md:block">
          <motion.path
            d="M150 20 H750"
            fill="none"
            stroke="#cda05a"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {[150, 450, 750].map((x, i) => (
            <motion.circle
              key={x}
              cx={x}
              cy={20}
              r={3}
              fill="#cda05a"
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            />
          ))}
        </svg>

        <Reveal className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.title} className="group bg-bg p-9 transition-colors duration-500 hover:bg-surface">
              <h3 className="mb-[22px] font-mono text-xs uppercase tracking-[.1em] text-accent">{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between border-t border-border py-[11px] text-[14.5px] transition-[padding] duration-300 first:border-t-0 hover:pl-[6px]"
                  >
                    <span>{item.name}</span>
                    <span className="font-mono text-[10px] text-text-faint">{item.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
