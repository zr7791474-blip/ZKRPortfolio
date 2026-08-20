"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

/**
 * Renders one translated string inline, so a server component (e.g. the
 * statically-generated /work/[slug] page) can stay a server component while
 * still showing localized chrome labels like "Back to work" or "Screenshots".
 */
export default function T({ k, vars }: { k: string; vars?: Record<string, string> }) {
  const { t } = useTranslation();
  return <>{t(k, vars)}</>;
}
