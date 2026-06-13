import { MOCKUP_DATA, SITE_CONFIG } from "@/lib/constants";

// Candlestick data: [open, high, low, close] normalised to viewBox 0-100 height
// All values are static to avoid hydration mismatch
const CANDLES = [
  { x: 4,  open: 72, high: 68, low: 78, close: 70, bull: false },
  { x: 12, open: 70, high: 64, low: 74, close: 66, bull: true  },
  { x: 20, open: 66, high: 60, low: 70, close: 62, bull: true  },
  { x: 28, open: 62, high: 65, low: 58, close: 67, bull: false },
  { x: 36, open: 67, high: 61, low: 70, close: 63, bull: true  },
  { x: 44, open: 63, high: 55, low: 66, close: 57, bull: true  },
  { x: 52, open: 57, high: 60, low: 54, close: 62, bull: false },
  { x: 60, open: 62, high: 56, low: 65, close: 58, bull: true  },
  { x: 68, open: 58, high: 50, low: 61, close: 52, bull: true  },
  { x: 76, open: 52, high: 55, low: 49, close: 57, bull: false },
  { x: 84, open: 57, high: 50, low: 60, close: 52, bull: true  },
  { x: 92, open: 52, high: 44, low: 55, close: 46, bull: true  },
];

const CANDLEWIDTH = 4;

// Calendar heat map: static intensity values (0–4 scale)
const CALENDAR_CELLS = [
  0,1,2,0,3,1,0,
  2,3,1,4,2,0,1,
  1,0,3,2,1,3,2,
  4,2,1,0,3,2,1,
];

export function Mockup() {
  return (
    <div
      className="relative w-full max-w-6xl mx-auto px-4 mt-16 md:mt-28 animate-fade-in-up [animation-delay:400ms]"
      aria-label="TraderAdd product preview"
      role="img"
    >
      {/* Glow halo */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-accent/15 blur-[110px] rounded-full animate-glow pointer-events-none"
        aria-hidden="true"
      />

      {/* Sample data disclaimer */}
      <p className="text-center text-[11px] text-white/25 mb-3 tracking-wide">
        {SITE_CONFIG.sampleDataDisclaimer}
      </p>

      {/* Dashboard shell */}
      <div className="relative glass rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/10">

        {/* Window chrome */}
        <div className="flex items-center h-10 px-4 border-b border-white/5 bg-white/[0.015]" aria-hidden="true">
          <div className="flex space-x-1.5 mr-4">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[11px] font-bold text-white/20 tracking-tighter select-none">
            {SITE_CONFIG.productName} · Dashboard
          </span>
        </div>

        <div className="flex" style={{ minHeight: "420px" }}>

          {/* ── Sidebar ── */}
          <nav
            className="hidden md:flex w-14 lg:w-16 flex-col items-center py-5 border-r border-white/5 space-y-5"
            aria-label="App navigation"
          >
            {/* Logo mark */}
            <div className="h-7 w-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-black text-accent leading-none">TA</span>
            </div>
            {/* Nav icons */}
            {[
              "M3 12h18M3 6h18M3 18h18",
              "M12 20V4M4 12l8-8 8 8",
              "M3 3h18v18H3z",
              "M12 3v9l4 2",
              "M9 19V6l12-3v13",
            ].map((d, i) => (
              <div key={i} className="h-7 w-7 rounded-md bg-white/5 flex items-center justify-center" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white/20" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d={d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
            <div className="mt-auto h-7 w-7 rounded-full bg-white/5" aria-hidden="true" />
          </nav>

          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Top bar */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0" aria-hidden="true">
              <div className="flex items-center space-x-3">
                <div className="h-3.5 w-28 bg-white/10 rounded" />
                <div className="hidden sm:block h-3.5 w-16 bg-white/5 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-full bg-white/5" />
                <div className="hidden sm:block h-7 w-20 rounded-lg bg-accent/15 border border-accent/25 shrink-0" />
              </div>
            </div>

            {/* Content grid */}
            <div className="flex-1 p-3 md:p-5 overflow-hidden">
              <div className="grid grid-cols-12 gap-3 md:gap-4 h-full">

                {/* ── Left stats column ── */}
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

                {/* ── Center: chart + calendar ── */}
                <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col gap-3">

                  {/* Candlestick chart */}
                  <div className="flex-1 glass rounded-xl overflow-hidden relative border border-white/5" style={{ minHeight: "160px" }}>
                    <div className="absolute top-3 left-3.5 z-10" aria-hidden="true">
                      <p className="text-[10px] font-semibold text-white/50 tracking-wide">Equity Curve · 90d</p>
                    </div>

                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>

                      {/* Equity fill area */}
                      <path
                        d="M0,72 L8,70 L16,66 L24,62 L32,66 L40,63 L48,57 L56,57 L64,58 L72,52 L80,52 L88,46 L96,46 V100 H0 Z"
                        fill="url(#equityGradient)"
                      />
                      {/* Equity line */}
                      <path
                        d="M0,72 L8,70 L16,66 L24,62 L32,66 L40,63 L48,57 L56,57 L64,58 L72,52 L80,52 L88,46 L96,46"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Abstract candlesticks */}
                      {CANDLES.map((c) => (
                        <g key={c.x} aria-hidden="true">
                          {/* Wick */}
                          <line
                            x1={c.x} y1={c.high}
                            x2={c.x} y2={c.low}
                            stroke={c.bull ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)"}
                            strokeWidth="0.4"
                          />
                          {/* Body */}
                          <rect
                            x={c.x - CANDLEWIDTH / 2}
                            y={Math.min(c.open, c.close)}
                            width={CANDLEWIDTH}
                            height={Math.max(Math.abs(c.open - c.close), 1)}
                            fill={c.bull ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}
                            rx="0.5"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Calendar Intelligence */}
                  <div className="glass rounded-xl p-3.5 border border-white/5 shrink-0">
                    <div className="flex items-center justify-between mb-2.5" aria-hidden="true">
                      <p className="text-[10px] font-semibold text-white/50 tracking-wide">
                        Calendar Intelligence
                      </p>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {MOCKUP_DATA.calendarStreak}
                      </span>
                    </div>
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }} aria-hidden="true">
                      {CALENDAR_CELLS.map((intensity, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-sm"
                          style={{
                            backgroundColor:
                              intensity === 0
                                ? "rgba(255,255,255,0.04)"
                                : intensity === 1
                                ? "rgba(59,130,246,0.18)"
                                : intensity === 2
                                ? "rgba(59,130,246,0.35)"
                                : intensity === 3
                                ? "rgba(59,130,246,0.55)"
                                : "rgba(59,130,246,0.75)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right column: backtest + risk ── */}
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

              </div>
            </div>
          </div>
        </div>

        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
