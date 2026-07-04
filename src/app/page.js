"use client";

import Link from "next/link";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";
import PortfolioReviews from "@/components/PortfolioReviews";

export default function Home() {
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

  const abrirWhatsApp = () => {
    window.open("https://wa.me/5213312891927", "_blank");
  };

  const llamar = () => {
    window.location.href = "tel:+523312891927";
  };

  const enviarCorreo = () => {
    window.location.href =
      "mailto:alexissanchezdev7@gmail.com?subject=Cotización%20de%20página%20web";
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <PortfolioHeader />

      {/* HERO */}
      <section className="flex min-h-[68vh] items-center bg-[#242424] px-5 pb-8 pt-24 md:min-h-[78vh] md:px-6 md:pb-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-white/45 md:text-sm">
              Desarrollador web • Freelancer
            </p>

            <h1 className="text-[2.45rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl md:leading-tight">
              Desarrollo sitios web,
              <br className="hidden sm:block" />
              <span className="text-white/90">
                {" "}páginas de presentación y tiendas online
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65 md:text-lg">
              Creo, mejoro y doy mantenimiento a sitios web, desde páginas
              profesionales y tiendas online hasta sistemas de citas,
              reservaciones, control de inventario y sistemas administrativos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:gap-4">
              <button
                type="button"
                onClick={() => scrollSuave("projects")}
                className="cursor-pointer rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black shadow-sm transition hover:opacity-90"
              >
                Ver proyectos propios
              </button>

              <button
                type="button"
                onClick={() => scrollSuave("contact")}
                className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center text-sm transition hover:bg-white/10"
              >
                Cotizar página web
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="border-t border-white/5 bg-[#1f1f1f] px-5 py-12 md:px-6 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40 md:text-sm">
              Portafolio
            </p>

            <h2 className="mt-3 text-2xl font-semibold md:text-4xl">
              Proyectos propios
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
              Una selección de proyectos creados para mostrar mi forma de
              trabajar.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
            <div className="rounded-2xl border border-white/5 bg-[#2a2a2a] p-5 transition hover:bg-[#313131] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">QuickCart</h3>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                  Tienda online
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Tienda online de demostración con catálogo de productos, carrito
                de compras y flujo de pedido simulado.
              </p>

              <Link
                href="/quickcart"
                className="mt-5 inline-block cursor-pointer text-sm text-white/80 transition hover:text-white"
              >
                Ver proyecto →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#2a2a2a] p-5 transition hover:bg-[#313131] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">Bi Ne Bianni</h3>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
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
                className="mt-5 inline-block cursor-pointer text-sm text-white/80 transition hover:text-white"
              >
                Ver sitio →
              </a>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#2a2a2a] p-5 transition hover:bg-[#313131] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">Hamburguesas Fátima</h3>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                  Restaurante
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Página web para negocio de comida, enfocada en mostrar un menú
                digital con carrito, recibir pedidos a domicilio por WhatsApp y
                facilitar la atención directa con clientes.
              </p>

              <a
                href="https://hamburguesas-fatima.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block cursor-pointer text-sm text-white/80 transition hover:text-white"
              >
                Ver sitio →
              </a>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#2a2a2a] p-5 transition hover:bg-[#313131] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium">Próximo proyecto</h3>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                  En desarrollo
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                Estoy trabajando en nuevos proyectos para ampliar mi portafolio
                y mostrar más tipos de páginas y sistemas.
              </p>

              <span className="mt-5 inline-block text-sm text-white/35">
                Proyecto en desarrollo →
              </span>
            </div>
          </div>
        </div>
      </section>

      <PortfolioReviews />

      {/* ABOUT */}
      <section className="border-t border-white/5 bg-[#242424] px-5 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.18em] text-white/40 md:text-sm">
            Sobre mí
          </p>

          <h2 className="mt-3 text-2xl font-semibold md:text-4xl">
            Desarrollo páginas y sistemas funcionales
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-white/70 md:text-lg">
            Me gusta crear sitios claros, modernos y fáciles de usar, cuidando
            tanto el diseño como el funcionamiento.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
            Estudié la carrera de Tecnólogo Profesional en Sistemas Informáticos
            (TPSI) en la Escuela Politécnica de Guadalajara, donde fortalecí mis
            bases en lógica, programación, software y tecnologías web.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
            Trabajo con dedicación, cuidando el diseño, la estructura del código
            y la experiencia del usuario.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="border-t border-white/5 bg-[#1f1f1f] px-5 py-14 text-center md:px-6 md:py-[4.5rem]"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-white/40 md:text-sm">
            Contacto
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
            ¿Necesitas una página o sistema web?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
            Dime qué tipo de página necesitas, para qué negocio o proyecto será,
            o si buscas mejorar o dar mantenimiento a un sitio existente. El
            precio depende del tipo de sitio web, las secciones y funciones que
            necesites.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={abrirWhatsApp}
              className="cursor-pointer rounded-full bg-white px-7 py-3 text-center font-medium text-black transition hover:opacity-90 md:px-8 md:py-4"
            >
              Contactar por WhatsApp
            </button>

            <button
              type="button"
              onClick={llamar}
              className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-7 py-3 text-center font-medium transition hover:bg-white/10 md:px-8 md:py-4"
            >
              Llamar
            </button>

            <button
              type="button"
              onClick={enviarCorreo}
              className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-7 py-3 text-center font-medium transition hover:bg-white/10 md:px-8 md:py-4"
            >
              Correo
            </button>
          </div>
        </div>
      </section>

      <PortfolioFooter />
    </div>
  );
}