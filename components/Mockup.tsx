import { MOCKUP_DATA } from "@/lib/constants";

export function Mockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 mt-20 md:mt-32 animate-fade-in-up [animation-delay:400ms]">
      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-accent/20 blur-[120px] rounded-full animate-glow pointer-events-none" />
      
      {/* Main Mockup Container */}
      <div className="relative glass rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 aspect-[16/10] md:aspect-[21/10]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="hidden md:flex w-16 lg:w-20 flex-col items-center py-6 border-r border-white/5 space-y-8">
            <div className="h-8 w-8 rounded-lg bg-white/10" />
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 w-6 rounded-md bg-white/5" />
              ))}
            </div>
            <div className="mt-auto h-8 w-8 rounded-full bg-white/5" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/5 rounded" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-white/5" />
                <div className="h-8 w-24 rounded-lg bg-accent/20 border border-accent/30" />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="grid grid-cols-12 gap-6 h-full">
                
                {/* Left Column - Stats */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
                  {/* P&L Card */}
                  <div className="glass p-5 rounded-xl border-l-4 border-emerald-500/50">
                    <p className="text-xs text-muted mb-1 font-medium uppercase tracking-wider">Net P&L (Monthly)</p>
                    <p className="text-2xl font-bold text-emerald-400">{MOCKUP_DATA.netPnL}</p>
                  </div>
                  
                  {/* Win Rate */}
                  <div className="glass p-5 rounded-xl">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs text-muted font-medium uppercase tracking-wider">Win Rate</p>
                      <p className="text-lg font-bold text-white">{MOCKUP_DATA.winRate}</p>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: MOCKUP_DATA.winRate }} />
                    </div>
                  </div>

                  {/* AI Insight Card */}
                  <div className="glass p-5 rounded-xl border border-accent/20 bg-accent/5">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">AI Coach Insight</p>
                    </div>
                    <p className="text-xs leading-relaxed text-white/80 italic">
                      &quot;{MOCKUP_DATA.aiInsight}&quot;
                    </p>
                  </div>
                </div>

                {/* Middle Column - Chart */}
                <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col space-y-6">
                  <div className="flex-1 glass rounded-xl overflow-hidden relative border border-white/5 min-h-[200px]">
                    <div className="absolute top-4 left-4 z-10 space-y-1">
                      <div className="h-4 w-24 bg-white/10 rounded" />
                      <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                    
                    {/* Chart Visualization */}
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,35 L10,32 L20,34 L30,28 L40,22 L50,25 L60,18 L70,20 L80,12 L90,15 L100,10 V40 H0 Z" 
                          fill="url(#chartGradient)"
                        />
                        <path 
                          d="M0,35 L10,32 L20,34 L30,28 L40,22 L50,25 L60,18 L70,20 L80,12 L90,15 L100,10" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="0.5"
                          strokeLinecap="round"
                        />
                        {/* Candlesticks abstract - fixed values to avoid impurity */}
                        {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((x, i) => (
                          <line 
                            key={i}
                            x1={x} 
                            y1={25 - (i % 3) * 3} 
                            x2={x} 
                            y2={35 - (i % 2) * 4} 
                            stroke="rgba(255, 255, 255, 0.1)" 
                            strokeWidth="0.2"
                          />
                        ))}
                      </svg>
                    </div>
                  </div>
                  
                  {/* Pulse/Calendar abstract */}
                  <div className="h-24 glass rounded-xl p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                       <div className="h-3 w-32 bg-white/5 rounded" />
                       <div className="flex space-x-1">
                         {[1, 2, 3].map(i => <div key={i} className="h-2 w-6 bg-white/5 rounded" />)}
                       </div>
                    </div>
                    <div className="flex-1 flex space-x-1 items-end">
                      {[...Array(24)].map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 rounded-sm transition-all duration-500" 
                          style={{ 
                            height: `${30 + (i * 7) % 70}%`,
                            backgroundColor: `rgba(59, 130, 246, ${0.2 + (i % 5) * 0.1})`
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Secondary Stats/Journal */}
                <div className="hidden lg:flex col-span-3 flex-col space-y-6">
                   <div className="glass p-5 rounded-xl flex-1 flex flex-col">
                      <div className="h-4 w-32 bg-white/10 rounded mb-6" />
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between">
                               <div className="h-3 w-16 bg-white/5 rounded" />
                               <div className="h-3 w-8 bg-white/10 rounded" />
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-white/10" style={{ width: `${50 + (i * 13) % 40}%` }} />
                             </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex justify-between text-[10px] text-muted font-bold uppercase tracking-wider mb-2">
                          <span>Journal Quality</span>
                          <span className="text-accent">{MOCKUP_DATA.journalQuality}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-accent w-[85%]" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
      </div>
    </div>
  );
}
