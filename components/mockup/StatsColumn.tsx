import { MOCKUP_DATA } from "@/lib/constants";

export function StatsColumn() {
  return (
    <div className="col-span-12 md:col-span-4 lg:col-span-3 flex md:flex-col gap-3 md:gap-3 flex-wrap md:flex-nowrap">

      {/* Net P&L */}
      <div className="glass p-3.5 rounded-xl border-l-[3px] border-emerald-500/60 flex-1 md:flex-none">
        <p className="text-[10px] text-white/40 mb-1 font-medium uppercase tracking-widest">
          Net P&amp;L · Monthly
        </p>
        <p className="text-xl font-bold text-emerald-400 tabular-nums">
          {MOCKUP_DATA.netPnL}
        </p>
      </div>

      {/* Win Rate */}
      <div className="glass p-3.5 rounded-xl flex-1 md:flex-none">
        <div className="flex justify-between items-end mb-2">
          <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Win Rate</p>
          <p className="text-base font-bold text-white tabular-nums">{MOCKUP_DATA.winRate}</p>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden" role="meter" aria-valuenow={68} aria-valuemin={0} aria-valuemax={100} aria-label="Win rate">
          <div className="h-full bg-accent rounded-full" style={{ width: MOCKUP_DATA.winRate }} />
        </div>
      </div>

      {/* Mini stats row */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        <div className="glass p-3 rounded-xl text-center">
          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">R Multiple</p>
          <p className="text-sm font-bold text-white tabular-nums">{MOCKUP_DATA.rMultiple}</p>
        </div>
        <div className="glass p-3 rounded-xl text-center">
          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Reviews</p>
          <p className="text-sm font-bold text-white tabular-nums">{MOCKUP_DATA.tradesReviewed}</p>
        </div>
      </div>

      {/* AI Coach Insight — the hero differentiator */}
      <div className="glass p-3.5 md:p-4 rounded-xl border border-accent/25 bg-accent/[0.06] flex-1 md:flex-none">
        <div className="flex items-center space-x-2 mb-2.5">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" aria-hidden="true" />
          <p className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">
            AI Coach Insight
          </p>
        </div>
        <p className="text-[11px] leading-relaxed text-white/70">
          &ldquo;{MOCKUP_DATA.aiInsight}&rdquo;
        </p>
        <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-white/30 uppercase tracking-widest">Review Score</span>
          <span className="text-xs font-bold text-accent">{MOCKUP_DATA.reviewScore}</span>
        </div>
      </div>
    </div>
  );
}
