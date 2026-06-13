import { SITE_CONFIG } from "@/lib/constants";
import { Badge } from "./Badge";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <Badge className="mb-6">{SITE_CONFIG.badge}</Badge>
        
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
          <span className="text-gradient leading-tight block">
            {SITE_CONFIG.tagline}
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-10 animate-fade-in-up [animation-delay:100ms]">
          {SITE_CONFIG.description}
        </p>
        
        <div className="flex justify-center">
          <WaitlistForm />
        </div>
        
        <p className="mt-8 text-sm text-white/40 animate-fade-in [animation-delay:600ms]">
          {SITE_CONFIG.socialProof}
        </p>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/10 blur-[120px] rounded-full opacity-50" />
      </div>
    </section>
  );
}
