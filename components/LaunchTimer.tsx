"use client";

import { useState, useEffect } from "react";
import { LAUNCH_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

function getDaysRemaining(targetDate: string): number {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * We compute days remaining lazily using a useState initializer on first render.
 * This avoids hydration mismatch by gating rendering on client-only state.
 * A useEffect ensures the timer stays updated if the page is left open.
 */
export function LaunchTimer() {
  const [days, setDays] = useState<number>(() => getDaysRemaining(LAUNCH_CONFIG.targetDate));

  useEffect(() => {
    if (!LAUNCH_CONFIG.enabled) return;

    const interval = setInterval(() => {
      setDays(getDaysRemaining(LAUNCH_CONFIG.targetDate));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const isOpen = days === 0;

  if (!LAUNCH_CONFIG.enabled) return null;

  const progressPercent = LAUNCH_CONFIG.progressPercent;

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto mt-5",
        "glass rounded-xl border border-white/8 px-4 py-3.5",
        "animate-fade-in-up [animation-delay:350ms]"
      )}
      aria-label="Launch timeline"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
            {isOpen ? "" : LAUNCH_CONFIG.launchLabel}
          </p>
          <p className="text-sm font-semibold text-white leading-snug">
            {isOpen ? (
              <span className="text-emerald-400">{LAUNCH_CONFIG.openStateLabel}</span>
            ) : (
              <>
                {LAUNCH_CONFIG.launchWindow}
                <span className="ml-2 text-white/40 text-xs font-normal">
                  · {days} days
                </span>
              </>
            )}
          </p>
        </div>

        <div
          className="shrink-0 text-right"
          aria-label={`${progressPercent}% of beta preparation complete`}
        >
          <p className="text-[11px] font-bold text-accent tabular-nums">
            {progressPercent}%
          </p>
          <p className="text-[10px] text-white/30 whitespace-nowrap">
            {LAUNCH_CONFIG.capacityLabel}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={LAUNCH_CONFIG.progressLabel}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isOpen ? "bg-emerald-500" : "bg-accent"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
