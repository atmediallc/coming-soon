import { PROCESS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ⚡ Bolt Optimization: Pre-calculate complex Tailwind class strings outside
// of the React render loop to avoid running `cn` (clsx + tailwind-merge)
// during every render cycle.
const PROCESS_STEPS_REGULAR = PROCESS_STEPS.filter((s) => !s.isOutput).map(step => ({
  ...step,
  stepNumberClass: cn(
    "h-8 w-8 rounded-full flex items-center justify-center border border-white/10 shrink-0 mt-0.5",
    step.highlighted ? "bg-accent/30 border-accent/40" : "bg-white/8"
  ),
  contentClass: cn(
    "flex-1 glass p-3.5 rounded-xl border border-white/5",
    step.highlighted && "border-accent/20 bg-accent/[0.04]"
  ),
  labelClass: cn(
    "font-semibold text-sm",
    step.highlighted ? "text-accent" : "text-white"
  )
}));
const PROCESS_STEPS_OUTPUT = PROCESS_STEPS.filter((s) => s.isOutput);

export function Process() {
  return (
    <section
      className="py-24 md:py-32 bg-white/[0.02] border-y border-white/5 overflow-hidden"
      aria-labelledby="process-heading"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left copy */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h2
              id="process-heading"
              className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
            >
              From raw trades to a{" "}
              <span className="text-accent">repeatable process.</span>
            </h2>
            <p className="text-muted text-lg max-w-xl">
              Most journals just store data. TraderAdd builds a system. We connect your
              execution with your notes, charts, and AI reviews to surface the patterns
              that actually drive your performance.
            </p>
            <ul className="flex flex-col space-y-4 pt-4" aria-label="Key outcomes">
              {[
                "Identify behavioral patterns behind your results",
                "Spot your highest-quality setups across sessions",
                "Professionalize your daily review workflow",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center space-x-3 justify-center lg:justify-start"
                >
                  <span
                    className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-sm text-white/80 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: flow diagram */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative glass p-8 md:p-10 rounded-3xl border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-8 pointer-events-none" aria-hidden="true" />

              <ol className="relative flex flex-col space-y-5" aria-label="TraderAdd workflow steps">
                {PROCESS_STEPS_REGULAR.map((step, i, arr) => (
                  <li key={step.label} className="flex items-start space-x-4 relative">
                    {/* Connector line */}
                    {i < arr.length - 1 && (
                      <div
                        className="absolute left-[15px] top-9 w-[2px] h-5 bg-gradient-to-b from-white/10 to-transparent"
                        aria-hidden="true"
                      />
                    )}
                    {/* Step number */}
                    <div
                      className={step.stepNumberClass}
                      aria-hidden="true"
                    >
                      <span className="text-[11px] font-bold text-white">{i + 1}</span>
                    </div>
                    {/* Content */}
                    <div className={step.contentClass}>
                      <p className={step.labelClass}>
                        {step.label}
                      </p>
                      <p className="text-[12px] text-white/40 mt-0.5">{step.description}</p>
                    </div>
                  </li>
                ))}

                {/* Arrow divider */}
                <li aria-hidden="true" className="flex justify-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/20" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </li>

                {/* Output */}
                {PROCESS_STEPS_OUTPUT.map((step) => (
                  <li key={step.label}>
                    <div className="glass p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] flex flex-col items-center text-center space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                        Output
                      </div>
                      <div className="text-lg font-bold text-white tracking-tight">
                        {step.label}
                      </div>
                      <p className="text-[12px] text-white/40">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
