import { FEATURES, FEATURE_CATEGORIES } from "@/lib/constants";
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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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

// ⚡ Bolt Optimization: Pre-calculate complex Tailwind class strings outside
// of the React render loop. Running `cn` (clsx + tailwind-merge) inside
// .map() during every render cycle wastes CPU cycles on static data.
const FEATURES_BY_CATEGORY = FEATURE_CATEGORIES.map((cat) => ({
  ...cat,
  features: FEATURES.filter((f) => f.category === cat.key).map((feature, index) => {
    const isFeatured = feature.featured === true;
    const Icon = ICON_MAP[feature.icon] ?? Zap;

    return {
      ...feature,
      Icon,
      isFeatured,
      delay: `${index * 60 + 200}ms`,
      articleClass: cn(
        "glass rounded-2xl glass-hover group p-7",
        "animate-fade-in-up border",
        isFeatured
          ? "border-accent/20 bg-accent/[0.03] md:col-span-1 relative overflow-hidden"
          : "border-white/5"
      ),
      iconContainerClass: cn(
        "h-11 w-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300",
        isFeatured
          ? "bg-accent/15 border border-accent/30 group-hover:bg-accent/25"
          : "bg-white/5 border border-white/8 group-hover:bg-white/10 group-hover:border-white/15"
      ),
      iconClass: cn(
        "h-5 w-5",
        isFeatured ? "text-accent" : "text-white/60 group-hover:text-white/80"
      )
    };
  }),
}));

export function Features() {
  return (
    <section
      className="py-24 md:py-32 container mx-auto px-4"
      aria-labelledby="features-heading"
    >
      <div className="text-center mb-16 md:mb-20">
        <h2
          id="features-heading"
          className="text-3xl md:text-5xl font-bold mb-5 text-white tracking-tight"
        >
          Built for the full trading workflow
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          TraderAdd connects your trades, notes, charts, analytics, and AI reviews into
          one structured system — so you can improve your process, not just track your
          P&amp;L.
        </p>
      </div>

      <div className="space-y-16">
        {FEATURES_BY_CATEGORY.map((cat) => {
          return (
            <div key={cat.key}>
              {/* Category label */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-px flex-1 bg-white/5" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                  {cat.label}
                </span>
                <div className="h-px flex-1 bg-white/5" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cat.features.map((feature) => {
                  const { Icon, isFeatured } = feature;

                  return (
                    <article
                      key={feature.title}
                      className={feature.articleClass}
                      style={{ animationDelay: feature.delay }}
                    >
                      {isFeatured && (
                        <div
                          className="absolute top-0 right-0 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-accent bg-accent/10 border-l border-b border-accent/20 rounded-bl-xl"
                          aria-label="Featured capability"
                        >
                          AI-Powered
                        </div>
                      )}

                      <div
                        className={feature.iconContainerClass}
                        aria-hidden="true"
                      >
                        <Icon className={feature.iconClass} />
                      </div>

                      <h3 className="text-base font-semibold mb-2.5 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
