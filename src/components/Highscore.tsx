"use client";

import { PartyPopper, RotateCcw } from "lucide-react";
import Image from "next/image";

export const Highscore = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <PartyPopper
          className="w-10 h-10 text-yellow-400 mb-5"
          strokeWidth={1.5}
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          High Score Smashed!
        </h2>
        <p className="text-white/40 text-sm sm:text-base mt-2">
          You&apos;re getting faster. That was incredible typing.
        </p>

        <div className="flex gap-2 sm:gap-4 sm:flex-row flex-col text-left mt-8 w-full max-w-md">
          <div className="flex-1 min-w-0 bg-white/4 border border-white/8 rounded-xl p-3 sm:p-5">
            <p className="text-white/40 text-xs sm:text-sm">WPM:</p>
            <p className="text-white text-xl sm:text-3xl font-bold mt-1">95</p>
          </div>
          <div className="flex-1 min-w-0 bg-white/4 border border-white/8 rounded-xl p-3 sm:p-5">
            <p className="text-white/40 text-xs sm:text-sm">Accuracy:</p>
            <p className="text-emerald-400 text-xl sm:text-3xl font-bold mt-1">
              100%
            </p>
          </div>
          <div className="flex-1 min-w-0 bg-white/4 border border-white/8 rounded-xl p-3 sm:p-5">
            <p className="text-white/40 text-xs sm:text-sm">Characters</p>
            <p className="text-emerald-400 text-xl sm:text-3xl font-bold mt-1">
              120<span className="text-red-400">/5</span>
            </p>
          </div>
        </div>

        <button className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors cursor-pointer">
          Beat This Score
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mt-10 overflow-hidden">
        <Image
          src="/pattern-confetti.svg"
          alt="Confetti celebration"
          width={100}
          height={100}
          className="w-full h-auto opacity-80"
        />
      </div>
    </div>
  );
};
