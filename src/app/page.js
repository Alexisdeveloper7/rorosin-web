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
    window.open(
      "https://wa.me/5213312891927?text=Hola,%20quiero%20cotizar%20una%20página%20web",
      "_blank"
    );
  };

  const llamar = () => {
    window.location.href = "tel:+523312891927";
  };

  const enviarCorreo = () => {
    window.location.href =
      "mailto:alexissanchezdev7@gmail.com?subject=Cotización%20de%20página%20web";
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
              Creo, mejoro y doy mantenimiento a sitios web, desde páginas profesionales y tiendas online hasta sistemas de citas, reservaciones,
              control de inventario y sistemas administrativos.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => scrollSuave("projects")}
                className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition text-center shadow-sm cursor-pointer"
              >
                Ver proyectos propios
              </button>

              <button
                type="button"
                onClick={() => scrollSuave("contact")}
                className="border border-white/10 bg-white/5 px-6 py-3 rounded-full text-sm hover:bg-white/10 transition text-center cursor-pointer"
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
        className="px-5 md:px-6 py-12 md:py-16 bg-[#1f1f1f] border-t border-white/5"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs md:text-sm text-white/40 tracking-[0.18em] uppercase">
              Portafolio
            </p>

            <h2 className="mt-3 text-2xl md:text-4xl font-semibold">
              Proyectos propios
            </h2>

            <p className="mt-4 text-white/55 text-sm md:text-base leading-relaxed">
              Una selección de proyectos creados para mostrar mi forma de trabajar.
            </p>
          </div>

          <div className="mt-7 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
  <div className="p-5 md:p-7 rounded-2xl bg-[#2a2a2a] border border-white/5 hover:bg-[#313131] transition">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-medium">QuickCart</h3>

      <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
        Tienda online
      </span>
    </div>

    <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
      Tienda online de demostración con catálogo de productos, carrito de compras y flujo de pedido simulado.
    </p>

    <Link
      href="/quickcart"
      className="mt-5 inline-block text-sm text-white/80 hover:text-white transition cursor-pointer"
    >
      Ver proyecto →
    </Link>
  </div>

  <div className="p-5 md:p-7 rounded-2xl bg-[#2a2a2a] border border-white/5 hover:bg-[#313131] transition">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-medium">Bi Ne Bianni</h3>

      <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
        Sitio empresarial
      </span>
    </div>

    <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
      Sitio web profesional para una consultoría social, con secciones informativas, presentación de servicios y diseño responsivo.
    </p>

    <a
      href="https://binebianni.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-block text-sm text-white/80 hover:text-white transition cursor-pointer"
    >
      Ver sitio →
    </a>
  </div>

  <div className="p-5 md:p-7 rounded-2xl bg-[#2a2a2a] border border-white/5 hover:bg-[#313131] transition">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-medium">Hamburguesas Fátima</h3>

      <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
        Restaurante
      </span>
    </div>

    <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
      Página web para negocio de comida, enfocada en mostrar productos, mejorar la presentación del negocio y facilitar el contacto con clientes.
    </p>

    <a
      href="https://hamburguesas-fatima.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-block text-sm text-white/80 hover:text-white transition cursor-pointer"
    >
      Ver sitio →
    </a>
  </div>

  <div className="p-5 md:p-7 rounded-2xl bg-[#2a2a2a] border border-white/5 hover:bg-[#313131] transition">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-medium">Próximo proyecto</h3>

      <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
        En desarrollo
      </span>
    </div>

    <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
      Estoy trabajando en nuevos proyectos para ampliar mi portafolio y mostrar más tipos de páginas y sistemas.
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
      <section className="px-5 md:px-6 py-12 md:py-16 bg-[#242424] border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs md:text-sm text-white/40 tracking-[0.18em] uppercase">
            Sobre mí
          </p>

          <h2 className="mt-3 text-2xl md:text-4xl font-semibold">
            Desarrollo páginas y sistemas funcionales
          </h2>

          <p className="mt-5 text-white/70 text-[15px] md:text-lg leading-relaxed">
            Me gusta crear sitios claros, modernos y fáciles de usar, cuidando tanto el diseño como el funcionamiento.
          </p>

          <p className="mt-4 text-white/60 text-sm md:text-base leading-relaxed">
            Estudié la carrera de Tecnólogo Profesional en Sistemas Informáticos (TPSI) en la Escuela Politécnica de Guadalajara, donde fortalecí mis bases en lógica, programación, software y tecnologías web.
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
            ¿Necesitas una página o sistema web?
          </h2>

          <p className="mt-5 text-white/70 text-sm md:text-base leading-relaxed">
            Creo, mejoro o doy mantenimiento a tu página, <br />
            tienda online o sistema administrativo.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={abrirWhatsApp}
              className="bg-white text-black px-7 md:px-8 py-3 md:py-4 rounded-full font-medium hover:opacity-90 transition text-center cursor-pointer"
            >
              Contactar por WhatsApp
            </button>

            <button
              type="button"
              onClick={llamar}
              className="border border-white/10 bg-white/5 px-7 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-white/10 transition text-center cursor-pointer"
            >
              Llamar
            </button>

            <button
              type="button"
              onClick={enviarCorreo}
              className="border border-white/10 bg-white/5 px-7 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-white/10 transition text-center cursor-pointer"
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