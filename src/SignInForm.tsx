"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const adminSignIn = useMutation(api.auth.adminSignIn);
  const { signIn } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First validate with our custom admin check
      await adminSignIn({ email, password });
      
      // If validation passes, sign in with Convex Auth
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signIn");
      
      await signIn("password", formData);
      toast.success("Welcome back, Admin!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input-field"
          placeholder="Admin Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input-field"
          placeholder="Password"
          required
        />
        <button type="submit" disabled={isLoading} className="auth-button">
          {isLoading ? "Signing in..." : "Admin Sign In"}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg animate-fade-in">
        <p className="text-sm text-orange-800 text-center">
          🔒 Admin access restricted to authorized personnel
        </p>
      </div>
    </div>
  );
}
