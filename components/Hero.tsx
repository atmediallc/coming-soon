import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { Badge } from "./Badge";
import { WaitlistForm } from "./WaitlistForm";
import { LaunchTimer } from "./LaunchTimer";

export function Hero() {
  return (
    <section
      className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden"
      aria-labelledby="hero-headline"
    >
      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-10 animate-fade-in-up">
          <Image
            src="/traderadd-dark.png"
            alt="TraderAdd"
            width={220}
            height={60}
            priority
            className="h-12 w-auto md:h-14"
          />
        </div>

        <Badge className="mb-8">{SITE_CONFIG.badge}</Badge>

        <h1
          id="hero-headline"
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 animate-fade-in-up"
        >
          <span className="text-gradient leading-[1.1] block">
            {SITE_CONFIG.headline}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-12 animate-fade-in-up [animation-delay:100ms] leading-relaxed">
          {SITE_CONFIG.subheadline}
        </p>

        <div className="flex flex-col items-center mb-16 space-y-0">
          <WaitlistForm />
          <LaunchTimer />
        </div>
      </div>

      {/* Background radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-accent/15 blur-[150px] rounded-full opacity-50 animate-glow" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10" />
      </div>
    </section>
  );
}
