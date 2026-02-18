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
        className="w-full flex items-center justify-between bg-(--surface) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) cursor-pointer focus:outline-none focus:border-(--border) transition-colors"
      >
        {value}
        <ChevronDown
          className={`w-3.5 h-3.5 text-(--text-dim) transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-(--bg) border border-(--border) rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === option
                  ? "bg-(--surface) text-(--text) brightness-150"
                  : "text-(--text-dim) hover:bg-(--surface) hover:text-(--text)"
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
      <div className="bg-(--surface) border border-(--border) rounded-lg px-5 py-3">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between">
          {mode !== "Zen" && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-(--text-dim)">
                WPM: <span className="text-(--text) font-semibold">{wpm}</span>
              </span>
              <span className="text-(--text-dim) opacity-40">|</span>
              <span className="text-(--text-dim)">
                Accuracy:{" "}
                <span className="text-(--text) font-semibold">{accuracy}%</span>
              </span>
              <span className="text-(--text-dim) opacity-40">|</span>
              <span className="text-(--text-dim)">
                Time:{" "}
                <span className="text-(--text) font-semibold">{timeLeft}</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-(--text-dim)">Difficulty:</span>
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-3 py-1 rounded border text-sm transition-colors ${
                    difficulty === level
                      ? "border-(--border) text-(--text) brightness-150"
                      : "border-(--border) text-(--text-dim) hover:text-(--text)"
                  }`}
                >
                  {level}
                </button>
              ))}
              <span className="text-(--text-dim) opacity-40">|</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-(--text-dim)">Mode:</span>
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
                <p className="text-(--text-dim) text-xs">WPM:</p>
                <p className="text-(--text) font-semibold text-lg">{wpm}</p>
              </div>
              <div className="w-px h-8 bg-(--border)" />
              <div className="text-center">
                <p className="text-(--text-dim) text-xs">Accuracy:</p>
                <p className="text-(--text) font-semibold text-lg">
                  {accuracy}%
                </p>
              </div>
              <div className="w-px h-8 bg-(--border)" />
              <div className="text-center">
                <p className="text-(--text-dim) text-xs">Time:</p>
                <p className="text-(--text) font-semibold text-lg">
                  {timeLeft}
                </p>
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
