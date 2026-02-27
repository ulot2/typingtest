import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  // User profiles with display names
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  // Leaderboard scores
  scores: defineTable({
    userId: v.id("users"),
    username: v.string(), // denormalized for fast reads
    wpm: v.number(),
    accuracy: v.number(),
    mode: v.string(),
    difficulty: v.string(),
    consistency: v.number(),
    createdAt: v.number(),
  })
    .index("by_wpm", ["wpm"])
    .index("by_user", ["userId"])
    .index("by_mode_difficulty", ["mode", "difficulty"]),
});

export default schema;
