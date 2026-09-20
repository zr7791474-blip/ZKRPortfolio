"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

type ContactTileProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  external?: boolean;
  badge?: ReactNode;
  extraContent?: ReactNode;
};

/**
 * The whole card is clickable via a "stretched link" (an absolutely
 * positioned <a> covering the tile) so any nested interactive control
 * (e.g. the email copy button) stays valid, unnested HTML.
 */
export default function ContactTile({
  icon,
  title,
  description,
  href,
  actionLabel,
  external = true,
  badge,
  extraContent,
}: ContactTileProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden bg-surface p-9 transition-colors duration-[400ms] hover:bg-surface-3"
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener" : undefined}
        data-cursor="OPEN"
        className="absolute inset-0 z-[1] focus-ring"
        aria-label={`${title} — ${actionLabel}`}
      />

      {badge}

      <div className="pointer-events-none mb-[26px] flex items-start justify-between">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-border-strong transition-ui duration-[400ms] ease-signature group-hover:scale-[1.08] group-hover:border-accent group-hover:text-accent">
          {icon}
        </div>
      </div>
      <h3 className="pointer-events-none mb-2 font-serif text-[26px] font-medium">{title}</h3>
      <p className="pointer-events-none mb-5 text-[13.5px] text-text-dim">{description}</p>
      <div className="pointer-events-none flex items-center gap-[10px] font-mono text-xs text-text">
        {actionLabel}
        <ArrowUpRight className="h-[13px] w-[13px] transition-transform duration-[400ms] ease-signature group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
      </div>

      {extraContent && <div className="relative z-[2] mt-3">{extraContent}</div>}
    </div>
  );
}
