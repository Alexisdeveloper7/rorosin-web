"use client";

import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const whatsappMessage =
  "Hola, me interesa solicitar información sobre la creación de un sitio web.";

const whatsappUrl = `https://wa.me/5213312891927?text=${encodeURIComponent(
  whatsappMessage,
)}`;

const phoneUrl = "tel:+523312891927";

const emailUrl =
  "mailto:alexissanchezdev7@gmail.com?subject=Cotización%20de%20página%20web";

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    /*
      La sección se anima una sola vez.

      Después de entrar en pantalla deja de observarse,
      evitando que desaparezca al subir o bajar.
    */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="
        relative scroll-mt-[90px]
        overflow-visible
        bg-[#0b0511]
        px-5 py-14
        text-center
        md:px-6 md:py-[4.5rem]
      "
    >
      {/*
        Fondo estático optimizado.

        Reemplaza el círculo con blur-[130px] por gradientes radiales.
        Conserva el resplandor morado sin forzar blur durante el scroll.
      */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,0.16),transparent_38%),radial-gradient(circle_at_15%_100%,rgba(147,51,234,0.055),transparent_32%),radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.06),transparent_30%)]
          "
        />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Texto pequeño */}
        <p
          className={`
            transform-gpu
            text-xs uppercase
            tracking-[0.18em]
            text-[#c4b5fd]/55
            transition-[opacity,transform]
            duration-700
            ease-[cubic-bezier(0.16,1,0.3,1)]
            [backface-visibility:hidden]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:text-sm
            ${
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }
          `}
        >
          Contacto
        </p>

        {/* Título */}
        <h2
          className={`
            mt-3 transform-gpu
            text-3xl font-semibold leading-tight
            transition-[opacity,transform]
            delay-[90ms]
            duration-[900ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            [backface-visibility:hidden]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:text-5xl
            ${
              visible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-10 scale-[0.93] opacity-0"
            }
          `}
        >
          ¿Necesitas una página o sistema web?
        </h2>

        {/* Descripción */}
        <p
          className={`
            mx-auto mt-5 max-w-2xl
            transform-gpu
            text-sm leading-relaxed
            text-white/65
            transition-[opacity,transform]
            delay-[210ms]
            duration-[800ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            [backface-visibility:hidden]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:text-base
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          Dime qué tipo de página necesitas, para qué negocio o proyecto será,
          o si buscas mejorar o dar mantenimiento a un sitio existente. El
          precio depende del tipo de sitio web, las secciones y funciones que
          necesites.
        </p>
        {/* Botones */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {/* WhatsApp */}
          <div
            className={`
              transform-gpu
              transition-[opacity,transform]
              delay-[330ms]
              duration-[750ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              [backface-visibility:hidden]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              ${
                visible
                  ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                  : "-translate-x-6 translate-y-6 scale-[0.94] opacity-0"
              }
            `}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex w-full cursor-pointer
                items-center justify-center gap-2
                rounded-full
                bg-[#22c55e]
                px-7 py-3
                text-center font-semibold text-white
                shadow-[0_12px_35px_rgba(34,197,94,0.22)]
                transition-[transform,background-color,box-shadow]
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#16a34a]
                hover:shadow-[0_16px_38px_rgba(34,197,94,0.27)]
                active:scale-[0.97]
                md:px-8 md:py-4
              "
            >
              <FaWhatsapp className="text-xl" />

              <span>Contactar por WhatsApp</span>
            </a>
          </div>

          {/* Llamar */}
          <div
            className={`
              transform-gpu
              transition-[opacity,transform]
              delay-[420ms]
              duration-[750ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              [backface-visibility:hidden]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-7 scale-[0.94] opacity-0"
              }
            `}
          >
            <a
              href={phoneUrl}
              className="
                block w-full cursor-pointer
                rounded-full
                border border-[#c4b5fd]/15
                bg-[#8b5cf6]/10
                px-7 py-3
                text-center font-medium text-white
                transition-[transform,border-color,background-color]
                duration-300
                hover:-translate-y-0.5
                hover:border-[#c4b5fd]/30
                hover:bg-[#8b5cf6]/20
                active:scale-[0.97]
                md:px-8 md:py-4
              "
            >
              Llamar
            </a>
          </div>

          {/* Correo */}
          <div
            className={`
              transform-gpu
              transition-[opacity,transform]
              delay-[510ms]
              duration-[750ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              [backface-visibility:hidden]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              ${
                visible
                  ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                  : "translate-x-6 translate-y-6 scale-[0.94] opacity-0"
              }
            `}
          >
            <a
              href={emailUrl}
              className="
                block w-full cursor-pointer
                rounded-full
                border border-[#c4b5fd]/15
                bg-[#8b5cf6]/10
                px-7 py-3
                text-center font-medium text-white
                transition-[transform,border-color,background-color]
                duration-300
                hover:-translate-y-0.5
                hover:border-[#c4b5fd]/30
                hover:bg-[#8b5cf6]/20
                active:scale-[0.97]
                md:px-8 md:py-4
              "
            >
              Correo
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}