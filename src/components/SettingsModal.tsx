"use client";

import { X, Check, Pencil } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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

  const { isAuthenticated } = useConvexAuth();
  const profile = useQuery(api.users.getMe);
  const updateUsername = useMutation(api.users.updateUsername);

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);

  useEffect(() => {
    if (profile && "username" in profile && profile.username) {
      setUsernameInput(profile.username);
    }
  }, [profile]);

  const handleSaveUsername = async () => {
    setUsernameError("");
    setUsernameSaving(true);
    try {
      await updateUsername({ username: usernameInput });
      setEditingUsername(false);
    } catch (err) {
      let message = "Failed to update username";
      if (err instanceof Error) {
        // Convex wraps errors: "Uncaught Error: Username is already taken"
        const match = err.message.match(/Uncaught Error:\s*(.+)/);
        message = match ? match[1] : err.message;
      }
      setUsernameError(message);
    } finally {
      setUsernameSaving(false);
    }
  };

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

          {/* Account — only visible when signed in */}
          {isAuthenticated &&
            profile &&
            "username" in profile &&
            profile.username && (
              <div>
                <h3 className="text-sm font-medium text-(--text) mb-3">
                  Account
                </h3>
                <div className="bg-(--surface) border border-(--border) rounded-xl p-4">
                  {editingUsername ? (
                    <div className="space-y-2">
                      <label className="text-xs text-(--text-dim)">
                        Username
                      </label>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => {
                          setUsernameInput(e.target.value);
                          setUsernameError("");
                        }}
                        className="w-full px-3 py-2 bg-(--bg) border border-(--border) rounded-lg text-sm text-(--text) focus:outline-none focus:border-(--accent)"
                        maxLength={20}
                        placeholder="Enter username"
                        autoFocus
                      />
                      {usernameError && (
                        <p className="text-xs text-red-400">{usernameError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveUsername}
                          disabled={usernameSaving}
                          className="px-3 py-1.5 text-xs font-medium bg-(--accent) text-(--bg) rounded-lg hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {usernameSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingUsername(false);
                            setUsernameError("");
                            if (
                              profile &&
                              "username" in profile &&
                              profile.username
                            ) {
                              setUsernameInput(profile.username);
                            }
                          }}
                          className="px-3 py-1.5 text-xs text-(--text-dim) hover:text-(--text) transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-(--text)">
                          {profile.username}
                        </p>
                        <p className="text-xs text-(--text-dim) mt-0.5">
                          Your username appears on the leaderboard
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingUsername(true)}
                        className="p-2 rounded-lg text-(--text-dim) hover:text-(--text) hover:bg-(--bg) transition-colors cursor-pointer"
                        title="Edit username"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
