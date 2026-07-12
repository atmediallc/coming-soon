import { AUDIENCE_PROFILES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ⚡ Bolt Optimization: Pre-calculate complex Tailwind class strings and hoist
// arrays outside of the React render loop. Running `cn` inside .map() during
// every render cycle wastes CPU cycles on static data.
const AUDIENCE_PROFILES_ENHANCED = AUDIENCE_PROFILES.map(profile => ({
  ...profile,
  className: cn(
    "glass rounded-2xl p-5 text-left",
    "border border-white/5 hover:border-white/10 transition-colors duration-300"
  )
}));

// Static CSS icon shapes — no external assets
const ICONS: Record<string, React.ReactNode> = {
  chart: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

export function SocialProof() {
  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.01]" aria-labelledby="audience-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-12">

          <div className="space-y-4">
            <p className="text-xs font-bold text-white/25 uppercase tracking-[0.35em]">
              Who this is for
            </p>
            <h2 id="audience-heading" className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Built for process-driven traders.
            </h2>
            <p className="text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              For discretionary traders, funded account traders, trading teams, and
              performance-focused operators who want a clearer review workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            {AUDIENCE_PROFILES_ENHANCED.map((profile) => (
              <div
                key={profile.label}
                className={profile.className}
              >
                <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                  {ICONS[profile.icon]}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{profile.label}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{profile.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
