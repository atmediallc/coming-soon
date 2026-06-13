import { cn } from "@/lib/utils";

export function Mockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 mt-20 md:mt-32 animate-fade-in-up [animation-delay:400ms]">
      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-accent/20 blur-[120px] rounded-full animate-glow pointer-events-none" />
      
      {/* Main Mockup Container */}
      <div className="relative glass rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/9] md:aspect-[21/9]">
        {/* Abstract Interface Content */}
        <div className="p-4 md:p-8 grid grid-cols-12 gap-4 h-full opacity-60">
          {/* Sidebar Sidebar */}
          <div className="hidden md:block col-span-2 space-y-4 border-r border-white/5 pr-4 h-full">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
            <div className="pt-8 space-y-4">
               <div className="h-8 w-8 bg-white/10 rounded-full" />
               <div className="h-4 w-full bg-white/5 rounded" />
            </div>
          </div>
          
          {/* Main Body content */}
          <div className="col-span-12 md:col-span-10 space-y-8 pl-4 h-full">
            {/* Header Area */}
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-white/10 rounded" />
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-white/5 rounded-full" />
                <div className="h-8 w-8 bg-white/5 rounded-full" />
              </div>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 md:h-32 bg-white/5 rounded-xl border border-white/5 p-4 space-y-4">
                   <div className="h-2 w-1/2 bg-white/10 rounded" />
                   <div className="h-4 w-3/4 bg-white/20 rounded" />
                </div>
              ))}
            </div>
            
            {/* Bottom Graph area */}
            <div className="relative h-full max-h-48 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
               <div className="absolute inset-0 flex items-end">
                 <div className="w-full h-1/2 bg-gradient-to-t from-accent/10 to-transparent" />
               </div>
               <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                 <path 
                   d="M0,35 Q10,30 20,32 T40,25 T60,28 T80,15 T100,20" 
                   fill="none" 
                   stroke="rgba(59, 130, 246, 0.4)" 
                   strokeWidth="0.5"
                 />
                 <path 
                   d="M0,38 Q10,35 20,38 T40,30 T60,33 T80,20 T100,25" 
                   fill="none" 
                   stroke="rgba(255, 255, 255, 0.1)" 
                   strokeWidth="0.5"
                 />
               </svg>
            </div>
          </div>
        </div>
        
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
      </div>
    </div>
  );
}
