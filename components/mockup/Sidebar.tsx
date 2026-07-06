export function Sidebar() {
  return (
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
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white/50" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d={d} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
      <div className="mt-auto h-7 w-7 rounded-full bg-white/5" aria-hidden="true" />
    </nav>
  );
}
