"use client";

import { Keyboard, Trophy, X, Settings } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";

interface HeaderProps {
  highscore: number;
  onResetHighScore: () => void;
}

export const Header = ({ highscore, onResetHighScore }: HeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-(--text-dim)" />
            <div>
              <h1 className="text-xl font-semibold text-(--text) tracking-tight sm:block hidden">
                Typing Speed Test
              </h1>
              <p className="text-sm text-(--text-dim) sm:block hidden">
                Type as fast as you can in 60 seconds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-(--text-dim) hover:text-(--text) hover:bg-(--surface) transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-(--text-dim)">
              <Trophy className="w-4 h-4 text-amber-400/70" />
              <span className="text-sm">
                Personal best:{" "}
                <span className="text-(--text) font-medium">
                  {highscore} WPM
                </span>
              </span>
              {highscore > 0 && (
                <button
                  onClick={onResetHighScore}
                  className="p-1 rounded hover:bg-(--surface) text-(--text-dim) hover:text-(--text) transition-colors cursor-pointer"
                  title="Reset high score"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};
