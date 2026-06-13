import { SITE_CONFIG } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-10">
          <p className="text-sm font-bold text-white/30 uppercase tracking-[0.3em]">
            Targeted at peak performance operators
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Abstract CSS Logos */}
             <div className="flex items-center space-x-3 group">
               <div className="h-6 w-6 border-2 border-white rounded-sm group-hover:border-accent transition-colors" />
               <span className="font-bold text-lg text-white tracking-tighter">DISCRETIONARY</span>
             </div>
             
             <div className="flex items-center space-x-3 group">
               <div className="h-6 w-6 bg-white rounded-full group-hover:bg-accent transition-colors" />
               <span className="font-bold text-lg text-white tracking-tighter">FUNDED LABS</span>
             </div>
             
             <div className="flex items-center space-x-3 group">
               <div className="h-0 w-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-white group-hover:border-b-accent transition-colors" />
               <span className="font-bold text-lg text-white tracking-tighter">QUANT TEAMS</span>
             </div>
             
             <div className="flex items-center space-x-3 group">
               <div className="relative h-6 w-6">
                 <div className="absolute inset-0 border-2 border-white rounded-sm group-hover:border-accent" />
                 <div className="absolute top-1 left-1 h-4 w-4 bg-white group-hover:bg-accent" />
               </div>
               <span className="font-bold text-lg text-white tracking-tighter">PERFORMANCE COACHES</span>
             </div>
          </div>
          
          <p className="text-muted text-sm max-w-2xl font-medium leading-relaxed italic">
            &quot;{SITE_CONFIG.socialProof}&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
