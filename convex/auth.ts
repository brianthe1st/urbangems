import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

export const adminSignIn = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    if (args.email !== "ndamagebrian@gmail.com" || args.password !== "@brian250") {
      throw new Error("Access denied. Invalid admin credentials.");
    }
    
    // Check if admin user exists, if not create it
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      await ctx.db.insert("users", {
        email: args.email,
        name: "Admin",
        emailVerificationTime: Date.now(),
      });
    }

    // Return success - the actual sign in will be handled by the client
    return { success: true };
  },
});
