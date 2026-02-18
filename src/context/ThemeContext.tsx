"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

const themes = ["default", "dracula", "solarized", "monokai", "nord"] as const;
const fonts = [
  "Geist Mono",
  "JetBrains Mono",
  "Fira Code",
  "Source Code Pro",
  "IBM Plex Mono",
] as const;

type Theme = (typeof themes)[number];
type Font = (typeof fonts)[number];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: readonly string[];
  font: Font;
  setFont: (font: Font) => void;
  fonts: readonly string[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Theme sync
function getThemeSnapshot(): Theme {
  const saved = localStorage.getItem("typingTestTheme") as Theme;
  return saved && themes.includes(saved) ? saved : "default";
}

function getServerSnapshot(): Theme {
  return "default";
}

// Font sync
function getFontSnapshot(): Font {
  const saved = localStorage.getItem("typingTestFont") as Font;
  return saved && fonts.includes(saved) ? saved : "Geist Mono";
}

function getServerFontSnapshot(): Font {
  return "Geist Mono";
}

// Sound sync
function getSoundSnapshot(): boolean {
  return localStorage.getItem("typingTestSound") === "true";
}

function getServerSoundSnapshot(): boolean {
  return false;
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToStorage,
    getThemeSnapshot,
    getServerSnapshot,
  );

  const font = useSyncExternalStore(
    subscribeToStorage,
    getFontSnapshot,
    getServerFontSnapshot,
  );

  const soundEnabled = useSyncExternalStore(
    subscribeToStorage,
    getSoundSnapshot,
    getServerSoundSnapshot,
  );

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("typingTestTheme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new StorageEvent("storage"));
  };

  const setFont = (newFont: Font) => {
    localStorage.setItem("typingTestFont", newFont);
    window.dispatchEvent(new StorageEvent("storage"));
  };

  const setSoundEnabled = (enabled: boolean) => {
    localStorage.setItem("typingTestSound", String(enabled));
    window.dispatchEvent(new StorageEvent("storage"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes,
        font,
        setFont,
        fonts,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
