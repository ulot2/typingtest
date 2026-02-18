"use client";

import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useKeyboardSound } from "@/hooks/useKeyboardSound";

const fontVarMap: Record<string, string> = {
  "Geist Mono": "var(--font-geist-mono)",
  "JetBrains Mono": "var(--font-jetbrains-mono)",
  "Fira Code": "var(--font-fira-code)",
  "Source Code Pro": "var(--font-source-code-pro)",
  "IBM Plex Mono": "var(--font-ibm-plex-mono)",
};

interface MainProps {
  sampleText: string;
  typedChars: string;
  gameState: string;
  onType: (key: string) => void;
  onStart: () => void;
  onRestart: () => void;
  upcomingWords?: string[];
}

export const Main = ({
  sampleText,
  typedChars,
  gameState,
  onType,
  onStart,
  onRestart,
  upcomingWords,
}: MainProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const { font } = useTheme();
  const { playKeySound } = useKeyboardSound();

  useEffect(() => {
    if (gameState === "typing") {
      inputRef.current?.focus();
    }
  }, [gameState]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" || e.key.length === 1) {
      e.preventDefault();
      playKeySound();
      onType(e.key);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      playKeySound();
      onType(lastChar);
      e.currentTarget.value = "";
    }
  };

  const activeCharRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = activeCharRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    if (rect.top < 0 || rect.bottom > viewportHeight) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [typedChars]);

  useEffect(() => {
    const caret = caretRef.current;
    const container = textContainerRef.current;
    if (!caret || !container) return;

    const target = activeCharRef.current;
    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    caret.style.left = `${targetRect.left - containerRect.left}px`;
    caret.style.top = `${targetRect.top - containerRect.top}px`;
    caret.style.height = `${targetRect.height}px`;
  }, [typedChars, sampleText]);

  const started = gameState !== "idle";

  return (
    <div className="max-w-5xl mx-auto px-6 py-5">
      <hr className="border-white/10 my-4" />
      <div
        ref={containerRef}
        className="relative rounded-xl bg-(--surface) border border-(--border) p-8 sm:p-10 min-h-[260px] flex items-center justify-center cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <label htmlFor="type" className="sr-only">
          Type here
        </label>
        <input
          ref={inputRef}
          name="type"
          id="type"
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onFocus={() => {
            setTimeout(() => {
              activeCharRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 300);
          }}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
        <p
          ref={textContainerRef}
          className={`text-lg sm:text-xl leading-relaxed transition-all relative duration-500 ${
            started
              ? "text-(--text)"
              : "text-(--text-dim) blur-[5px] select-none"
          }`}
          style={{ fontFamily: fontVarMap[font] || "var(--font-geist-mono)" }}
          onClick={() => inputRef.current?.focus()}
        >
          {started && (
            <span
              ref={caretRef}
              className="absolute w-[2px] bg-(--caret) rounded-full transition-all duration-100 ease-out"
              data-blinking={gameState !== "typing" ? "" : undefined}
            />
          )}
          {sampleText.split("").map((char, i) => {
            let colorClass = "text-(--text-dim)";

            if (i < typedChars.length) {
              colorClass =
                typedChars[i] === char
                  ? "text-(--correct)"
                  : "text-(--incorrect) underline";
            } else if (i === typedChars.length) {
              colorClass = "text-(--text) underline";
            }

            return (
              <span
                key={i}
                ref={i === typedChars.length ? activeCharRef : undefined}
                className={colorClass}
              >
                {char}
              </span>
            );
          })}

          {upcomingWords && upcomingWords.length > 0 && (
            <span className="text-(--text-dim) opacity-60">
              {" "}
              {upcomingWords.slice(0, 8).join(" ")}
            </span>
          )}
        </p>

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <button
              onClick={() => {
                onStart();
                inputRef.current?.focus();
              }}
              className="px-6 py-2.5 bg-(--accent) hover:brightness-110 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
            >
              Start Typing Test
            </button>
            <p className="text-white/30 text-xs">
              Or click the text and start typing
            </p>
          </div>
        )}
      </div>

      {started && (
        <div>
          <hr className="border-white/10 my-4" />
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
            >
              Restart
              <RotateCcw className="w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
