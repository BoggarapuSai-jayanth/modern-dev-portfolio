import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("about").first();
  },
});

export const save = mutation({
  args: {
    text: v.string(),
    imageUrl: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("about").first();
    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("about", args);
    }
  },
});
