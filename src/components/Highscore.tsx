"use client";

import { PartyPopper, RotateCcw } from "lucide-react";

interface HighscoreProps {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  onRestart: () => void;
}

export const Highscore = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  onRestart,
}: HighscoreProps) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <PartyPopper
          className="w-10 h-10 text-yellow-400 mb-5"
          strokeWidth={1.5}
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-(--text) tracking-tight">
          High Score Smashed!
        </h2>
        <p className="text-(--text-dim) text-sm sm:text-base mt-2">
          You&apos;re getting faster. That was incredible typing.
        </p>

        <div className="flex gap-2 sm:gap-4 sm:flex-row flex-col text-left mt-8 w-full max-w-md">
          <div className="flex-1 min-w-0 bg-(--surface) border border-(--border) rounded-xl p-3 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">WPM:</p>
            <p className="text-(--text) text-xl sm:text-3xl font-bold mt-1">
              {wpm}
            </p>
          </div>
          <div className="flex-1 min-w-0 bg-(--surface) border border-(--border) rounded-xl p-3 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">Accuracy:</p>
            <p className="text-(--correct) text-xl sm:text-3xl font-bold mt-1">
              {accuracy}%
            </p>
          </div>
          <div className="flex-1 min-w-0 bg-(--surface) border border-(--border) rounded-xl p-3 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">Characters</p>
            <p className="text-(--correct) text-xl sm:text-3xl font-bold mt-1">
              {correctChars}
              <span className="text-(--incorrect)">/{incorrectChars}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-(--text) text-(--bg) text-sm font-medium rounded-lg hover:opacity-90 transition-colors cursor-pointer"
        >
          Beat This Score
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
