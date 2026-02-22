import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  imageAnalyses: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    status: v.union(v.literal("pending"), v.literal("analyzing"), v.literal("complete"), v.literal("error")),
    result: v.optional(v.object({
      isEdited: v.boolean(),
      isAiGenerated: v.boolean(),
      isPhotoshopped: v.boolean(),
      confidence: v.number(),
      detailsMarkdown: v.string(),
      flags: v.array(v.string()),
    })),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    analyzedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]).index("by_status", ["status"]),
});
