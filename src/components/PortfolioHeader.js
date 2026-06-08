"use client";

import Link from "next/link";

export default function PortfolioHeader() {
  const irArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#202020]/70 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 md:px-6 py-4">
        <button
          type="button"
          onClick={irArriba}
          className="text-white font-semibold tracking-wide cursor-pointer hover:text-white/80 transition text-left"
        >
          Miguel Alexis Sánchez Carranza
        </button>

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