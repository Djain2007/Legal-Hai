import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, History, Settings, Upload, ShieldCheck, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/30 z-50 px-2 py-2 flex justify-between items-center pb-safe">
      <NavItem to="/history" icon={History} label="History" active={currentPath === '/history'} />
      <NavItem to="/contract-review" icon={ShieldCheck} label="Review" active={currentPath === '/contract-review'} />
      <div className="relative -top-5 shrink-0 mx-1">
        <Link 
          to="/upload" 
          className="bg-linear-to-r from-primary to-secondary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-secondary/30 border-4 border-surface hover:scale-105 transition-transform"
        >
          <Upload className="w-6 h-6" />
        </Link>
      </div>
      <NavItem to="/clause-library" icon={BookOpen} label="Library" active={currentPath === '/clause-library'} />
      <NavItem to="/settings" icon={Settings} label="Settings" active={currentPath === '/settings'} />
    </div>
  );
}

function NavItem({ to, icon: Icon, label, active = false }: { to: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center w-16 h-12 gap-1 transition-colors",
        active ? "text-primary" : "text-on-surface-variant hover:text-primary"
      )}
    >
      <div className={cn("flex items-center justify-center rounded-full transition-all duration-300", active ? "bg-primary-fixed w-12 h-7" : "w-7 h-7")}>
        <Icon className={cn("w-5 h-5", active ? "text-primary fill-primary/20" : "")} />
      </div>
      <span className={cn("text-[10px] leading-none transition-all", active ? "font-bold" : "font-medium")}>{label}</span>
    </Link>
  );
}
