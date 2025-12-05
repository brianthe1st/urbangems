import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    productId: v.id("products"),
    customerName: v.string(),
    customerEmail: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const totalPrice = product.price * args.quantity;

    return await ctx.db.insert("orders", {
      ...args,
      totalPrice,
      status: "pending",
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_status")
      .order("desc")
      .collect();

    return Promise.all(
      orders.map(async (order) => {
        const product = await ctx.db.get(order.productId);
        return {
          ...order,
          product,
        };
      })
    );
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});
