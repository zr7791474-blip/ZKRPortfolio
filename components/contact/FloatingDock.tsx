"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Github, Twitter, Instagram, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig, mailtoHref } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function FloatingDock() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setVisible(y > 500);
        if (window.innerWidth <= 700) {
          setHideOnScroll(y > lastY.current && y > 600);
        } else {
          setHideOnScroll(false);
        }
        lastY.current = y;
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const emailHref = siteConfig.email
    ? mailtoHref({
        email: siteConfig.email,
        subject: "Project Inquiry",
        body: "Hello Zakaria,\n\nI would like to contact you regarding...",
      })
    : "#contact";

  const items = [
    { label: t("footer.email"), icon: Mail, href: emailHref, external: false },
    { label: "GitHub", icon: Github, href: siteConfig.githubUrl || "#contact", external: true },
    { label: "X / Twitter", icon: Twitter, href: siteConfig.xUrl || "#contact", external: true },
    { label: "Instagram", icon: Instagram, href: siteConfig.instagramUrl || "#contact", external: true },
    { label: "WhatsApp", icon: MessageCircle, href: siteConfig.whatsappUrl || "#contact", external: true },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-7 right-7 z-[900] flex flex-col items-end gap-[10px] opacity-0 transition-all duration-500 ease-signature",
        "max-md:inset-x-3.5 max-md:bottom-3.5 max-md:right-auto max-md:items-stretch",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-5",
        hideOnScroll && "max-md:translate-y-[120%]"
      )}
    >
      <div className="flex items-center gap-[6px] rounded-full border border-border-strong bg-surface/75 p-2 backdrop-blur-xl backdrop-saturate-150 max-md:w-full max-md:justify-around max-md:rounded-[20px]">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-label={item.label}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-text-dim transition-all duration-[350ms] ease-signature hover:-translate-y-[3px] hover:bg-accent-soft hover:text-accent-bright max-md:h-[46px] max-md:w-full"
          >
            <item.icon className="h-[17px] w-[17px]" />
          </a>
        ))}
      </div>
    </div>
  );
}
