"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Send, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { answerQuestion, errorMessage, welcomeMessage, type AssistantLocale } from "@/lib/assistant/engine";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  /** Welcome messages are rendered from the CURRENT site language, so they follow a language switch. */
  kind?: "welcome";
  text?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

function localeToAssistantLocale(locale: string): AssistantLocale {
  if (locale === "fr" || locale === "es") return locale;
  return "en";
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}-${Date.now()}`;
}

export default function ZkrAssistant() {
  const { t, tList, locale } = useTranslation();
  const siteLocale = localeToAssistantLocale(locale);
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "welcome", role: "assistant", kind: "welcome" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const answerTimer = useRef<number | null>(null);

  const suggestions = tList("assistant.suggestions");

  const closePanel = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  // Escape, focus trap, outside-click, body scroll lock on mobile, focus the input on open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      const inside = panelRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }

    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      closePanel(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 150);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, closePanel]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, isTyping, reduceMotion]);

  useEffect(
    () => () => {
      if (answerTimer.current) window.clearTimeout(answerTimer.current);
    },
    []
  );

  function pushUserMessageAndAnswer(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: nextId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    answerTimer.current = window.setTimeout(
      () => {
        try {
          // The site language only breaks ties; the question's own language wins.
          const { text: answer } = answerQuestion(trimmed, siteLocale);
          setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: answer }]);
        } catch {
          setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: errorMessage(siteLocale) }]);
        } finally {
          setIsTyping(false);
        }
      },
      reduceMotion ? 120 : 420 + Math.random() * 260
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    pushUserMessageAndAnswer(input);
  }

  const showSuggestions = messages.length <= 1 && !isTyping;
  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        data-cursor={open ? "CLOSE" : "CHAT"}
        aria-label={open ? t("assistant.closeLabel") : t("assistant.openLabel")}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="zkr-assistant-panel"
        onClick={() => (open ? closePanel() : setOpen(true))}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "fixed z-[1300] flex items-center justify-center rounded-full border border-border-strong bg-surface/90 text-text shadow-[0_18px_38px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[opacity,border-color,background-color] duration-300 hover:border-accent-line",
          focusRing,
          // Mobile-first base sizing/position
          "bottom-24 right-4 h-[48px] w-[48px]",
          // Desktop (sm and up) sizing/position
          "sm:bottom-[104px] sm:right-7 sm:h-[52px] sm:w-[52px]",
          // On mobile the panel becomes a bottom sheet that would sit under this button, and the
          // sheet has its own close button — so hide the trigger on mobile only. `invisible`
          // (visibility:hidden) also removes it from the tab order and the accessibility tree,
          // unlike opacity alone. sm: forces it back on desktop, where it doubles as the toggle.
          open && "invisible opacity-0 sm:visible sm:opacity-100 [@media(max-height:520px)]:!invisible [@media(max-height:520px)]:!opacity-0"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center justify-center"
            >
              <X className="h-5 w-5" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="mark"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center justify-center"
            >
              <Logo showWordmark={false} size={30} imageClassName="!border-0" wordmarkClassName="!gap-[3px] !text-[12px]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile scrim — closes the panel on tap, keeps content underneath from scrolling/interacting */}
            <motion.div
              aria-hidden
              data-testid="assistant-scrim"
              onClick={() => closePanel()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[1290] bg-bg/70 backdrop-blur-sm sm:hidden"
            />

            <motion.div
              id="zkr-assistant-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${t("assistant.title")} — ${t("assistant.subtitle")}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "fixed z-[1295] flex flex-col overflow-hidden border border-border bg-surface shadow-[0_32px_64px_-24px_rgba(0,0,0,0.65)]",
                // Mobile-first base: a full-width bottom sheet with equal 12px side margins.
                // dvh (not vh) so the sheet tracks the browser's collapsing URL bar.
                "inset-x-3 bottom-3 h-[min(76dvh,580px)] w-auto rounded-lg",
                // Desktop (sm and up): a compact card anchored above the trigger button
                "sm:inset-x-auto sm:bottom-[168px] sm:left-auto sm:right-7 sm:h-[min(560px,calc(100dvh-200px))] sm:w-[380px] sm:rounded-md",
                // Short viewports (landscape phones): the anchored card would run off the top, so use
                // a full-height side sheet instead; the trigger is hidden while it is open.
                "[@media(max-height:520px)]:!bottom-3 [@media(max-height:520px)]:!h-[calc(100dvh-1.5rem)]"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-5 sm:py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Logo showWordmark={false} size={30} wordmarkClassName="!text-[16px]" />
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="font-serif text-[15px] font-medium">{t("assistant.title")}</span>
                    <span className="truncate font-mono text-[10px] uppercase tracking-[.08em] text-text-faint">
                      {t("assistant.subtitle")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={t("assistant.closeLabel")}
                  onClick={() => closePanel()}
                  className={cn(
                    "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-text-dim transition-colors hover:text-text sm:h-9 sm:w-9 [@media(pointer:coarse)]:!h-11 [@media(pointer:coarse)]:!w-11",
                    focusRing
                  )}
                >
                  <X className="h-[18px] w-[18px]" aria-hidden />
                </button>
              </div>

              {/* Messages — a polite live region so screen readers announce each new answer */}
              <div
                ref={listRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label={`${t("assistant.title")} — ${t("assistant.subtitle")}`}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    data-testid="chat-message"
                    data-role={message.role}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <p
                      className={cn(
                        "max-w-[88%] whitespace-pre-line break-words rounded-md px-[14px] py-[10px] text-[14px] leading-relaxed sm:max-w-[85%] sm:text-[13.5px]",
                        message.role === "user"
                          ? "bg-accent text-bg"
                          : "border border-border bg-bg/60 text-text-dim"
                      )}
                    >
                      {message.kind === "welcome" ? welcomeMessage(siteLocale) : message.text}
                    </p>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start" role="status">
                    <span className="sr-only">{t("assistant.typing")}</span>
                    <span aria-hidden className="flex items-center gap-1 rounded-md border border-border bg-bg/60 px-[14px] py-[12px]">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-[5px] w-[5px] rounded-full bg-text-faint"
                          animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                        />
                      ))}
                    </span>
                  </div>
                )}

                {showSuggestions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => pushUserMessageAndAnswer(s)}
                        className={cn(
                          "tech-badge flex min-h-[44px] items-center !px-[12px] !py-[6px] text-left !text-[12.5px] transition-colors hover:border-accent-line hover:text-accent-bright sm:min-h-0 sm:!px-[10px] sm:!text-[11.5px] [@media(pointer:coarse)]:!min-h-[44px]",
                          focusRing
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form onSubmit={handleSubmit} className="border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-md border border-border-strong bg-bg/60 pl-4 pr-1.5 focus-within:border-accent-line focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent/70">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("assistant.placeholder")}
                    aria-label={t("assistant.placeholder")}
                    maxLength={300}
                    autoComplete="off"
                    enterKeyHint="send"
                    // 16px on touch screens: iOS Safari zooms the whole page on focus for anything smaller.
                    className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-text placeholder:text-text-faint focus:outline-none sm:text-[13.5px] [@media(pointer:coarse)]:!text-[16px]"
                  />
                  <button
                    type="submit"
                    aria-label={t("assistant.send")}
                    disabled={!input.trim()}
                    className={cn(
                      "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-40 sm:h-9 sm:w-9 [@media(pointer:coarse)]:!h-11 [@media(pointer:coarse)]:!w-11",
                      focusRing
                    )}
                  >
                    <Send className="h-[15px] w-[15px]" aria-hidden />
                  </button>
                </div>
                <p className="mt-2 text-center font-mono text-[10px] leading-relaxed text-text-faint">
                  {t("assistant.disclaimer")}
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
