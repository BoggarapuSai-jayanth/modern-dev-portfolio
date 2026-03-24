import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("certificates").collect();
    return docs.sort((a, b) => (a.order || 0) - (b.order || 0));
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    issuer: v.string(),
    date: v.string(),
    link: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("certificates", args);
  },
});

export const remove = mutation({
  args: { id: v.id("certificates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("certificates"),
    title: v.optional(v.string()),
    issuer: v.optional(v.string()),
    date: v.optional(v.string()),
    link: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
