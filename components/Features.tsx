import { FEATURES } from "@/lib/constants";
import { 
  Book, 
  Brain, 
  BarChart3, 
  CandlestickChart, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Database, 
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  book: Book,
  brain: Brain,
  "bar-chart": BarChart3,
  "candlestick-chart": CandlestickChart,
  calendar: Calendar,
  activity: Activity,
  "shield-check": ShieldCheck,
  database: Database,
  target: Target,
};

export function Features() {
  return (
    <section className="py-24 md:py-32 container mx-auto px-4">
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Built for the full trading workflow
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          From raw trades to a repeatable process. TraderAdd connects your data, 
          emotions, and execution into a single source of truth.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, index) => {
          const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Zap;
          return (
            <div
              key={feature.title}
              className={cn(
                "glass p-8 rounded-2xl glass-hover group",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 50 + 500}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:border-accent/40 transition-colors duration-300">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
