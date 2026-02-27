"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import {
  Medal,
  Trophy,
  ArrowLeft,
  LogIn,
  ChevronDown,
  Flame,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const MODE_OPTIONS = [
  "All",
  "Timed (15s)",
  "Timed (30s)",
  "Timed (60s)",
  "Timed (120s)",
  "Passage",
  "Words",
  "Sudden Death",
  "Zen",
];

const DIFFICULTY_OPTIONS = ["All", "Easy", "Medium", "Hard"];

export default function LeaderboardPage() {
  const [modeFilter, setModeFilter] = useState("Timed (60s)");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [modeOpen, setModeOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);

  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  const scores = useQuery(api.scores.getLeaderboard, {
    mode: modeFilter === "All" ? undefined : modeFilter,
    difficulty: difficultyFilter === "All" ? undefined : difficultyFilter,
  });

  const profile = useQuery(api.users.getMe);

  const handleSignIn = () => {
    void signIn("google");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-(--text-dim) text-sm font-medium">{rank}</span>
        );
    }
  };

  const getWpmColor = (wpm: number) => {
    if (wpm >= 100) return "text-(--accent)";
    if (wpm >= 80) return "text-rose-400";
    if (wpm >= 60) return "text-amber-400";
    if (wpm >= 40) return "text-emerald-400";
    return "text-(--text-dim)";
  };

  return (
    <div className="min-h-screen overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg text-(--text-dim) hover:text-(--text) hover:bg-(--surface) transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-(--text) tracking-tight flex items-center gap-3">
              <Flame className="w-7 h-7 text-orange-400" />
              Leaderboard
            </h1>
            <p className="text-sm text-(--text-dim) mt-1">
              Top typists ranked by speed
            </p>
          </div>
        </div>

        {/* Auth banner */}
        {!authLoading && !isAuthenticated && (
          <div className="bg-(--surface) border border-(--border) rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-(--text)">
                Sign in to compete
              </p>
              <p className="text-xs text-(--text-dim) mt-1">
                Sign in with Google to submit your scores and appear on the
                leaderboard!
              </p>
            </div>
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-(--accent) text-(--bg) text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>
          </div>
        )}

        {/* Authenticated user info */}
        {isAuthenticated &&
          profile &&
          "username" in profile &&
          profile.username && (
            <div className="bg-(--surface) border border-(--border) rounded-xl p-4 mb-6 flex items-center gap-3">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.username ?? "Avatar"}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-(--accent) flex items-center justify-center text-(--bg) text-xs font-bold shrink-0">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-(--text)">
                  Playing as{" "}
                  <span className="text-(--accent)">{profile.username}</span>
                </p>
                <p className="text-xs text-(--text-dim)">
                  You can change your username in Settings
                </p>
              </div>
            </div>
          )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Mode dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setModeOpen(!modeOpen);
                setDifficultyOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-(--surface) border border-(--border) text-(--text) text-sm rounded-lg hover:border-(--text-dim) transition-colors cursor-pointer"
            >
              <span>{modeFilter === "All" ? "All Modes" : modeFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-(--text-dim) transition-transform ${modeOpen ? "rotate-180" : ""}`}
              />
            </button>
            {modeOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setModeOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 w-48 bg-(--bg) border border-(--border) rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  {MODE_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setModeFilter(m);
                        setModeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                        modeFilter === m
                          ? "text-(--accent) bg-(--surface)"
                          : "text-(--text-dim) hover:text-(--text) hover:bg-(--surface)"
                      }`}
                    >
                      {m === "All" ? "All Modes" : m}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Difficulty dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setDifficultyOpen(!difficultyOpen);
                setModeOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-(--surface) border border-(--border) text-(--text) text-sm rounded-lg hover:border-(--text-dim) transition-colors cursor-pointer"
            >
              <span>
                {difficultyFilter === "All"
                  ? "All Difficulties"
                  : difficultyFilter}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-(--text-dim) transition-transform ${difficultyOpen ? "rotate-180" : ""}`}
              />
            </button>
            {difficultyOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDifficultyOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 w-48 bg-(--bg) border border-(--border) rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDifficultyFilter(d);
                        setDifficultyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                        difficultyFilter === d
                          ? "text-(--accent) bg-(--surface)"
                          : "text-(--text-dim) hover:text-(--text) hover:bg-(--surface)"
                      }`}
                    >
                      {d === "All" ? "All Difficulties" : d}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="bg-(--surface) border border-(--border) rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[3rem_1fr_5rem_4.5rem_4.5rem_6rem] sm:grid-cols-[3.5rem_1fr_5rem_5rem_5rem_8rem] px-4 py-3 border-b border-(--border) text-xs font-medium text-(--text-dim) uppercase tracking-wider">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">WPM</span>
            <span className="text-right hidden sm:block">Acc</span>
            <span className="text-right hidden sm:block">Con</span>
            <span className="text-right">Mode</span>
          </div>

          {/* Rows */}
          {scores === undefined ? (
            // Loading
            <div className="px-4 py-12 text-center">
              <div className="inline-block w-6 h-6 border-2 border-(--text-dim) border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-(--text-dim) mt-3">
                Loading scores...
              </p>
            </div>
          ) : scores.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Medal className="w-10 h-10 text-(--text-dim) mx-auto mb-3 opacity-40" />
              <p className="text-sm text-(--text-dim)">
                No scores yet. Be the first to submit!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-(--border)">
              {scores.map((score, index) => {
                const rank = index + 1;
                const isCurrentUser =
                  profile &&
                  "_id" in profile &&
                  "userId" in score &&
                  profile.userId === score.userId;

                return (
                  <div
                    key={score._id}
                    className={`grid grid-cols-[3rem_1fr_5rem_4.5rem_4.5rem_6rem] sm:grid-cols-[3.5rem_1fr_5rem_5rem_5rem_8rem] px-4 py-3 items-center text-sm transition-colors ${
                      isCurrentUser
                        ? "bg-(--accent)/5 border-l-2 border-l-(--accent)"
                        : "hover:bg-(--bg)"
                    } ${rank <= 3 ? "font-medium" : ""}`}
                  >
                    <div className="flex items-center justify-center w-6">
                      {getRankIcon(rank)}
                    </div>
                    <span
                      className={`truncate ${isCurrentUser ? "text-(--accent)" : "text-(--text)"}`}
                    >
                      {score.username}
                      {isCurrentUser && (
                        <span className="text-xs text-(--text-dim) ml-1.5">
                          (you)
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-right font-bold ${getWpmColor(score.wpm)}`}
                    >
                      {score.wpm}
                    </span>
                    <span className="text-right text-(--text-dim) hidden sm:block">
                      {score.accuracy}%
                    </span>
                    <span className="text-right text-(--text-dim) hidden sm:block">
                      {score.consistency}%
                    </span>
                    <span className="text-right text-xs text-(--text-dim) truncate">
                      {score.mode}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-(--text-dim)">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-(--accent)" />
            100+ Elite
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            80+ Expert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            60+ Advanced
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            40+ Intermediate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-(--text-dim)" />
            0–40 Beginner
          </span>
        </div>
      </div>
    </div>
  );
}
