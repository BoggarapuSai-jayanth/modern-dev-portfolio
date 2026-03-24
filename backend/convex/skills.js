import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("skills").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    level: v.number(),
    iconName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("skills", args);
  },
});

export const remove = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    level: v.optional(v.number()),
    iconName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
