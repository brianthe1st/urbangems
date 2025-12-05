import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Public queries
export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products");

    if (args.search) {
      const results = await ctx.db
        .query("products")
        .withSearchIndex("search_products", (q) =>
          q.search("name", args.search!)
            .eq("inStock", true)
        )
        .collect();
      
      return Promise.all(
        results.map(async (product) => ({
          ...product,
          imageUrl: product.imageId ? await ctx.storage.getUrl(product.imageId) : null,
        }))
      );
    }

    if (args.category) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("inStock"), true))
        .collect();
      
      return Promise.all(
        products.map(async (product) => ({
          ...product,
          imageUrl: product.imageId ? await ctx.storage.getUrl(product.imageId) : null,
        }))
      );
    }

    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("inStock"), true))
      .collect();

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageUrl: product.imageId ? await ctx.storage.getUrl(product.imageId) : null,
      }))
    );
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("inStock"), true))
      .take(6);

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageUrl: product.imageId ? await ctx.storage.getUrl(product.imageId) : null,
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;

    return {
      ...product,
      imageUrl: product.imageId ? await ctx.storage.getUrl(product.imageId) : null,
    };
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  },
});

// Admin mutations (require authentication)
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageId: v.optional(v.id("_storage")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("products", {
      ...args,
      inStock: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});
