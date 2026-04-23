import { TopNav } from "@/components/TopNav";
import React from "react";
import { SideNav } from "@/components/SideNav";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-surface text-on-surface font-sans antialiased overflow-hidden">
      <SideNav />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden pb-24 sm:pb-20 lg:pb-0">
        <TopNav hideBrand />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-12">
            {children}
          </div>
          <Footer />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
