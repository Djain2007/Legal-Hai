import { Link, useLocation } from "react-router-dom";
import logoUrl from "@/logo/logo.png";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  Settings, 
  HelpCircle,
  History,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SideNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-surface-container-lowest h-screen w-64 border-r border-outline-variant/30 hidden lg:flex flex-col p-4 gap-2 z-20 shrink-0 sticky top-0">
      <div className="px-4 py-6 mb-4">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 mb-1">
          <img src={logoUrl} alt="Legal Hai Logo" className="w-20 h-auto object-contain scale-110" />
          <span className="ai-gradient-text">Legal Hai!</span>
        </Link>
        <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">AI Legal Assistant</div>
      </div>

      <Link 
        to="/upload" 
        className="mb-6 w-full bg-linear-to-r from-primary to-secondary text-on-primary font-semibold py-2.5 px-4 rounded-full shadow-[0_4px_20px_rgba(10,31,68,0.1)] hover:shadow-[0_10px_30px_rgba(86,68,208,0.15)] hover:opacity-95 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> New Analysis
      </Link>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2">
        <NavItem to="/history" icon={History} label="History" active={currentPath === '/history'} />
        <NavItem to="/contract-review" icon={ShieldCheck} label="Contract Review" active={currentPath === '/contract-review'} />
        <NavItem to="/risk-reports" icon={AlertTriangle} label="Risk Reports" active={currentPath === '/risk-reports'} />
        <NavItem to="/clause-library" icon={BookOpen} label="Clause Library" active={currentPath === '/clause-library'} />
      </div>

      <div className="mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
        <NavItem to="/settings" icon={Settings} label="Settings" active={currentPath === '/settings'} />
      </div>
    </nav>
  );
}

function NavItem({ to, icon: Icon, label, active = false }: { to: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
        active 
          ? "bg-linear-to-r from-primary-fixed to-transparent text-primary font-bold shadow-sm border-l-4 border-primary" 
          : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1 border-l-4 border-transparent"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-primary fill-primary/20" : "")} /> 
      {label}
    </Link>
  );
}
