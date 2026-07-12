import { SITE_CONFIG } from "@/lib/constants";

export function Disclaimer() {
  return (
    <aside
      className="py-8 border-t border-white/5 bg-white/[0.01]"
      aria-label="Legal disclaimer"
    >
      <div className="container mx-auto px-4">
        <p className="text-center text-xs text-muted max-w-2xl mx-auto leading-relaxed">
          TraderAdd is built for trading review and workflow improvement. It does not
          provide financial advice or guarantee trading results.{" "}
          <span className="text-white/50">{SITE_CONFIG.disclaimer}</span>
        </p>
      </div>
    </aside>
  );
}
