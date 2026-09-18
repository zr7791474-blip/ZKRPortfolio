"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  wordmarkClassName?: string;
  size?: number;
  showWordmark?: boolean;
};

/**
 * Single source of truth for the ZKR mark across the site (nav, loader,
 * footer, ZKR assistant, favicon). Backed by /public/logo/zkr.jpg, the
 * official ZKR brand asset — falls back to the "ZKR•" text wordmark if
 * that file isn't present in this environment.
 */
export default function Logo({
  className,
  imageClassName,
  wordmarkClassName,
  size = 34,
  showWordmark = true,
}: LogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span className={cn("flex items-center gap-[10px]", className)}>
      {!imgFailed && (
        <span
          className={cn("relative overflow-hidden rounded-full border border-border-strong", imageClassName)}
          style={{ width: size, height: size }}
        >
          <Image
            src="/logo/zkr.jpg"
            alt="ZKR"
            fill
            sizes={`${size}px`}
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        </span>
      )}
      {(imgFailed || showWordmark) && (
        <span
          className={cn(
            "flex items-center gap-2 font-serif text-[22px] font-semibold tracking-[-0.02em]",
            wordmarkClassName
          )}
        >
          ZKR
          <span className="h-[6px] w-[6px] rounded-full bg-accent" />
        </span>
      )}
    </span>
  );
}
