"use client";

import { X, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const themeColors: Record<string, string> = {
  default: "#0a0a0a",
  dracula: "#282a36",
  solarized: "#002b36",
  monokai: "#272822",
  nord: "#2e3440",
};

const themeLabels: Record<string, string> = {
  default: "Default",
  dracula: "Dracula",
  solarized: "Solarized",
  monokai: "Monokai",
  nord: "Nord",
};

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const {
    theme,
    setTheme,
    themes,
    font,
    setFont,
    fonts,
    soundEnabled,
    setSoundEnabled,
  } = useTheme();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 bg-(--bg) border border-(--border) rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border)">
          <h2 className="text-lg font-semibold text-(--text)">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--text-dim) hover:text-(--text) hover:bg-(--surface) transition-colors cursor-pointer"
            title="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Theme */}
          <div>
            <h3 className="text-sm font-medium text-(--text) mb-3">Theme</h3>
            <div className="grid grid-cols-5 gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as Parameters<typeof setTheme>[0])}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    theme === t
                      ? "border-(--accent) bg-(--surface)"
                      : "border-transparent hover:bg-(--surface)"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      theme === t
                        ? "border-(--accent) scale-110"
                        : "border-(--border)"
                    }`}
                    style={{ backgroundColor: themeColors[t] }}
                  />
                  <span className="text-xs text-(--text-dim)">
                    {themeLabels[t]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <h3 className="text-sm font-medium text-(--text) mb-3">Font</h3>
            <div className="space-y-1">
              {fonts.map((f) => (
                <button
                  key={f}
                  onClick={() => setFont(f as Parameters<typeof setFont>[0])}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                    font === f
                      ? "bg-(--surface) text-(--text)"
                      : "text-(--text-dim) hover:bg-(--surface) hover:text-(--text)"
                  }`}
                  style={{ fontFamily: f }}
                >
                  <span>{f}</span>
                  {font === f && <Check className="w-4 h-4 text-(--accent)" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sound */}
          <div>
            <h3 className="text-sm font-medium text-(--text) mb-3">Sound</h3>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-(--text-dim) hover:bg-(--surface) transition-all cursor-pointer"
            >
              <span>Keyboard sounds</span>
              <div
                className={`w-10 h-5.5 rounded-full relative transition-colors ${
                  soundEnabled ? "bg-(--accent)" : "bg-(--surface)"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                    soundEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
