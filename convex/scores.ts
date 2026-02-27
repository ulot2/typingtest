import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Fetch the top scores for the leaderboard.
 * Public — no auth required.
 */
export const getLeaderboard = query({
  args: {
    mode: v.optional(v.string()),
    difficulty: v.optional(v.string()),
  },
  handler: async (ctx, { mode, difficulty }) => {
    let scoresQuery;

    if (mode && difficulty) {
      scoresQuery = ctx.db
        .query("scores")
        .withIndex("by_mode_difficulty", (q) =>
          q.eq("mode", mode).eq("difficulty", difficulty),
        );
    } else {
      scoresQuery = ctx.db.query("scores");
    }

    const allScores = await scoresQuery.collect();

    // Filter by mode or difficulty if only one is specified
    let filtered = allScores;
    if (mode && !difficulty) {
      filtered = allScores.filter((s) => s.mode === mode);
    } else if (!mode && difficulty) {
      filtered = allScores.filter((s) => s.difficulty === difficulty);
    }

    // Sort by WPM descending and take top 50
    filtered.sort((a, b) => b.wpm - a.wpm);
    return filtered.slice(0, 50);
  },
});

/**
 * Submit a score to the leaderboard.
 * Requires authentication.
 */
export const submitScore = mutation({
  args: {
    wpm: v.number(),
    accuracy: v.number(),
    mode: v.string(),
    difficulty: v.string(),
    consistency: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the user's profile for the username
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found. Please sign in again.");

    const scoreId = await ctx.db.insert("scores", {
      userId,
      username: profile.username,
      wpm: args.wpm,
      accuracy: args.accuracy,
      mode: args.mode,
      difficulty: args.difficulty,
      consistency: args.consistency,
      createdAt: Date.now(),
    });

    return scoreId;
  },
});

/**
 * Get the authenticated user's scores.
 */
export const getUserScores = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const scores = await ctx.db
      .query("scores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    scores.sort((a, b) => b.createdAt - a.createdAt);
    return scores.slice(0, 50);
  },
});
