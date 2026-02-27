import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Generate a unique username like "Typist#8472"
 */
function generateUsername(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Typist#${num}`;
}

/**
 * Get the current user's profile, or null if not signed in.
 * If signed in but no profile exists, auto-create one.
 */
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (profile) return profile;

    // Profile doesn't exist yet — we can't create it in a query.
    // Return a placeholder to signal the frontend to call ensureProfile.
    return {
      _id: null,
      userId,
      username: null,
      image: null,
      needsProfile: true,
    };
  },
});

/**
 * Ensure a profile exists for the authenticated user.
 * Called once after the first sign-in.
 */
export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Backfill image if missing (profile was created before image support)
      if (!existing.image) {
        const user = await ctx.db.get(userId);
        const image = user?.image as string | undefined;
        if (image) {
          await ctx.db.patch(existing._id, { image });
          return { ...existing, image };
        }
      }
      return existing;
    }

    // Get email and image from the auth user record
    const user = await ctx.db.get(userId);
    const email = user?.email as string | undefined;
    const image = user?.image as string | undefined;

    // Generate a unique username
    let username = generateUsername();
    let attempts = 0;
    while (attempts < 10) {
      const taken = await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", username))
        .unique();
      if (!taken) break;
      username = generateUsername();
      attempts++;
    }

    const profileId = await ctx.db.insert("profiles", {
      userId,
      username,
      email: email ?? undefined,
      image: image ?? undefined,
    });

    return await ctx.db.get(profileId);
  },
});

/**
 * Update the authenticated user's display name.
 */
export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      throw new Error("Username must be 3-20 characters");
    }
    if (!/^[a-zA-Z0-9_#]+$/.test(trimmed)) {
      throw new Error(
        "Username can only contain letters, numbers, underscores, and #",
      );
    }

    // Check uniqueness
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", trimmed))
      .unique();

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    if (existing && existing._id !== profile._id) {
      throw new Error("Username is already taken");
    }

    await ctx.db.patch(profile._id, { username: trimmed });

    // Also update denormalized usernames in scores
    const scores = await ctx.db
      .query("scores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const score of scores) {
      await ctx.db.patch(score._id, { username: trimmed });
    }

    return { username: trimmed };
  },
});
