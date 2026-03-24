import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("internships").collect();
    return docs.sort((a, b) => (a.order || 0) - (b.order || 0));
  },
});

export const add = mutation({
  args: {
    role: v.string(),
    company: v.string(),
    duration: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("internships", args);
  },
});

export const remove = mutation({
  args: { id: v.id("internships") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("internships"),
    role: v.optional(v.string()),
    company: v.optional(v.string()),
    duration: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
