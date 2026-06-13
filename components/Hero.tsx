import { SITE_CONFIG } from "@/lib/constants";
import { Badge } from "./Badge";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <Badge className="mb-8">{SITE_CONFIG.badge}</Badge>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 animate-fade-in-up">
          <span className="text-gradient leading-[1.1] block">
            {SITE_CONFIG.tagline}
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-12 animate-fade-in-up [animation-delay:100ms] leading-relaxed">
          {SITE_CONFIG.description}
        </p>
        
        <div className="flex justify-center mb-16">
          <WaitlistForm />
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent/20 blur-[150px] rounded-full opacity-40 animate-glow" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-20" />
      </div>
    </section>
  );
}
