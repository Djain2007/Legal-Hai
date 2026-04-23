import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ImageIcon, Menu, X } from "lucide-react";
import logoUrl from "@/logo/logo.png";
import { cn } from "@/lib/utils";

export function TopNav({ hideBrand = false }: { hideBrand?: boolean }) {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-sm w-full">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          {(!hideBrand || (hideBrand && window.innerWidth < 1024)) && (
            <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
              {!isDashboard && <img src={logoUrl} alt="Legal Hai Logo" className="w-20 h-auto object-contain scale-110" />}
              <span className="ai-gradient-text">Legal Hai!</span>
            </Link>
          )}

          <nav className="hidden sm:flex items-center gap-4 lg:gap-8 font-medium">
            <Link to="/history" className="text-on-surface-variant hover:text-primary transition-colors">
              My Documents
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/upload"
            className="hidden sm:flex bg-linear-to-r from-primary to-secondary text-on-primary px-6 py-2.5 rounded-full font-semibold hover:shadow-[0_10px_30px_rgba(86,68,208,0.2)] hover:opacity-95 transition-all shadow-[0_4px_20px_rgba(0,8,30,0.1)] items-center gap-2"
          >
            {!isDashboard && <ImageIcon className="w-4 h-4" />}
            New Analysis
          </Link>
          
          <button 
            className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-variant rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-lg p-4 flex flex-col gap-4">
          <Link 
            to="/history" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 rounded-lg font-medium text-on-surface-variant hover:bg-surface-variant"
          >
            My Documents
          </Link>
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="sm:hidden mt-2 bg-linear-to-r from-primary to-secondary text-on-primary p-3 rounded-xl font-semibold flex justify-center items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            New Analysis
          </Link>
        </div>
      )}
    </header>
  );
}
