"use client";

import {
  Keyboard,
  Trophy,
  X,
  Settings,
  Medal,
  LogIn,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { SettingsModal } from "./SettingsModal";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  highscore: number;
  onResetHighScore: () => void;
}

export const Header = ({ highscore, onResetHighScore }: HeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const profile = useQuery(api.users.getMe);
  const ensureProfile = useMutation(api.users.ensureProfile);

  // Auto-create profile on first sign-in, or backfill image if missing
  useEffect(() => {
    if (profile && "needsProfile" in profile && profile.needsProfile) {
      ensureProfile();
    } else if (profile && "_id" in profile && profile._id && !profile.image) {
      ensureProfile();
    }
  }, [profile, ensureProfile]);

  const handleSignIn = () => {
    void signIn("google");
  };

  const handleSignOut = () => {
    void signOut();
    setUserMenuOpen(false);
  };

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
                Type as fast as you can!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Leaderboard link */}
            <Link
              href="/leaderboard"
              className="p-2 rounded-lg text-(--text-dim) hover:text-(--text) hover:bg-(--surface) transition-colors"
              title="Leaderboard"
            >
              <Medal className="w-5 h-5" />
            </Link>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-(--text-dim) hover:text-(--text) hover:bg-(--surface) transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Personal best */}
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

            {/* Auth button */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-(--surface) animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  title={profile?.username ?? "Account"}
                >
                  {profile?.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.username ?? "Avatar"}
                      className="w-full h-full object-cover"
                      width={32}
                      height={32}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-(--accent) flex items-center justify-center text-(--bg) text-xs font-bold">
                      {profile?.username
                        ? profile.username.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                  )}
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-(--bg) backdrop-blur-xl border border-(--border) rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-(--border)">
                        <p className="text-sm font-medium text-(--text)">
                          {profile?.username ?? "Loading..."}
                        </p>
                        <p className="text-xs text-(--text-dim) mt-0.5">
                          You can change your username in Settings
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-(--text-dim) hover:bg-(--bg) hover:text-(--text) transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-(--text-dim) hover:text-(--text) bg-(--surface) hover:bg-(--border) border border-(--border) rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
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
