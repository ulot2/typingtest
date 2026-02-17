"use client";

import { CheckCircle, RotateCcw, Sparkle } from "lucide-react";

export const Results = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16">
      <div className="relative flex flex-col items-center text-center">
        {/* Decorative sparkles */}
        <Sparkle className="absolute top-0 left-4 sm:left-12 w-5 h-5 text-rose-400/60 animate-pulse" />
        <Sparkle className="absolute bottom-8 right-4 sm:right-12 w-6 h-6 text-amber-400/60 animate-pulse" />

        {/* Checkmark icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Test Complete!
        </h2>
        <p className="text-white/40 text-sm sm:text-base mt-2 max-w-sm">
          Solid run. Keep pushing to beat your high score.
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 w-full max-w-md">
          <div className="bg-white/4 border border-white/8 rounded-xl p-4 sm:p-5">
            <p className="text-white/40 text-xs sm:text-sm">WPM:</p>
            <p className="text-white text-2xl sm:text-3xl font-bold mt-1">85</p>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-4 sm:p-5">
            <p className="text-white/40 text-xs sm:text-sm">Accuracy:</p>
            <p className="text-emerald-400 text-2xl sm:text-3xl font-bold mt-1">
              90%
            </p>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-4 sm:p-5">
            <p className="text-white/40 text-xs sm:text-sm">Characters</p>
            <p className="text-emerald-400 text-2xl sm:text-3xl font-bold mt-1">
              120<span className="text-red-400">/5</span>
            </p>
          </div>
        </div>

        {/* Go Again button */}
        <button className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors cursor-pointer">
          Go Again
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
