"use client";

import { useState } from "react";
import { CheckCircle, RotateCcw, Sparkle } from "lucide-react";
import { getHistory, SessionRecord } from "@/lib/history";
import { WpmChart } from "./WpmChart";
import { KeyboardHeatmap } from "./KeyboardHeatmap";
import { ShareCard } from "./ShareCard";

interface ResultsProps {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  keyErrors: Record<string, number>;
  consistency: number;
  mode: string;
  difficulty: string;
  onRestart: () => void;
  isAuthenticated: boolean;
  onSignIn: () => void;
  scoreSubmitted: boolean;
}

export const Results = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  keyErrors,
  consistency,
  mode,
  difficulty,
  onRestart,
  isAuthenticated,
  onSignIn,
  scoreSubmitted,
}: ResultsProps) => {
  const [history] = useState<SessionRecord[]>(() => getHistory());

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16">
      <div className="relative flex flex-col items-center text-center">
        {/* Decorative sparkles */}
        <Sparkle className="absolute top-0 left-4 sm:left-12 w-5 h-5 text-rose-400/60 animate-pulse" />
        <Sparkle className="absolute bottom-8 right-4 sm:right-12 w-6 h-6 text-amber-400/60 animate-pulse" />

        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-(--text) tracking-tight">
          Test Complete!
        </h2>
        <p className="text-(--text-dim) text-sm sm:text-base mt-2 max-w-sm">
          Solid run. Keep pushing to beat your high score.
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 w-full max-w-xl">
          <div className="bg-(--surface) border border-(--border) rounded-xl p-4 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">WPM</p>
            <p className="text-(--text) text-2xl sm:text-3xl font-bold mt-1">
              {wpm}
            </p>
          </div>
          <div className="bg-(--surface) border border-(--border) rounded-xl p-4 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">Accuracy</p>
            <p className="text-(--correct) text-2xl sm:text-3xl font-bold mt-1">
              {accuracy}%
            </p>
          </div>
          <div className="bg-(--surface) border border-(--border) rounded-xl p-4 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">Characters</p>
            <p className="text-(--correct) text-2xl sm:text-3xl font-bold mt-1">
              {correctChars}
              <span className="text-(--incorrect)">/{incorrectChars}</span>
            </p>
          </div>
          <div className="bg-(--surface) border border-(--border) rounded-xl p-4 sm:p-5">
            <p className="text-(--text-dim) text-xs sm:text-sm">Consistency</p>
            <p
              className={`text-2xl sm:text-3xl font-bold mt-1 ${
                consistency >= 80
                  ? "text-(--correct)"
                  : consistency >= 50
                    ? "text-amber-400"
                    : "text-(--incorrect)"
              }`}
            >
              {consistency}%
            </p>
          </div>
        </div>

        {/* Leaderboard status */}
        {!isAuthenticated && (
          <div className="mt-6 w-full max-w-xl">
            <button
              onClick={onSignIn}
              className="w-full py-3 px-4 bg-(--surface) border border-(--border) rounded-xl text-sm text-(--text-dim) hover:border-(--accent) transition-colors cursor-pointer"
            >
              🔑 Sign in with Google to save this score to the leaderboard
            </button>
          </div>
        )}
        {isAuthenticated && scoreSubmitted && (
          <p className="mt-4 text-xs text-emerald-400/70">
            ✓ Score submitted to leaderboard
          </p>
        )}

        {/* Error Heatmap */}
        <KeyboardHeatmap keyErrors={keyErrors} />

        {/* WPM History Chart */}
        <div className="w-full max-w-md">
          <WpmChart sessions={history} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-2.5 bg-(--text) text-(--bg) text-sm font-medium rounded-lg hover:opacity-90 transition-colors cursor-pointer"
          >
            Go Again
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <ShareCard
          wpm={wpm}
          accuracy={accuracy}
          consistency={consistency}
          mode={mode}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
};
