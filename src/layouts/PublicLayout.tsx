import React from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-sans antialiased">
      <TopNav />
      <main className="flex-grow flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
