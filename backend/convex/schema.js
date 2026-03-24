import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    techStack: v.array(v.string()),
    demoLink: v.optional(v.string()),
    githubLink: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  }),
  about: defineTable({
    text: v.string(),
    imageUrl: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
  }),
  skills: defineTable({
    name: v.string(),
    level: v.number(),
    category: v.string(),
  }),
  training: defineTable({
    title: v.string(),
    provider: v.string(),
    duration: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  }),
  internships: defineTable({
    role: v.string(),
    company: v.string(),
    duration: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  }),
  certificates: defineTable({
    title: v.string(),
    issuer: v.string(),
    date: v.string(),
    link: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  }),
  education: defineTable({
    degree: v.string(),
    institution: v.string(),
    duration: v.string(),
    description: v.optional(v.string()),
    score: v.optional(v.string()),
    order: v.optional(v.number()),
  }),
  messages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(), // timestamp
  }),
});
