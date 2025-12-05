import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageId: v.optional(v.id("_storage")),
    category: v.string(),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .searchIndex("search_products", {
      searchField: "name",
      filterFields: ["category", "inStock"],
    }),

  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  }).index("by_status", ["status"]),

  orders: defineTable({
    productId: v.id("products"),
    customerName: v.string(),
    customerEmail: v.string(),
    quantity: v.number(),
    totalPrice: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
  })
    .index("by_status", ["status"])
    .index("by_customer", ["customerEmail"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
