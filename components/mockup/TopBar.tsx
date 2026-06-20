export function TopBar() {
  return (
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
  );
}
