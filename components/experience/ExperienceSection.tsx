"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { experience } from "@/data/profile";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ExperienceSection() {
  const { t } = useTranslation();

  return (
    <section id="experience" className="border-t border-border bg-midnight py-24 md:py-[150px]">
      <div className="wrap">
        <SectionHeading
          title={
            <>
              {t("experience.title1")}
              <br />
              {t("experience.title2")}
            </>
          }
          description={t("experience.description")}
        />

        <Reveal className="border-t border-border">
          {experience.map((item) => (
            <motion.div
              key={item.num}
              whileHover={{ paddingLeft: 14 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[40px_1fr] items-center gap-6 border-b border-border py-7 md:grid-cols-[60px_1fr] md:gap-[30px]"
            >
              <span className="font-mono text-[13px] text-text-faint">{item.num}</span>
              <div>
                <h3 className="font-serif text-2xl font-medium">{t(`experience.${item.num}.title`)}</h3>
                <p className="mt-[6px] max-w-[560px] text-[13.5px] text-text-dim">
                  {t(`experience.${item.num}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
