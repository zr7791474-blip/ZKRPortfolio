"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, locales, type Locale } from "./dictionaries";

const STORAGE_KEY = "zkr-locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Dot-path lookup, e.g. t("nav.work"). Falls back to the key itself if missing. */
  t: (path: string, vars?: Record<string, string>) => string;
  /** Same as t(), but for dictionary entries that are string arrays (e.g. form option lists). */
  tList: (path: string) => string[];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getFromDictionary(locale: Locale, path: string): unknown {
  const parts = path.split(".");
  let node: unknown = dictionaries[locale];
  for (const part of parts) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

function interpolate(str: string, vars?: Record<string, string>): string {
  if (!vars) return str;
  return Object.entries(vars).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, value), str);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && locales.includes(stored)) {
        setLocaleState(stored);
        return;
      }
      const browserLang = window.navigator.language.slice(0, 2);
      if (locales.includes(browserLang as Locale)) {
        setLocaleState(browserLang as Locale);
      }
    } catch {
      // localStorage unavailable — stay on default "en"
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures (private browsing, etc.)
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  function t(path: string, vars?: Record<string, string>): string {
    const value = getFromDictionary(locale, path);
    if (typeof value === "string") return interpolate(value, vars);
    const fallback = getFromDictionary("en", path);
    if (typeof fallback === "string") return interpolate(fallback, vars);
    return path;
  }

  function tList(path: string): string[] {
    const value = getFromDictionary(locale, path);
    if (Array.isArray(value)) return value as string[];
    const fallback = getFromDictionary("en", path);
    if (Array.isArray(fallback)) return fallback as string[];
    return [];
  }

  return <LanguageContext.Provider value={{ locale, setLocale, t, tList }}>{children}</LanguageContext.Provider>;
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
