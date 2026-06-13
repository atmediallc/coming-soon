import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="text-xl font-bold text-white mb-2 tracking-tighter">
              TraderAdd
            </div>
            <p className="text-sm text-muted max-w-xs">
              Transforming raw trading data into a professional edge.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <a 
              href={SITE_CONFIG.links.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a 
              href={SITE_CONFIG.links.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href={SITE_CONFIG.links.contact} 
              className="text-sm text-muted hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[10px] md:text-xs text-white/30 font-medium uppercase tracking-[0.2em]">
            &copy; {currentYear} TraderAdd. All rights reserved.
          </p>
          <p className="text-[10px] md:text-xs text-white/20 italic">
            {SITE_CONFIG.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
