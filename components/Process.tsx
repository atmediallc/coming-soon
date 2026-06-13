import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Raw Trades", color: "bg-white/10" },
  { label: "Notes & Emotion", color: "bg-white/10" },
  { label: "AI Insights", color: "bg-accent/40" },
  { label: "Refined Metrics", color: "bg-white/10" },
];

export function Process() {
  return (
    <section className="py-24 md:py-32 bg-white/[0.02] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              From raw trades to a <span className="text-accent">repeatable process.</span>
            </h2>
            <p className="text-muted text-lg max-w-xl">
              Most journals just store data. TraderAdd builds a system. 
              We connect your execution with your psychology to find the 
              patterns that actually drive your performance.
            </p>
            <div className="flex flex-col space-y-4 pt-4">
               {[
                 "Eliminate emotional revenge trading",
                 "Identify your highest expectancy setups",
                 "Professionalize your daily review workflow"
               ].map((item, i) => (
                 <div key={i} className="flex items-center space-x-3 justify-center lg:justify-start">
                   <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center">
                     <div className="h-2 w-2 rounded-full bg-accent" />
                   </div>
                   <span className="text-sm text-white/80 font-medium">{item}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative glass p-8 md:p-12 rounded-3xl border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
              
              <div className="relative flex flex-col space-y-8">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex items-center space-x-6 relative">
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-[19px] top-10 w-[2px] h-8 bg-gradient-to-b from-white/10 to-transparent" />
                    )}
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border border-white/10 shrink-0", step.color)}>
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>
                    <div className="flex-1 glass p-4 rounded-xl border-white/5 flex justify-between items-center">
                      <span className="font-semibold text-white">{step.label}</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3].map(j => <div key={j} className="h-1 w-4 bg-white/10 rounded-full" />)}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-8 border-t border-white/10">
                   <div className="glass p-6 rounded-2xl border-accent/30 bg-accent/5 flex flex-col items-center text-center space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Output</div>
                      <div className="text-xl font-bold text-white tracking-tight">Professional Edge</div>
                      <div className="flex space-x-2">
                         {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-8 bg-accent/40 rounded-full" />)}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
