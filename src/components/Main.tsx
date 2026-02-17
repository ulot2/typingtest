"use client";

import { useState } from "react";

const sampleText =
  'The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized. "We\'ve underestimated ancient peoples\' navigational capabilities and their appetite for luxury goods," the lead researcher observed. "Globalization isn\'t as modern as we assume."';

export const Main = () => {
  const [started, setStarted] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="relative rounded-xl bg-white/3 border border-white/6 p-8 sm:p-10 min-h-[260px] flex items-center justify-center">
        <p
          className={`text-lg sm:text-xl leading-relaxed font-(family-name:--font-geist-mono) transition-all duration-500 ${
            started ? "text-white/50" : "text-white/25 blur-[5px] select-none"
          }`}
          onClick={() => setStarted(true)}
        >
          {sampleText}
        </p>

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <button
              onClick={() => setStarted(true)}
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
    </div>
  );
};
