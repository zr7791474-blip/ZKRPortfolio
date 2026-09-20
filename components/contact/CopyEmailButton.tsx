"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function CopyEmailButton({ email }: { email: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — fail silently,
      // the tile itself is still a working mailto link.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      // Polite live announcement of the "copied" state for screen readers
      aria-live="polite"
      className="inline-flex min-h-[44px] items-center gap-[6px] border-b border-dashed border-border-strong pb-[2px] font-mono text-[11px] text-text-faint transition-colors hover:text-accent"
    >
      {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
      <span className={copied ? "text-accent" : ""}>{copied ? t("contact.copied") : t("contact.copyEmail")}</span>
    </button>
  );
}
