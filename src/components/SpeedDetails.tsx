"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface SpeedDetailsProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  difficulty: string;
  setDifficulty: (value: string) => void;
  mode: string;
  setMode: (value: string) => void;
}

const Dropdown = ({ value, options, onChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-[140px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white cursor-pointer focus:outline-none focus:border-white/25 transition-colors"
      >
        {value}
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === option
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const SpeedDetails = ({
  wpm,
  accuracy,
  timeLeft,
  difficulty,
  setDifficulty,
  mode,
  setMode,
}: SpeedDetailsProps) => {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="bg-white/5 border border-white/8 rounded-lg px-5 py-3">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between">
          {mode !== "Zen" && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/50">
                WPM: <span className="text-white font-semibold">{wpm}</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white/50">
                Accuracy:{" "}
                <span className="text-white font-semibold">{accuracy}%</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white/50">
                Time:{" "}
                <span className="text-white font-semibold">{timeLeft}</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white/50">Difficulty:</span>
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-3 py-1 rounded border text-sm transition-colors ${
                    difficulty === level
                      ? "border-white/40 text-white"
                      : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {level}
                </button>
              ))}
              <span className="text-white/20">|</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white/50">Mode:</span>
              <Dropdown
                value={mode}
                options={[
                  "Timed (15s)",
                  "Timed (30s)",
                  "Timed (60s)",
                  "Timed (120s)",
                  "Passage",
                  "Words",
                  "Sudden Death",
                  "Zen",
                ]}
                onChange={setMode}
              />
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col gap-3 md:hidden">
          {mode !== "Zen" && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="text-white/40 text-xs">WPM:</p>
                <p className="text-white font-semibold text-lg">{wpm}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-white/40 text-xs">Accuracy:</p>
                <p className="text-white font-semibold text-lg">{accuracy}%</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-white/40 text-xs">Time:</p>
                <p className="text-white font-semibold text-lg">{timeLeft}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Dropdown
              value={difficulty}
              options={["Easy", "Medium", "Hard"]}
              onChange={setDifficulty}
            />
            <Dropdown
              value={mode}
              options={[
                "Timed (15s)",
                "Timed (30s)",
                "Timed (60s)",
                "Timed (120s)",
                "Passage",
                "Words",
                "Sudden Death",
                "Zen",
              ]}
              onChange={setMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
