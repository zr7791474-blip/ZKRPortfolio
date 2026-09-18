"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { answerQuestion, welcomeMessage, type AssistantLocale } from "@/lib/assistant/engine";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions = tList("assistant.suggestions");

  // Seed the welcome message once, in the site's current UI language.
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{ id: "welcome", role: "assistant", text: welcomeMessage(localeToAssistantLocale(locale)) }];
    });
  }, [locale]);

  // Close on Escape, lock body scroll on mobile while open, focus input on open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 150);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function pushUserMessageAndAnswer(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: nextId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(
      () => {
        try {
          const { text: answer } = answerQuestion(trimmed);
          setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: answer }]);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              text: "Something went wrong on my end. Please use the contact section to reach Zakaria directly.",
            },
          ]);
        } finally {
          setIsTyping(false);
        }
      },
      420 + Math.random() * 260
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    pushUserMessageAndAnswer(input);
  }

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        data-cursor={open ? "CLOSE" : "CHAT"}
        aria-label={open ? t("assistant.closeLabel") : t("assistant.openLabel")}
        aria-expanded={open}
        aria-controls="zkr-assistant-panel"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "fixed z-[1300] flex items-center justify-center rounded-full border border-border-strong bg-surface/90 text-text shadow-[0_18px_38px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-accent-line",
          // Mobile-first base sizing/position
          "bottom-24 right-4 h-[48px] w-[48px]",
          // Desktop (sm and up) sizing/position
          "sm:bottom-[104px] sm:right-7 sm:h-[52px] sm:w-[52px]",
          // On mobile the panel becomes a tall bottom sheet that would otherwise
          // sit under this button — the sheet's own header close button takes
          // over while it's open, so hide the floating trigger on mobile only
          // (sm: explicitly forces it back to visible on desktop).
          open && "pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100"
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
              <X className="h-5 w-5" />
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
              <Logo showWordmark={false} size={30} imageClassName="!border-0" />
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
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[1290] bg-bg/60 backdrop-blur-sm sm:hidden"
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
                // Mobile-first base: a full-width bottom sheet with equal 12px side margins
                "inset-x-3 bottom-3 h-[min(72vh,560px)] w-auto rounded-lg",
                // Desktop (sm and up): a compact card anchored above the trigger button
                "sm:inset-x-auto sm:bottom-[168px] sm:left-auto sm:right-7 sm:h-[min(560px,70vh)] sm:w-[380px] sm:rounded-md"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <Logo showWordmark={false} size={30} />
                  <div className="flex flex-col leading-tight">
                    <span className="font-serif text-[15px] font-medium">{t("assistant.title")}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[.08em] text-text-faint">
                      {t("assistant.subtitle")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={t("assistant.closeLabel")}
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-dim transition-colors hover:text-text"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    data-testid="chat-message"
                    data-role={message.role}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <p
                      className={cn(
                        "max-w-[85%] rounded-md px-[14px] py-[10px] text-[13.5px] leading-relaxed",
                        message.role === "user"
                          ? "bg-accent text-bg"
                          : "border border-border bg-bg/60 text-text-dim"
                      )}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <span className="flex items-center gap-1 rounded-md border border-border bg-bg/60 px-[14px] py-[12px]">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-[5px] w-[5px] rounded-full bg-text-faint"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                        />
                      ))}
                    </span>
                  </div>
                )}

                {showSuggestions && (
                  <div className="flex flex-wrap gap-[6px] pt-1">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => pushUserMessageAndAnswer(s)}
                        className="tech-badge !px-[10px] !py-[6px] !text-[11.5px] transition-colors hover:border-accent-line hover:text-accent-bright"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form onSubmit={handleSubmit} className="border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-md border border-border-strong bg-bg/60 pl-4 pr-2 focus-within:border-accent-line">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("assistant.placeholder")}
                    className="h-[42px] flex-1 bg-transparent text-[13.5px] text-text placeholder:text-text-faint focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label={t("assistant.send")}
                    disabled={!input.trim()}
                    className="flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-30"
                  >
                    <Send className="h-[14px] w-[14px]" />
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
