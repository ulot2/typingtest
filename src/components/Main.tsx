"use client";

import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

interface MainProps {
  sampleText: string;
  typedChars: string;
  gameState: string;
  onType: (key: string) => void;
  onStart: () => void;
  onRestart: () => void;
}

export const Main = ({
  sampleText,
  typedChars,
  gameState,
  onType,
  onStart,
  onRestart,
}: MainProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState === "typing") {
      inputRef.current?.focus();
    }
  }, [gameState]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1) {
      e.preventDefault();
      onType(e.key);
    }
  };

  const started = gameState !== "idle";

  return (
    <div className="max-w-5xl mx-auto px-6 py-5">
      <hr className="border-white/10 my-4" />
      <div
        className="relative rounded-xl bg-white/3 border border-white/6 p-8 sm:p-10 min-h-[260px] flex items-center justify-center cursor-text"
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
          className="absolute opacity-0 w-0 h-0"
          readOnly
        />
        <p
          className={`text-lg sm:text-xl leading-relaxed font-(family-name:--font-geist-mono) transition-all duration-500 ${
            started ? "text-white/50" : "text-white/25 blur-[5px] select-none"
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {sampleText.split("").map((char, i) => {
            let colorClass = "text-white/25";

            if (i < typedChars.length) {
              colorClass =
                typedChars[i] === char
                  ? "text-emerald-400"
                  : "text-red-400 underline";
            } else if (i === typedChars.length) {
              colorClass = "text-white/50 underline";
            }

            return (
              <span key={i} className={colorClass}>
                {char}
              </span>
            );
          })}
        </p>

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <button
              onClick={() => {
                onStart();
                inputRef.current?.focus();
              }}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
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
