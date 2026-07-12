"use client";

import { useEffect, useRef, useState } from "react";

const technologies = [
  {
    name: "Next.js",
    type: "Framework",
    description: "Sitios rápidos y optimizados.",
    color: "bg-white",
  },
  {
    name: "React",
    type: "Librería",
    description: "Interfaces dinámicas por componentes.",
    color: "bg-[#61dafb]",
  },
  {
    name: "Tailwind CSS",
    type: "Estilos",
    description: "Diseños responsive y detallados.",
    color: "bg-[#38bdf8]",
  },
  {
    name: "JavaScript",
    type: "Lenguaje",
    description: "Lógica e interactividad web.",
    color: "bg-[#facc15]",
  },
  {
    name: "Node.js",
    type: "Backend",
    description: "APIs y funciones del servidor.",
    color: "bg-[#84cc16]",
  },
  {
    name: "MySQL",
    type: "Base de datos",
    description: "Usuarios, productos e información.",
    color: "bg-[#60a5fa]",
  },
  {
    name: "WordPress",
    type: "CMS",
    description: "Sitios administrables para negocios.",
    color: "bg-[#38bdf8]",
  },
  {
    name: "Vercel",
    type: "Despliegue",
    description: "Publicación rápida de proyectos.",
    color: "bg-white",
  },
];

const cardStartClasses = [
  "-translate-x-7 rotate-[-2deg]",
  "translate-x-7 rotate-[2deg]",
  "-translate-x-7 rotate-[-2deg]",
  "translate-x-7 rotate-[2deg]",
  "-translate-x-7 rotate-[-2deg]",
  "translate-x-7 rotate-[2deg]",
  "-translate-x-7 rotate-[-2deg]",
  "translate-x-7 rotate-[2deg]",
];

const cardDelayClasses = [
  "delay-0",
  "delay-[90ms]",
  "delay-0",
  "delay-[90ms]",
  "delay-0",
  "delay-[90ms]",
  "delay-0",
  "delay-[90ms]",
];

