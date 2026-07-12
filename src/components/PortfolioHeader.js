"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const whatsappMessage =
  "Hola, me interesa solicitar información sobre la creación de un sitio web.";

const whatsappUrl = `https://wa.me/5213312891927?text=${encodeURIComponent(
  whatsappMessage,
)}`;

export default function PortfolioHeader() {
  const [presionado, setPresionado] = useState("");
  const [scrolleado, setScrolleado] = useState(false);
  const [inicializado, setInicializado] = useState(false);
  const [animacionesActivas, setAnimacionesActivas] = useState(false);

  const botonTimeoutRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const primerFrameRef = useRef(null);
  const segundoFrameRef = useRef(null);

  useLayoutEffect(() => {
    const actualizarEstadoScroll = () => {
      const nuevoEstado = window.scrollY > 50;

      setScrolleado((estadoActual) =>
        estadoActual === nuevoEstado ? estadoActual : nuevoEstado,
      );
    };

    const detectarScroll = () => {
      if (scrollFrameRef.current) return;

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        actualizarEstadoScroll();
        scrollFrameRef.current = null;
      });
    };

    /*
     * Detecta la posición antes de mostrar el header
     * para evitar flashes o estados incorrectos.
     */
    actualizarEstadoScroll();
    setInicializado(true);

    /*
     * Activa las transiciones después del primer pintado.
     * Esto evita que el header se anime al cargar la página.
     */
    primerFrameRef.current = window.requestAnimationFrame(() => {
      segundoFrameRef.current = window.requestAnimationFrame(() => {
        setAnimacionesActivas(true);
      });
    });

    window.addEventListener("scroll", detectarScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", detectarScroll);

      if (botonTimeoutRef.current) {
        window.clearTimeout(botonTimeoutRef.current);
      }

      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      if (primerFrameRef.current) {
        window.cancelAnimationFrame(primerFrameRef.current);
      }

      if (segundoFrameRef.current) {
        window.cancelAnimationFrame(segundoFrameRef.current);
      }
    };
  }, []);

  const animarBoton = (id) => {
    setPresionado(id);

    if (botonTimeoutRef.current) {
      window.clearTimeout(botonTimeoutRef.current);
    }

    botonTimeoutRef.current = window.setTimeout(() => {
      setPresionado("");
      botonTimeoutRef.current = null;
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
      className={`
        fixed inset-x-0 top-0 z-50 isolate w-full
        [backface-visibility:hidden]
        [-webkit-transform:translateZ(0)]
        [transform:translateZ(0)]

        ${
          inicializado
            ? "visible opacity-100"
            : "invisible opacity-0"
        }

        ${
          animacionesActivas
            ? `
                transition-[background-color,box-shadow,backdrop-filter]
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                motion-reduce:transition-none
              `
            : "transition-none"
        }

        ${
          scrolleado
            ? `
                bg-[#241336]/75
                shadow-[0_10px_35px_rgba(5,2,10,0.28)]
                supports-[backdrop-filter]:bg-[#241336]/65
                supports-[backdrop-filter]:backdrop-blur-xl
              `
            : `
                bg-transparent
                shadow-none
                backdrop-blur-none
              `
        }
      `}
    >
      <div className="relative mx-auto flex h-[74px] w-full max-w-6xl items-center justify-between gap-2 px-3 sm:h-[70px] sm:gap-3 sm:px-5 md:px-6">
        {/* Nombre */}
        <button
          type="button"
          onClick={irArriba}
          aria-label="Ir al inicio"
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
          className={`
            group relative min-w-0 cursor-pointer select-none
            rounded-2xl px-2 py-2 text-left outline-none
            [backface-visibility:hidden]
            motion-reduce:transform-none
            motion-reduce:transition-none
            sm:px-2.5

            ${
              animacionesActivas
                ? `
                    transition-[transform,background-color]
                    duration-300
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                  `
                : "transition-none"
            }

            hover:bg-purple-400/[0.07]
            active:scale-[0.97]

            ${
              presionado === "nombre"
                ? "scale-[0.97] bg-purple-400/[0.1]"
                : ""
            }
          `}
        >
          {/* Línea animada debajo del nombre */}
          <span
            aria-hidden="true"
            className={`
              pointer-events-none absolute bottom-[3px] left-1/2
              h-px w-0 -translate-x-1/2 rounded-full
              bg-[#c4b5fd] opacity-0

              ${
                animacionesActivas
                  ? `
                      transition-[width,opacity]
                      duration-300
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                    `
                  : "transition-none"
              }

              group-hover:w-[80%]
              group-hover:opacity-80
            `}
          />

          <span className="relative block leading-[1.05]">
            {/* Nombre en celular */}
            <span className="block whitespace-nowrap text-[15px] font-bold tracking-wide text-white min-[390px]:text-[16px] sm:hidden">
              Miguel Alexis
            </span>

            <span className="mt-0.5 block whitespace-nowrap text-[15px] font-bold tracking-wide text-white/80 min-[390px]:text-[16px] sm:hidden">
              Sánchez Carranza
            </span>

            {/* Nombre en tablet y escritorio */}
            <span
              className={`
                hidden whitespace-nowrap text-[15px]
                font-semibold tracking-wide text-white
                sm:block md:text-[16px]

                ${
                  animacionesActivas
                    ? "transition-colors duration-300 ease-out"
                    : "transition-none"
                }

                group-hover:text-[#ddd6fe]
              `}
            >
              Miguel Alexis Sánchez Carranza
            </span>
          </span>
        </button>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => animarBoton("whatsapp")}
          aria-label="Contactar por WhatsApp"
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
          className={`
            group relative inline-flex h-[46px] shrink-0
            cursor-pointer select-none items-center justify-center
            gap-2 rounded-[17px]
            border border-[#51df82]
            bg-[#25d366]
            px-4 text-white outline-none
            shadow-[0_8px_24px_rgba(37,211,102,0.22)]
            [backface-visibility:hidden]
            motion-reduce:transform-none
            motion-reduce:transition-none
            min-[390px]:h-[48px]
            min-[390px]:px-5
            sm:rounded-full
            sm:px-6

            ${
              animacionesActivas
                ? `
                    transition-[transform,background-color,border-color,box-shadow]
                    duration-300
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                  `
                : "transition-none"
            }

            hover:-translate-y-0.5
            hover:border-[#76ec9d]
            hover:bg-[#20c75d]
            hover:shadow-[0_12px_28px_rgba(37,211,102,0.3)]
            active:scale-[0.96]

            ${
              presionado === "whatsapp"
                ? "scale-[0.96] border-[#86efa8] bg-[#1db957]"
                : ""
            }
          `}
        >
          <FaWhatsapp
            aria-hidden="true"
            className={`
              h-[20px] w-[20px] shrink-0 text-white
              min-[390px]:h-[22px]
              min-[390px]:w-[22px]
              motion-reduce:transform-none
              motion-reduce:transition-none

              ${
                animacionesActivas
                  ? `
                      transition-transform
                      duration-300
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                    `
                  : "transition-none"
              }

              group-hover:rotate-[-5deg]
              group-hover:scale-110
            `}
          />

          <span className="whitespace-nowrap text-[13px] font-bold tracking-wide text-white min-[390px]:text-[14px]">
            WhatsApp
          </span>
        </a>
      </div>

      {/*
       * BORDE INFERIOR DEL HEADER
       *
       * - No existe ningún borde negro.
       * - Aparece directamente en morado.
       * - Está oculto cuando el header está arriba.
       * - Tiene la misma intensidad en todo el ancho.
       * - La animación combina opacidad y escala para verse suave.
       */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-x-0 bottom-0
          h-px w-full origin-center
          bg-[#a78bfa]/70
          shadow-[0_0_10px_rgba(167,139,250,0.18)]
          [backface-visibility:hidden]

          ${
            animacionesActivas
              ? `
                  transition-[opacity,transform]
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  motion-reduce:transition-none
                `
              : "transition-none"
          }

          ${
            scrolleado
              ? "scale-x-100 opacity-100"
              : "scale-x-[0.98] opacity-0"
          }
        `}
      />
    </header>
  );
}