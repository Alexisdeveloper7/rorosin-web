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

function BiNeBianniDivider({ position, visible }) {
  const posicion =
    position === "top"
      ? "top-0 -translate-y-1/2"
      : "bottom-0 translate-y-1/2";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 z-20 flex w-full items-center justify-center transition-[opacity,transform] duration-700 ease-out ${posicion} ${
        visible ? "scale-x-100 opacity-100" : "scale-x-75 opacity-0"
      }`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40" />

      <span className="h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] bg-[#a78bfa] shadow-[0_0_18px_rgba(167,139,250,0.75)]" />

      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40" />
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible bg-[#140a1f] px-5 py-12 md:px-6 md:py-16"
    >
      <BiNeBianniDivider position="top" visible={visible} />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#9333ea]/10 blur-[110px] transition-opacity duration-1000 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative mx-auto max-w-5xl">
        <p
          className={`text-xs uppercase tracking-[0.18em] text-[#c4b5fd]/55 transition-[opacity,transform] duration-700 ease-out md:text-sm ${
            visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          Sobre mí
        </p>

        <h2
          className={`mt-3 text-2xl font-semibold transition-[opacity,transform] delay-100 duration-700 ease-out md:text-4xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
          }`}
        >
          Desarrollo páginas y sistemas funcionales
        </h2>

        <p
          className={`mt-5 max-w-3xl text-[15px] leading-relaxed text-white/70 transition-[opacity,transform] delay-200 duration-700 ease-out md:text-lg ${
            visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
          }`}
        >
          Me gusta crear sitios claros, modernos y fáciles de usar,
          cuidando tanto el diseño como el funcionamiento.
        </p>

        <p
          className={`mt-4 max-w-3xl text-sm leading-relaxed text-white/60 transition-[opacity,transform] delay-300 duration-700 ease-out md:text-base ${
            visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
          }`}
        >
          Estudié la carrera de Tecnólogo Profesional en Sistemas
          Informáticos en la Escuela Politécnica de Guadalajara, donde
          fortalecí mis bases en lógica, programación, software y
          tecnologías web.
        </p>

        <p
          className={`mt-4 max-w-3xl text-sm leading-relaxed text-white/60 transition-[opacity,transform] delay-[400ms] duration-700 ease-out md:text-base ${
            visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
          }`}
        >
          Trabajo con dedicación, cuidando el diseño, la estructura del
          código y la experiencia del usuario.
        </p>

        <div className="mt-9 md:mt-11">
          <div
            className={`transition-[opacity,transform] delay-[500ms] duration-700 ease-out ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[#c4b5fd]/55">
              Tecnologías y herramientas
            </p>

            <h3 className="mt-2 text-xl font-medium md:text-2xl">
              Herramientas con las que trabajo
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {technologies.map((technology, index) => (
              <article
                key={technology.name}
                style={{ transitionDelay: `${560 + index * 75}ms` }}
                className={`group relative min-w-0 overflow-hidden rounded-xl border border-[#c4b5fd]/10 bg-[#190d25]/80 p-3 transition-[opacity,transform,border-color,background-color] duration-700 ease-out hover:-translate-y-1 hover:border-[#a78bfa]/30 hover:bg-[#20102f] sm:rounded-2xl sm:p-4 md:p-5 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-7 opacity-0"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5 ${technology.color}`}
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

                <p className="mt-1.5 truncate text-[11px] leading-relaxed text-white/55 sm:mt-3 sm:text-sm sm:whitespace-normal">
                  {technology.description}
                </p>

                <div className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full bg-[#8b5cf6]/10 blur-2xl transition group-hover:bg-[#8b5cf6]/20 sm:h-20 sm:w-20" />
              </article>
            ))}
          </div>
        </div>
      </div>

      <BiNeBianniDivider position="bottom" visible={visible} />
    </section>
  );
}