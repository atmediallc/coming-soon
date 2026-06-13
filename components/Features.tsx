import { FEATURES } from "@/lib/constants";
import { 
  Zap, 
  Globe, 
  BarChart3, 
  Shield, 
  Cpu, 
  Layers 
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  zap: Zap,
  globe: Globe,
  "bar-chart": BarChart3,
  shield: Shield,
  cpu: Cpu,
  layers: Layers,
};

export function Features() {
  return (
    <section className="py-24 md:py-32 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, index) => {
          const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Zap;
          return (
            <div
              key={feature.title}
              className={cn(
                "glass p-8 rounded-2xl glass-hover",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
