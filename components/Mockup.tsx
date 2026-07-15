import { SITE_CONFIG } from "@/lib/constants";
import { Sidebar } from "./mockup/Sidebar";
import { TopBar } from "./mockup/TopBar";
import { StatsColumn } from "./mockup/StatsColumn";
import { CenterColumn } from "./mockup/CenterColumn";
import { RightColumn } from "./mockup/RightColumn";

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
      <p className="text-center text-[11px] text-muted mb-3 tracking-wide">
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
          <span className="text-[11px] font-bold text-muted tracking-tighter select-none">
            {SITE_CONFIG.productName} · Dashboard
          </span>
        </div>

        <div className="flex min-h-[420px]">

          {/* ── Sidebar ── */}
          <Sidebar />

          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Top bar */}
            <TopBar />

            {/* Content grid */}
            <div className="flex-1 p-3 md:p-5 overflow-hidden">
              <div className="grid grid-cols-12 gap-3 md:gap-4 h-full">

                {/* ── Left stats column ── */}
                <StatsColumn />

                {/* ── Center: chart + calendar ── */}
                <CenterColumn />

                {/* ── Right column: backtest + risk ── */}
                <RightColumn />

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
