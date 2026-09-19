"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * `next/image` (fill mode) that degrades to a neutral surface panel when the file
 * is missing or fails to load, instead of showing a broken-image icon.
 *
 * Nothing is drawn or invented for the missing picture — the panel is just the
 * card surface colour, keeping the layout intact until the real file is added.
 *
 * Two failure timings are covered: an `error` event after hydration (onError) and
 * an image that already failed before React attached its handler
 * (complete && naturalWidth === 0, checked on mount).
 */
export default function SafeImage({ alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return <div role="img" aria-label={alt} data-image-fallback className="absolute inset-0 bg-surface-2" />;
  }

  return <Image ref={ref} alt={alt} onError={() => setFailed(true)} {...props} />;
}
