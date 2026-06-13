"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="flex items-center space-x-2 text-accent animate-fade-in py-3 px-1">
        <CheckCircle2 className="h-5 w-5" />
        <p className="text-sm font-medium">{SITE_CONFIG.waitlistSuccess}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md w-full animate-fade-in-up [animation-delay:200ms]">
      <div className="relative group">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none transition-all duration-300",
            "focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-accent/50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-white text-black font-semibold text-sm transition-all duration-300",
            "hover:bg-accent hover:text-white active:scale-95 disabled:opacity-50",
            "flex items-center justify-center min-w-[100px]"
          )}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
