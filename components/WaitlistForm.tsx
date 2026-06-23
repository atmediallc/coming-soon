"use client";

import { useState, useId, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const inputId = useId();
  const errorId = useId();
  const microcopyId = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.focus();
    } else if (status === "error" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error") setStatus("idle");
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center space-y-3 animate-fade-in py-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg p-2"
        tabIndex={-1}
        ref={successRef}
      >
        <div className="flex items-center space-x-2 text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">{SITE_CONFIG.successMessage}</p>
        </div>
        <p className="text-xs text-white/40">{SITE_CONFIG.privacyNote}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up [animation-delay:200ms]">
      {/* Momentum copy */}
      <p
        id={microcopyId}
        className="text-center text-xs text-white/40 mb-3 font-medium"
      >
        {SITE_CONFIG.waitlistMomentum}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Visually hidden label — accessible to screen readers */}
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>

        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            spellCheck="false"
            placeholder="Enter your email address"
            value={email}
            onChange={handleChange}
            required
            disabled={status === "loading"}
            aria-invalid={status === "error" ? "true" : "false"}
            aria-describedby={status === "error" ? errorId : microcopyId}
            className={cn(
              "w-full bg-white/5 border rounded-xl pl-4 pr-[136px] py-3.5 text-white placeholder:text-white/30 outline-none transition-all duration-300",
              "focus:bg-white/8 focus:ring-2 focus:ring-accent/50 focus:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              status === "error"
                ? "border-red-500/50 focus:ring-red-500/40"
                : "border-white/10 focus:border-white/20"
            )}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-white text-black font-semibold text-sm",
              "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              "hover:bg-accent hover:text-white active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
              "flex items-center justify-center min-w-[120px]"
            )}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                <span>{SITE_CONFIG.loadingMessage}</span>
              </>
            ) : (
              <>
                {SITE_CONFIG.cta}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {status === "error" && (
          <div
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="flex items-center space-x-1.5 mt-2.5 text-red-400 animate-fade-in"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <p className="text-xs font-medium">{SITE_CONFIG.errorMessage}</p>
          </div>
        )}
      </form>

      {/* Privacy microcopy */}
      <p className="text-center text-xs text-white/30 mt-3">
        {SITE_CONFIG.privacyNote}
      </p>
    </div>
  );
}
