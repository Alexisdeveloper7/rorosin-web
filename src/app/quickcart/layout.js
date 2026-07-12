"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserOverlay from "@/components/UserOverlay";

export default function QuickCartLayout({ children }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white text-slate-950">
      <UserOverlay />

      <Header />

      <div
        id="header-trigger"
        aria-hidden="true"
        className="pointer-events-none h-px w-full shrink-0"
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}