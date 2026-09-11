"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import { mailtoHref, siteConfig } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type FieldErrors = Partial<Record<"name" | "email" | "projectType" | "message", string>>;
type Status = "idle" | "loading" | "success" | "success-mailto" | "error";

// Shared field-row spacing — one place to tune the whole form's rhythm.
const ROW_GAP = "gap-5";
const inputClasses =
  "w-full border-0 border-b border-border-strong bg-transparent px-[2px] py-[9px] text-[15px] text-text transition-colors focus-ring focus:border-accent focus:outline-none";
const labelClasses = "font-mono text-[11px] uppercase tracking-[.06em] text-text-faint";
const errorClasses = "min-h-[14px] text-[11.5px] text-[#d97757]";

export default function ContactForm() {
  const { t, tList } = useTranslation();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  const projectTypes = tList("contactForm.projectTypes");
  const budgets = tList("contactForm.budgets");

  function validate(data: FormData): FieldErrors {
    const next: FieldErrors = {};
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const projectType = String(data.get("projectType") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name) next.name = t("contactForm.errorName");
    if (!email || !isValidEmail(email)) next.email = t("contactForm.errorEmail");
    if (!projectType) next.projectType = t("contactForm.errorProjectType");
    if (!message || message.length < 10) next.message = t("contactForm.errorMessage");
    return next;
  }

  function fallbackToMailto(data: FormData) {
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const company = String(data.get("company") || "");
    const projectType = String(data.get("projectType") || "");
    const budget = String(data.get("budget") || "");
    const message = String(data.get("message") || "");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      company && `Company: ${company}`,
      `Project type: ${projectType}`,
      budget && `Budget: ${budget}`,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = mailtoHref({
      email: siteConfig.email,
      subject: `Project Inquiry — ${projectType}`,
      body,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const fieldErrors = validate(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const fieldIdByName: Record<keyof FieldErrors, string> = {
        name: "f-name",
        email: "f-email",
        projectType: "f-type",
        message: "f-message",
      };
      const firstInvalid = (Object.keys(fieldErrors) as Array<keyof FieldErrors>)[0];
      if (firstInvalid) {
        form.querySelector<HTMLElement>(`#${fieldIdByName[firstInvalid]}`)?.focus();
      }
      return;
    }

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          projectType: data.get("projectType"),
          budget: data.get("budget"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const payload = await res.json().catch(() => null);
      if (payload?.fallback === "mailto") {
        fallbackToMailto(data);
        setStatus("success-mailto");
        return;
      }

      setServerError(payload?.error || t("contactForm.genericError"));
      setStatus("error");
    } catch {
      // Network failure — still offer the mailto fallback rather than a dead end.
      fallbackToMailto(data);
      setStatus("success-mailto");
    }
  }

  if (status === "success" || status === "success-mailto") {
    return (
      <div className="px-2 py-[50px] text-center">
        <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-sage text-sage">
          <Check className="h-[22px] w-[22px]" />
        </div>
        <h3 className="mb-[10px] font-serif text-2xl">
          {status === "success" ? t("contactForm.successTitle") : t("contactForm.successMailtoTitle")}
        </h3>
        <p className="text-sm text-text-dim">
          {status === "success" ? t("contactForm.successBody") : t("contactForm.successMailtoBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`flex flex-col ${ROW_GAP}`}>
      <div className={`grid grid-cols-1 ${ROW_GAP} sm:grid-cols-2`}>
        <Field id="f-name" name="name" label={t("contactForm.nameLabel")} autoComplete="name" required error={errors.name} />
        <Field
          id="f-email"
          name="email"
          label={t("contactForm.emailLabel")}
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
      </div>

      <div className={`grid grid-cols-1 ${ROW_GAP} sm:grid-cols-2`}>
        <Field id="f-company" name="company" label={t("contactForm.companyLabel")} autoComplete="organization" />
        <SelectField
          id="f-type"
          name="projectType"
          label={t("contactForm.projectTypeLabel")}
          required
          error={errors.projectType}
        >
          <option value="">{t("contactForm.selectOne")}</option>
          {projectTypes.map((pt) => (
            <option key={pt}>{pt}</option>
          ))}
        </SelectField>
      </div>

      <SelectField id="f-budget" name="budget" label={t("contactForm.budgetLabel")}>
        <option value="">{t("contactForm.selectBudget")}</option>
        {budgets.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </SelectField>

      <div className="flex flex-col gap-2">
        <label htmlFor="f-message" className={labelClasses}>
          {t("contactForm.messageLabel")}
        </label>
        <textarea
          id="f-message"
          name="message"
          required
          rows={4}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "f-message-error" : undefined}
          className={`${inputClasses} min-h-[100px] resize-y`}
        />
        <span id="f-message-error" className={errorClasses} aria-live="polite">
          {errors.message}
        </span>
      </div>

      {status === "error" && (
        <p className="text-[13px] text-[#d97757]" role="alert">
          {serverError}
        </p>
      )}

      <div className="mt-1 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[320px] text-xs text-text-faint">
          {t("contactForm.disclaimer", { email: siteConfig.email || "the site owner" })}
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn shrink-0 border-accent-line text-accent-bright hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-[15px] w-[15px] animate-spin" />
          ) : (
            <ArrowUpRight className="h-[15px] w-[15px]" />
          )}
          <span>{status === "loading" ? t("contactForm.sending") : t("contactForm.send")}</span>
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClasses}
      />
      <span id={errorId} className={errorClasses} aria-live="polite">
        {error}
      </span>
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  required,
  error,
  children,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClasses}
      >
        {children}
      </select>
      <span id={errorId} className={errorClasses} aria-live="polite">
        {error}
      </span>
    </div>
  );
}
