"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

/** Themed, localized 404 (Next's built-in 404 is a fixed white page that ignores light/dark). */
export default function NotFoundView() {
  const { t } = useTranslation();
  return (
    <main className="wrap flex min-h-[80vh] flex-col items-start justify-center py-40">
      <div className="eyebrow">404</div>
      <h1 className="max-w-3xl font-serif text-[clamp(36px,6vw,72px)] tracking-[-0.02em]">{t("notFound.title")}</h1>
      <p className="mt-4 max-w-md text-[16px] text-text-dim">{t("notFound.body")}</p>
      <Link href="/" className="btn btn-primary mt-9">
        {t("notFound.back")}
      </Link>
    </main>
  );
}
