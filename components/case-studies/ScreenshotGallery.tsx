"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import type { Project } from "@/data/projects";

/**
 * Screenshot gallery with a fullscreen lightbox. Images are never
 * stretched — object-fit: contain in the lightbox, cover (with a fixed
 * aspect box) in the grid — and a placeholder caption only shows up while
 * `isPlaceholder` is true, so it disappears automatically once real
 * screenshots are dropped in.
 */
export default function ScreenshotGallery({ project }: { project: Project }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? project.screenshots[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {project.screenshots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => setActiveIndex(i)}
            data-cursor="VIEW"
            className="group relative overflow-hidden rounded-md border border-border bg-surface text-left focus-ring"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-signature group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-bg/0 opacity-0 transition-all duration-400 group-hover:bg-bg/30 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5 text-text" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[.08em] text-text-dim">{shot.label}</span>
              {shot.isPlaceholder && (
                <span className="font-mono text-[9.5px] uppercase tracking-[.06em] text-text-faint">Placeholder</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-bg/95 p-6 backdrop-blur-sm"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActiveIndex(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text-dim transition-colors hover:text-text focus-ring"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border">
                <Image src={active.src} alt={active.alt} fill sizes="90vw" className="object-contain" />
              </div>
              <p className="mt-4 text-center font-mono text-xs uppercase tracking-[.08em] text-text-faint">
                {active.label}
                {active.isPlaceholder ? " — placeholder, swap the file in /public" + active.src : ""}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
