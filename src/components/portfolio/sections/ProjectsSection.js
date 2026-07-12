"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const cardStartClasses = [
  "-translate-x-6 rotate-[-1.5deg]",
  "translate-x-6 rotate-[1.5deg]",
  "-translate-x-6 rotate-[-1.5deg]",
  "translate-x-6 rotate-[1.5deg]",
];

function BiNeBianniDivider({ position }) {
  const posicion =
    position === "top"
      ? "top-0 -translate-x-1/2 -translate-y-1/2"
      : "bottom-0 -translate-x-1/2 translate-y-1/2";

  const ancho =
    position === "top"
      ? "w-full max-w-none"
      : "w-[calc(100%-2.5rem)] max-w-[420px]";

  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none absolute left-1/2 z-20
        flex items-center justify-center gap-0
        ${ancho}
        ${posicion}
      `}
    >
      <span
        className="
          h-px flex-1
          bg-gradient-to-r
          from-transparent
          via-[#a78bfa]/80
          to-[#a78bfa]/40
        "
      />

      <span
        className="
          h-2.5 w-2.5 shrink-0 rotate-45
          rounded-[2px]
          bg-[#a78bfa]
          shadow-[0_0_18px_rgba(167,139,250,0.75)]
        "
      />

      <span
        className="
          h-px flex-1
          bg-gradient-to-l
          from-transparent
          via-[#a78bfa]/80
          to-[#a78bfa]/40
        "
      />
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const [sectionVisible, setSectionVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => new Set());

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setSectionVisible(true);
      setVisibleCards(new Set([0, 1, 2, 3]));
      return;
    }

    /*
      Encabezado de la sección.

      Se anima una sola vez y después deja de observarse,
      por lo que no vuelve a ocultarse al subir o bajar.
    */
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setSectionVisible(true);
        sectionObserver.unobserve(entry.target);
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    /*
      Cada proyecto se anima al entrar en pantalla.

      Después de mostrarse se deja de observar para evitar
      parpadeos o repeticiones de la animación.
    */
    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.dataset.cardIndex);

          setVisibleCards((previousCards) => {
            if (previousCards.has(index)) {
              return previousCards;
            }

            const nextCards = new Set(previousCards);
            nextCards.add(index);

            return nextCards;
          });

          cardsObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    sectionObserver.observe(section);

    cardRefs.current.forEach((card) => {
      if (card) {
        cardsObserver.observe(card);
      }
    });

    return () => {
      sectionObserver.disconnect();
      cardsObserver.disconnect();
    };
  }, []);

  const cardAnimationClass = (index) => {
    const cardVisible = visibleCards.has(index);

    return `
      h-full min-w-0 transform-gpu
      transition-[opacity,transform]
      duration-[800ms]
      ease-[cubic-bezier(0.16,1,0.3,1)]
      [backface-visibility:hidden]
      motion-reduce:transform-none
      motion-reduce:opacity-100
      motion-reduce:transition-none
      ${
        cardVisible
          ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
          : `${cardStartClasses[index]} translate-y-10 scale-[0.93] opacity-0`
      }
    `;
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="
        relative scroll-mt-[90px]
        overflow-visible
        bg-[#100817]
        px-5 py-12
        md:px-6 md:py-16
      "
    >
      {/*
        Fondo estático.

        No usa blur gigante, opacity animada ni transformaciones.
        Mantiene el resplandor morado sin provocar flashes en móvil.
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
            bg-[radial-gradient(circle_at_100%_18%,rgba(124,58,237,0.13),transparent_34%),radial-gradient(circle_at_0%_88%,rgba(147,51,234,0.055),transparent_30%)]
          "
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
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
                sectionVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }
            `}
          >
            Portafolio
          </p>

          <h2
            className={`
              mt-3 origin-left transform-gpu
              text-2xl font-semibold
              transition-[opacity,transform]
              delay-[90ms]
              duration-[850ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              [backface-visibility:hidden]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              md:text-4xl
              ${
                sectionVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-9 scale-[0.94] opacity-0"
              }
            `}
          >
            Proyectos propios
          </h2>

          <p
            className={`
              mt-4 transform-gpu
              text-sm leading-relaxed
              text-white/55
              transition-[opacity,transform]
              delay-[190ms]
              duration-[750ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              [backface-visibility:hidden]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              md:text-base
              ${
                sectionVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-7 opacity-0"
              }
            `}
          >
            Una selección de proyectos creados para mostrar mi forma de
            trabajar.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
          {/* QUICKCART */}
          <div
            ref={(element) => {
              cardRefs.current[0] = element;
            }}
            data-card-index="0"
            className={cardAnimationClass(0)}
            style={{
              transitionDelay: visibleCards.has(0) ? "0ms" : "0ms",
            }}
          >
            <article
              className="
                group h-full
                rounded-2xl
                border border-[#c4b5fd]/10
                bg-[#190d25]
                p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                transition-[transform,border-color,background-color,box-shadow]
                duration-300
                active:scale-[0.985]
                sm:hover:-translate-y-1
                sm:hover:border-[#a78bfa]/25
                sm:hover:bg-[#20102f]
                md:p-7
              "
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">QuickCart</h3>

                <span className="shrink-0 rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
                  Tienda online
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Tienda online de demostración con catálogo de productos,
                carrito de compras y flujo de pedido simulado.
              </p>

              <Link
                href="/quickcart"
                className="
                  mt-5 inline-block cursor-pointer
                  text-sm font-medium text-[#c4b5fd]
                  transition-[color,transform]
                  duration-300
                  hover:translate-x-1
                  hover:text-white
                "
              >
                Ver proyecto →
              </Link>
            </article>
          </div>

          {/* BI NE BIANNI */}
          <div
            ref={(element) => {
              cardRefs.current[1] = element;
            }}
            data-card-index="1"
            className={cardAnimationClass(1)}
            style={{
              transitionDelay: visibleCards.has(1) ? "80ms" : "0ms",
            }}
          >
            <article
              className="
                group h-full
                rounded-2xl
                border border-[#c4b5fd]/10
                bg-[#190d25]
                p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                transition-[transform,border-color,background-color,box-shadow]
                duration-300
                active:scale-[0.985]
                sm:hover:-translate-y-1
                sm:hover:border-[#a78bfa]/25
                sm:hover:bg-[#20102f]
                md:p-7
              "
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">Bi Ne Bianni</h3>

                <span className="shrink-0 rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
                  Sitio empresarial
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Sitio web para una consultoría social, con secciones
                informativas, presentación de servicios y diseño moderno.
              </p>

              <a
                href="https://binebianni.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-5 inline-block cursor-pointer
                  text-sm font-medium text-[#c4b5fd]
                  transition-[color,transform]
                  duration-300
                  hover:translate-x-1
                  hover:text-white
                "
              >
                Ver sitio →
              </a>
            </article>
          </div>

          {/* HAMBURGUESAS FÁTIMA */}
          <div
            ref={(element) => {
              cardRefs.current[2] = element;
            }}
            data-card-index="2"
            className={cardAnimationClass(2)}
            style={{
              transitionDelay: visibleCards.has(2) ? "80ms" : "0ms",
            }}
          >
            <article
              className="
                group h-full
                rounded-2xl
                border border-[#c4b5fd]/10
                bg-[#190d25]
                p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                transition-[transform,border-color,background-color,box-shadow]
                duration-300
                active:scale-[0.985]
                sm:hover:-translate-y-1
                sm:hover:border-[#a78bfa]/25
                sm:hover:bg-[#20102f]
                md:p-7
              "
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">
                  Hamburguesas Fátima
                </h3>

                <span className="shrink-0 rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
                  Restaurante
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Página web para negocio de comida, enfocada en mostrar un
                menú digital con carrito, recibir pedidos a domicilio por
                WhatsApp y facilitar la atención directa con clientes.
              </p>

              <a
                href="https://hamburguesas-fatima.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-5 inline-block cursor-pointer
                  text-sm font-medium text-[#c4b5fd]
                  transition-[color,transform]
                  duration-300
                  hover:translate-x-1
                  hover:text-white
                "
              >
                Ver sitio →
              </a>
            </article>
          </div>

          {/* PRÓXIMO PROYECTO */}
          <div
            ref={(element) => {
              cardRefs.current[3] = element;
            }}
            data-card-index="3"
            className={cardAnimationClass(3)}
            style={{
              transitionDelay: visibleCards.has(3) ? "80ms" : "0ms",
            }}
          >
            <article
              className="
                group h-full
                rounded-2xl
                border border-[#c4b5fd]/10
                bg-[#190d25]
                p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                transition-[transform,border-color,background-color,box-shadow]
                duration-300
                active:scale-[0.985]
                sm:hover:-translate-y-1
                sm:hover:border-[#a78bfa]/25
                sm:hover:bg-[#20102f]
                md:p-7
              "
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">
                  Próximo proyecto
                </h3>

                <span className="shrink-0 rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
                  En desarrollo
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Estoy trabajando en nuevos proyectos para ampliar mi
                portafolio y mostrar más tipos de páginas y sistemas.
              </p>

              <span className="mt-5 inline-block text-sm text-[#c4b5fd]/40">
                Proyecto en desarrollo →
              </span>
            </article>
          </div>
        </div>
      </div>

      {/*
        Separador siempre visible.

        No depende del IntersectionObserver, por lo que no aparece
        repentinamente ni genera flashes al entrar en la sección.
      */}
      <BiNeBianniDivider position="bottom" />
    </section>
  );
}