"use client";

import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function PortfolioHeader() {
  const [presionado, setPresionado] = useState("");
  const [scrolleado, setScrolleado] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const detectarScroll = () => {
      setScrolleado(window.scrollY > 50);
    };

    detectarScroll();

    window.addEventListener("scroll", detectarScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", detectarScroll);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolleado
          ? "border-[#08030e]/70 bg-[#1b0b2a]/95 backdrop-blur-md"
          : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex min-h-[74px] w-full max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:min-h-[70px] sm:px-5 md:px-6">
        <button
          type="button"
          onClick={irArriba}
          aria-label="Ir al inicio"
          className={`group relative min-w-0 cursor-pointer rounded-2xl px-2 py-2 text-left outline-none transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.97] sm:px-2.5 ${
            presionado === "nombre"
              ? "scale-[0.97] bg-white/[0.08]"
              : ""
          }`}
        >
          <span className="pointer-events-none absolute bottom-[4px] left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-purple-200/70 to-transparent opacity-0 transition-all duration-300 group-hover:w-[85%] group-hover:opacity-100" />

          <span className="relative block leading-[1.05]">
            <span className="block whitespace-nowrap text-[15px] font-bold tracking-wide text-white min-[390px]:text-[16px] sm:hidden">
              Miguel Alexis
            </span>

            <span className="mt-0.5 block whitespace-nowrap text-[15px] font-bold tracking-wide text-white/85 min-[390px]:text-[16px] sm:hidden">
              Sánchez Carranza
            </span>

            <span className="hidden whitespace-nowrap text-[15px] font-semibold tracking-wide text-white transition-colors duration-300 group-hover:text-purple-100 sm:block md:text-[16px]">
              Miguel Alexis Sánchez Carranza
            </span>
          </span>
        </button>

        <a
          href="https://wa.me/52XXXXXXXXXX?text=Hola%2C%20me%20interesa%20cotizar%20una%20p%C3%A1gina%20web"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => animarBoton("whatsapp")}
          aria-label="Contactar por WhatsApp"
          className={`group relative inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[17px] border border-white/15 bg-white/[0.09] px-4 text-white outline-none shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14] hover:shadow-[0_14px_34px_rgba(0,0,0,0.28)] active:scale-[0.96] min-[390px]:h-[48px] min-[390px]:px-5 sm:rounded-full sm:px-6 ${
            presionado === "whatsapp"
              ? "scale-[0.96] border-white/25 bg-white/[0.16]"
              : ""
          }`}
        >
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <FaWhatsapp
            aria-hidden="true"
            className="relative h-[20px] w-[20px] shrink-0 text-[#5ee89b] min-[390px]:h-[22px] min-[390px]:w-[22px]"
          />

          <span className="relative whitespace-nowrap text-[13px] font-bold tracking-wide text-white min-[390px]:text-[14px]">
            WhatsApp
          </span>
        </a>
      </div>
    </header>
  );
}