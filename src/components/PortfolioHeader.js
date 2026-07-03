"use client";

export default function PortfolioHeader() {
  const irArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollSuave = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#202020]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <button
          type="button"
          onClick={irArriba}
          className="cursor-pointer text-left font-semibold tracking-wide text-white transition hover:text-white/80"
        >
          Miguel Alexis Sánchez Carranza
        </button>

        <button
          type="button"
          onClick={() => scrollSuave("contact")}
          className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
        >
          Cotizar página web
        </button>
      </div>
    </header>
  );
}