/*
  El separador ya no depende del IntersectionObserver.

  Antes cambiaba de opacity-0 a opacity-100 y de scale-x-0 a scale-x-100.
  Eso provocaba el flash cuando la sección comenzaba a observarse.

  Ahora conserva exactamente el mismo diseño, pero siempre permanece visible.
*/
function BiNeBianniDivider({ position }) {
  const posicion =
    position === "top"
      ? "top-0 -translate-y-1/2"
      : "bottom-0 translate-y-1/2";

  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none absolute left-0 z-20
        flex w-full items-center justify-center
        ${posicion}
      `}
    >
      <span
        className="
          h-px flex-1
          bg-gradient-to-r
          from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40
        "
      />

      <span
        className="
          h-2.5 w-2.5 shrink-0 rotate-45
          rounded-[2px] bg-[#a78bfa]
          shadow-[0_0_14px_rgba(167,139,250,0.65)]
        "
      />

      <span
        className="
          h-px flex-1
          bg-gradient-to-l
          from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40
        "
      />
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const toolsRef = useRef(null);
  const cardRefs = useRef([]);

  const [visible, setVisible] = useState(false);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => new Set());

  useEffect(() => {
    const section = sectionRef.current;
    const tools = toolsRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      setToolsVisible(true);
      setVisibleCards(new Set(technologies.map((_, index) => index)));

      return;
    }

    /*
      La animación principal solo se activa una vez.

      Cuando entra en pantalla se desconecta el observer,
      por lo que nunca vuelve a ocultarse al subir o bajar.
    */
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setVisible(true);
        sectionObserver.unobserve(entry.target);
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    /*
      La sección de tecnologías también se activa solamente una vez.
    */
    const toolsObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setToolsVisible(true);
        toolsObserver.unobserve(entry.target);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    /*
      Cada tarjeta se anima cuando aparece por primera vez.

      Después se deja de observar para evitar que vuelva a desaparecer
      y aparezca cuando el usuario cambie la dirección del scroll.
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
        threshold: 0.2,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    sectionObserver.observe(section);

    if (tools) {
      toolsObserver.observe(tools);
    }

    cardRefs.current.forEach((card) => {
      if (card) {
        cardsObserver.observe(card);
      }
    });

    return () => {
      sectionObserver.disconnect();
      toolsObserver.disconnect();
      cardsObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative overflow-visible
        bg-[#140a1f]
        px-4 py-10
        sm:px-5 sm:py-12
        md:px-6 md:py-16
      "
    >
      {/* Separador fijo: ya no aparece repentinamente */}
      <BiNeBianniDivider position="top" />

      {/*
        Mismo blur decorativo original.

        Antes tenía opacity y transform ligados a la variable visible.
        Eso hacía que apareciera de golpe y cambiara el color del fondo.

        Ahora permanece estático desde el primer render.
      */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-40 bottom-0
          hidden h-80 w-80 rounded-full
          bg-[#9333ea]/10 blur-[100px]
          sm:block
        "
      />

      <div className="relative mx-auto max-w-5xl">
        <p
          className={`
            transform-gpu text-xs uppercase
            tracking-[0.18em] text-[#c4b5fd]/55
            transition-[opacity,transform]
            duration-700
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:text-sm
            ${
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }
          `}
        >
          Sobre mí
        </p>

        <h2
          className={`
            mt-3 transform-gpu
            text-2xl font-semibold leading-tight
            transition-[opacity,transform]
            delay-100 duration-[850ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:text-4xl
            ${
              visible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-10 scale-[0.92] opacity-0"
            }
          `}
        >
          Desarrollo páginas y sistemas funcionales
        </h2>

        <p
          className={`
            mt-4 max-w-3xl transform-gpu
            text-[15px] leading-relaxed text-white/70
            transition-[opacity,transform]
            delay-[230ms] duration-[750ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:mt-5 md:text-lg
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          Me gusta crear sitios claros, modernos y fáciles de usar, cuidando
          tanto el diseño como el funcionamiento.
        </p>

        <p
          className={`
            mt-3 max-w-3xl transform-gpu
            text-sm leading-relaxed text-white/60
            transition-[opacity,transform]
            delay-[330ms] duration-[750ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:mt-4 md:text-base
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          Estudié la carrera de Tecnólogo Profesional en Sistemas Informáticos
          en la Escuela Politécnica de Guadalajara, donde fortalecí mis bases
          en lógica, programación, software y tecnologías web.
        </p>

        <p
          className={`
            mt-3 max-w-3xl transform-gpu
            text-sm leading-relaxed text-white/60
            transition-[opacity,transform]
            delay-[430ms] duration-[750ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:mt-4 md:text-base
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          Trabajo con dedicación, cuidando el diseño, la estructura del código
          y la experiencia del usuario.
        </p>

        <div ref={toolsRef} className="mt-8 md:mt-11">
          <div
            className={`
              transform-gpu
              transition-[opacity,transform]
              duration-[800ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              ${
                toolsVisible
                  ? "translate-x-0 translate-y-0 opacity-100"
                  : "-translate-x-9 translate-y-6 opacity-0"
              }
            `}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[#c4b5fd]/55">
              Tecnologías y herramientas
            </p>

            <h3 className="mt-2 text-xl font-medium md:text-2xl">
              Herramientas con las que trabajo
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {technologies.map((technology, index) => {
              const cardVisible = visibleCards.has(index);

              return (
                <div
                  key={technology.name}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  data-card-index={index}
                  className={`
                    h-full min-w-0 transform-gpu
                    transition-[opacity,transform]
                    duration-[800ms]
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    motion-reduce:transform-none
                    motion-reduce:opacity-100
                    motion-reduce:transition-none
                    ${cardDelayClasses[index]}
                    ${
                      cardVisible
                        ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
                        : `${cardStartClasses[index]} translate-y-10 scale-[0.88] opacity-0`
                    }
                  `}
                >
                  <article
                    className="
                      group relative h-full min-w-0
                      overflow-hidden rounded-xl
                      border border-[#c4b5fd]/10
                      bg-[#190d25]/80 p-3
                      transform-gpu
                      transition-[transform,border-color,background-color]
                      duration-300
                      active:scale-[0.98]
                      sm:rounded-2xl sm:p-4
                      sm:hover:-translate-y-1
                      sm:hover:border-[#a78bfa]/30
                      sm:hover:bg-[#20102f]
                      md:p-5
                    "
                  >
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <span
                        className={`
                          h-2 w-2 shrink-0 rounded-full
                          transform-gpu
                          transition-[opacity,transform]
                          delay-150 duration-700
                          ease-[cubic-bezier(0.16,1,0.3,1)]
                          motion-reduce:transform-none
                          motion-reduce:opacity-100
                          motion-reduce:transition-none
                          sm:h-2.5 sm:w-2.5
                          ${technology.color}
                          ${
                            cardVisible
                              ? "scale-100 rotate-0 opacity-100"
                              : "scale-0 rotate-180 opacity-0"
                          }
                        `}
                      />

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-medium text-white sm:text-base">
                          {technology.name}
                        </h4>

                        <p className="mt-0.5 truncate text-[10px] text-[#c4b5fd]/55 sm:text-xs">
                          {technology.type}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 break-words text-[11px] leading-relaxed text-white/55 sm:mt-3 sm:text-sm">
                      {technology.description}
                    </p>

                    {/* Mismo efecto decorativo original */}
                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none absolute -right-8 -top-8
                        hidden h-20 w-20 rounded-full
                        bg-[#8b5cf6]/10 blur-2xl
                        transition-[transform,background-color]
                        duration-500
                        group-hover:scale-125
                        group-hover:bg-[#8b5cf6]/20
                        sm:block
                      "
                    />
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Separador fijo: ya no depende de toolsVisible */}
      <BiNeBianniDivider position="bottom" />
    </section>
  );
}