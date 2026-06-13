import { SITE_CONFIG, CURRENT_YEAR } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="text-xl font-bold text-white mb-2 tracking-tighter">
              {SITE_CONFIG.productName}
            </div>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              A structured trading workflow for review, analytics and process improvement.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-4" aria-label="Footer navigation">
            <a
              href={SITE_CONFIG.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
            >
              Twitter
            </a>
            <a
              href={SITE_CONFIG.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
            >
              LinkedIn
            </a>
            <a
              href={SITE_CONFIG.links.contact}
              className="text-sm text-muted hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-xs text-white/30 font-medium uppercase tracking-[0.15em]">
            &copy; {CURRENT_YEAR} {SITE_CONFIG.productName}. All rights reserved.
          </p>
          <p className="text-xs text-white/30 italic">
            {SITE_CONFIG.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
