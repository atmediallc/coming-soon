import { Hero } from "@/components/Hero";
import { Mockup } from "@/components/Mockup";
import { Features } from "@/components/Features";
import { Process } from "@/components/Process";
import { SocialProof } from "@/components/SocialProof";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground bg-grid">
      {/* Abstract background blobs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-accent/5 blur-[150px] rounded-full animate-float opacity-30" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-accent/10 blur-[150px] rounded-full animate-float opacity-20" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative">
        <Hero />
        <Mockup />
        <SocialProof />
        <Process />
        <Features />
        <Footer />
      </div>
    </main>
  );
}
