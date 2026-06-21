import { Hero } from "@/components/Hero";
import { Mockup } from "@/components/Mockup";
import { SocialProof } from "@/components/SocialProof";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { Disclaimer } from "@/components/Disclaimer";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground focus:outline-none" tabIndex={-1}>
      {/* Ambient background blobs — decorative, hidden from AT */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-accent/5 blur-[160px] rounded-full animate-float opacity-25" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-accent/8 blur-[160px] rounded-full animate-float opacity-15"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      {/* Background grid — hero only via overlay */}
      <div
        className="fixed inset-0 bg-grid-hero opacity-100 pointer-events-none"
        style={{ opacity: 0.6 }}
        aria-hidden="true"
      />

      <div className="relative">
        <Hero />
        <Mockup />
        <SocialProof />
        <Process />
        <Features />
        <Disclaimer />
        <Footer />
      </div>
    </main>
  );
}
