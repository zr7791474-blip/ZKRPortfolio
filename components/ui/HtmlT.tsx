"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

/**
 * Like T, but for the handful of translated strings that carry inline
 * <strong>/<em> markup authored directly in the dictionary (About section
 * body copy, the Contact headline emphasis). All content is developer-authored
 * (not user input), so this is safe.
 */
export default function HtmlT({
  k,
  vars,
  as: Tag = "span",
  className,
}: {
  k: string;
  vars?: Record<string, string>;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const { t } = useTranslation();
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: t(k, vars) }} />;
}
