import { MOCKUP_DATA } from "@/lib/constants";

export function RightColumn() {
  return (
    <div className="hidden lg:flex col-span-3 flex-col gap-3">

      {/* Backtest preview */}
      <div className="glass p-3.5 rounded-xl border border-white/5 flex-1">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">
          Backtest Preview
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-white/50">Win rate</span>
            <span className="text-[11px] font-bold text-emerald-400 tabular-nums">{MOCKUP_DATA.backtestWinRate}</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: MOCKUP_DATA.backtestWinRate }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-white/50">Sharpe</span>
            <span className="text-[11px] font-bold text-white tabular-nums">{MOCKUP_DATA.backtestSharpe}</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-accent/50 rounded-full" style={{ width: "65%" }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-white/50">Profit factor</span>
            <span className="text-[11px] font-bold text-white tabular-nums">{MOCKUP_DATA.profitFactor}</span>
          </div>
        </div>
      </div>

      {/* Risk / Discipline card */}
      <div className="glass p-3.5 rounded-xl border border-white/5 shrink-0">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">
          Risk &amp; Discipline
        </p>
        <div className="space-y-2">
          {[
            { label: "Rule adherence", value: 91, color: "bg-emerald-500/60" },
            { label: "Avg. risk / trade", value: 74, color: "bg-accent/60" },
            { label: "Overtrading alerts", value: 12, color: "bg-red-500/50" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-white/40">{item.label}</span>
                <span className="text-[10px] font-bold text-white tabular-nums">{item.value}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between">
          <span className="text-[9px] text-white/30 uppercase tracking-widest">Journal Quality</span>
          <span className="text-[10px] font-bold text-accent">{MOCKUP_DATA.journalQuality}</span>
        </div>
      </div>
    </div>
  );
}
