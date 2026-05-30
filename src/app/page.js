"use client";

import Link from "next/link";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";

export default function Home() {
  const telefono = "+52 3312891927";
  const whatsapp = "523312891927";
  const correo = "alexisdev7@outlook.com";

  const scrollSuave = (id) => {
    const seccion = document.getElementById(id);
    if (!seccion) return;

    const headerHeight = 90;

    const top =
      seccion.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#1f1f1f] text-white min-h-screen">
      <PortfolioHeader />

      {/* HERO */}
      <section className="min-h-[68vh] md:min-h-[78vh] flex items-center px-5 md:px-6 bg-[#242424] pt-24 pb-8 md:pb-12">
        <div className="mx-auto max-w-6xl w-full">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs md:text-sm text-white/45 tracking-[0.22em] uppercase">
              Desarrollador web • Freelancer
            </p>

            <h1 className="text-[2.45rem] sm:text-5xl md:text-7xl font-semibold leading-[1.08] md:leading-tight tracking-tight">
              Desarrollo sitios web,
              <br className="hidden sm:block" />
              <span className="text-white/90">
                {" "}páginas de presentación y tiendas online
              </span>
            </h1>

            <p className="mt-5 text-white/65 text-[15px] md:text-lg max-w-2xl leading-relaxed">
              Creo, mejoro y doy mantenimiento a proyectos web, desde páginas profesionales hasta sistemas administrativos conectados a base de datos, creando una experiencia clara para cada usuario.

            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => scrollSuave("projects")}
                className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition text-center shadow-sm"
              >
                Ver proyectos
              </button>

              <button
                type="button"
                onClick={() => scrollSuave("contact")}
                className="border border-white/10 bg-white/5 px-6 py-3 rounded-full text-sm hover:bg-white/10 transition text-center"
              >
                Contactar
              </button>
            </div>

            
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="px-5 md:px-6 py-12 md:py-16 bg-[#1f1f1f] border-t border-white/5"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs md:text-sm text-white/40 tracking-[0.18em] uppercase">
              Portfolio
            </p>

            <h2 className="mt-3 text-2xl md:text-4xl font-semibold">
              Proyectos destacados
            </h2>

            <p className="mt-4 text-white/55 text-sm md:text-base leading-relaxed">
              Algunos trabajos donde aplico diseño, código limpio, lógica y
              estructura web.
            </p>
          </div>

          <div className="mt-7 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-5 md:p-7 rounded-2xl bg-[#2a2a2a] border border-white/5 hover:bg-[#313131] transition">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">
                  QuickCart
                </h3>

                <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
                  Tienda online
                </span>
              </div>

              <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
                Tienda digital con catálogo de productos, carrito de compras y
                flujo de pedido. Una experiencia simple, clara y moderna.
              </p>

              <Link
                href="/quickcart"
                className="mt-5 inline-block text-sm text-white/80 hover:text-white transition"
              >
                Ver proyecto →
              </Link>
            </div>

            <div className="p-5 md:p-7 rounded-2xl bg-[#2a2a2a] border border-white/5 hover:bg-[#313131] transition">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">
                  Próximamente
                </h3>

                <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
                  En desarrollo
                </span>
              </div>

              <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
                Estoy preparando nuevos proyectos web con usuarios, paneles
                administrativos, base de datos y funciones hechas a la medida.
                Esta sección se actualizará con próximos trabajos reales.
              </p>

              <span className="mt-5 inline-block text-sm text-white/35">
                Nuevo proyecto pronto →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-5 md:px-6 py-12 md:py-16 bg-[#242424] border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs md:text-sm text-white/40 tracking-[0.18em] uppercase">
            Sobre mí
          </p>

          <h2 className="mt-3 text-2xl md:text-4xl font-semibold">
            Desarrollo web con enfoque práctico
          </h2>

          <p className="mt-5 text-white/70 text-[15px] md:text-lg leading-relaxed">
            Me gusta crear páginas y sistemas que se vean bien, funcionen bien
            y sean fáciles de usar.
          </p>

          <p className="mt-4 text-white/60 text-sm md:text-base leading-relaxed">
            Estudié una carrera técnica orientada al desarrollo y programación
            en la Escuela Politécnica de Guadalajara, donde fortalecí mis bases
            en lógica, software y tecnologías web.
          </p>

          <p className="mt-4 text-white/60 text-sm md:text-base leading-relaxed">
            Trabajo con dedicación, cuidando el diseño, la estructura del código
            y la experiencia del usuario.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="px-5 md:px-6 py-14 md:py-18 bg-[#1f1f1f] border-t border-white/5 text-center"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs md:text-sm text-white/40 tracking-[0.18em] uppercase">
            Contacto
          </p>

          <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
            ¿Tienes un proyecto web?
          </h2>

          <p className="mt-5 text-white/70 text-sm md:text-base leading-relaxed">
            Puedo ayudarte a crear, mejorar o mantener tu página, tienda online
            o sistema web.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-7 md:px-8 py-3 md:py-4 rounded-full font-medium hover:opacity-90 transition text-center"
            >
              Contactar por WhatsApp
            </a>

            <a
              href={`tel:${telefono}`}
              className="border border-white/10 bg-white/5 px-7 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-white/10 transition text-center"
            >
              Llamar
            </a>

            <a
              href={`mailto:${correo}`}
              className="border border-white/10 bg-white/5 px-7 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-white/10 transition text-center"
            >
              Correo
            </a>
          </div>
        </div>
      </section>

      <PortfolioFooter />
    </div>
  );
}