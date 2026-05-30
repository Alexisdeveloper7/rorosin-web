"use client";

import Link from "next/link";

export default function PortfolioHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-[#202020]/70 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 md:px-6 py-4">
        <p className="text-white font-semibold tracking-wide">
          Miguel Alexis Sánchez Carranza
        </p>

        <Link
          href="/quickcart"
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          Ver tienda
        </Link>
      </div>
    </header>
  );
}