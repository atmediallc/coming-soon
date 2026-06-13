import { SITE_CONFIG } from "@/lib/constants";
import { Send, Globe, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center font-bold text-black text-xl">
              {SITE_CONFIG.name[0]}
            </div>
            <span className="font-bold text-xl tracking-tight">{SITE_CONFIG.name}</span>
          </div>
          
          <div className="text-sm text-white/40">
            © {currentYear} {SITE_CONFIG.name} Inc. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href={SITE_CONFIG.links.twitter} 
              className="text-white/40 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Send className="h-5 w-5" />
            </a>
            <a 
              href={SITE_CONFIG.links.linkedin} 
              className="text-white/40 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a 
              href={SITE_CONFIG.links.contact} 
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Contact Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
