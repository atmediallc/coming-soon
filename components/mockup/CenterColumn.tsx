import { MOCKUP_DATA } from "@/lib/constants";

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

// ⚡ Bolt Optimization: Hoisted CALENDAR_COLORS outside the component
// This prevents recreating the same 5-element array 28 times per render inside the map() loop
const CALENDAR_COLORS = [
  "rgba(255,255,255,0.04)",
  "rgba(59,130,246,0.18)",
  "rgba(59,130,246,0.35)",
  "rgba(59,130,246,0.55)",
  "rgba(59,130,246,0.75)"
] as const;

export function CenterColumn() {
  return (
    <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col gap-3">

      {/* Candlestick chart */}
      <div className="flex-1 glass rounded-xl overflow-hidden relative border border-white/5 min-h-[160px]">
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
          {CALENDAR_CELLS.map((intensity, i) => {
            return (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor: CALENDAR_COLORS[intensity] || CALENDAR_COLORS[0],
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
