"use client";

import { useRef, useState } from "react";

export default function PortfolioHeader() {
  const [presionado, setPresionado] = useState("");
  const timeoutRef = useRef(null);

  const animarBoton = (id) => {
    setPresionado(id);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPresionado("");
    }, 420);
  };

  const irArriba = () => {
    animarBoton("nombre");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollSuave = (id) => {
    animarBoton("cotizar");

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#202020]/70 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[74px] max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:min-h-[70px] sm:gap-3 sm:px-5 md:px-6">
        <button
          type="button"
          onClick={irArriba}
          aria-label="Ir al inicio"
          className={`group relative min-w-0 cursor-pointer rounded-2xl px-2 py-2 text-left outline-none transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.97] sm:px-2.5 ${
            presionado === "nombre"
              ? "scale-[0.97] bg-white/[0.08] shadow-[0_8px_24px_rgba(255,255,255,0.05)]"
              : ""
          }`}
        >
          <span className="pointer-events-none absolute bottom-[4px] left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-300 group-hover:w-[85%] group-hover:opacity-100" />

          <span className="relative block leading-[1.05]">
            <span className="block whitespace-nowrap text-[15px] font-bold tracking-wide text-white min-[390px]:text-[16px] sm:hidden">
              Miguel Alexis
            </span>

            <span className="mt-0.5 block whitespace-nowrap text-[15px] font-bold tracking-wide text-white/85 min-[390px]:text-[16px] sm:hidden">
              Sánchez Carranza
            </span>

            <span className="hidden whitespace-nowrap text-[15px] font-semibold tracking-wide text-white transition group-hover:text-white/80 sm:block md:text-[16px]">
              Miguel Alexis Sánchez Carranza
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => scrollSuave("contact")}
          className={`group relative inline-flex h-[46px] w-[142px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border border-white/15 bg-white/[0.09] px-4 text-white outline-none shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14] hover:shadow-[0_14px_34px_rgba(0,0,0,0.28)] active:scale-[0.96] min-[390px]:h-[48px] min-[390px]:w-[155px] sm:h-auto sm:w-auto sm:rounded-full sm:px-6 sm:py-3 ${
            presionado === "cotizar"
              ? "scale-[0.96] border-white/25 bg-white/[0.16] shadow-[0_10px_26px_rgba(255,255,255,0.07)]"
              : ""
          }`}
        >
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="relative text-center leading-none sm:leading-normal">
            <span className="block whitespace-nowrap text-[11px] font-black uppercase tracking-[0.13em] min-[390px]:text-[12px] sm:inline sm:text-[12px]">
              Cotizar
            </span>

            <span className="mt-1 block whitespace-nowrap text-[10px] font-black uppercase tracking-[0.09em] text-white/75 min-[390px]:text-[11px] sm:mt-0 sm:inline sm:text-[12px] sm:text-white">
              <span className="hidden sm:inline"> </span>
              página web
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}