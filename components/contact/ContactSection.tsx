"use client";

import { Mail, Github, Twitter, MessageCircle, Instagram } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";
import CopyEmailButton from "./CopyEmailButton";
import { siteConfig, mailtoHref } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ContactSection() {
  const { t } = useTranslation();
  const emailHref = siteConfig.email
    ? mailtoHref({
        email: siteConfig.email,
        subject: "Project Inquiry",
        body: "Hello Zakaria,\n\nI would like to contact you regarding...",
      })
    : "#contact";

  const socials = [
    { label: "GitHub", href: siteConfig.githubUrl, icon: Github },
    { label: "X / Twitter", href: siteConfig.xUrl, icon: Twitter },
    { label: "Instagram", href: siteConfig.instagramUrl, icon: Instagram },
    { label: "WhatsApp", href: siteConfig.whatsappUrl, icon: MessageCircle },
  ].filter((s) => s.href);

  return (
    <section id="contact" className="tone-inverse relative overflow-hidden border-t border-border py-24 md:py-[150px]">
      <div className="wrap relative grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* LEFT — headline, positioning, direct contact */}
        <Reveal className="lg:sticky lg:top-[140px] lg:self-start">
          <div className="eyebrow">{t("contact.eyebrow")}</div>
          <h2 className="max-w-[520px] font-serif text-[clamp(38px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em]">
            {t("contact.headlinePre")}
            <em className="italic text-accent">{t("contact.headlineEm")}</em>
            {t("contact.headlinePost")}
          </h2>
          <p className="mt-6 max-w-[440px] text-[16px] text-text-dim">
            {t("contact.paragraph")}
          </p>

          <div className="mt-8 flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[.1em] text-accent">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="absolute inset-0 rounded-full bg-brand" />
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-brand" />
            </span>
            {t("contact.availability")}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[.08em] text-text-faint">
              {t("contact.direct")}
            </div>
            <a
              href={emailHref}
              data-cursor="OPEN"
              aria-label={siteConfig.email ? `Email ${siteConfig.email}` : "Email"}
              className="group flex min-h-[44px] items-center gap-3 break-all text-[16px] text-text transition-colors hover:text-accent-bright sm:break-normal sm:text-[17px]"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border-strong transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                <Mail className="h-4 w-4" />
              </span>
              {siteConfig.email || "Set NEXT_PUBLIC_CONTACT_EMAIL"}
            </a>
            {siteConfig.email && (
              <div className="mt-3 pl-[3px]">
                <CopyEmailButton email={siteConfig.email} />
              </div>
            )}
          </div>

          {socials.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border pt-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="OPEN"
                  className="flex min-h-[44px] items-center gap-2 font-mono text-[12px] uppercase tracking-[.06em] text-text-dim transition-colors hover:text-accent-bright"
                >
                  <s.icon className="h-[15px] w-[15px]" />
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </Reveal>

        {/* RIGHT — the project inquiry form */}
        <Reveal delay={0.1}>
          <div className="rounded-md border border-border bg-bg p-7 md:p-10">
            <div className="eyebrow mb-[26px]">{t("contact.projectInquiry")}</div>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
