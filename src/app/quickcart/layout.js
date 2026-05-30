"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function QuickCartLayout({ children }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      
      {/* HEADER */}
      <Header />

      {/* TRIGGER */}
      <div id="header-trigger" className="h-[1px]" />

      {/* CONTENIDO (expande y empuja footer) */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}