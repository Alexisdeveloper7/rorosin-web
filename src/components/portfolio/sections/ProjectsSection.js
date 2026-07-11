import Link from "next/link";

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
      className={`pointer-events-none absolute left-1/2 z-20 flex ${ancho} items-center justify-center gap-0 ${posicion}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40" />

      <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#a78bfa] shadow-[0_0_18px_rgba(167,139,250,0.75)]" />

      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40" />
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative scroll-mt-[90px] overflow-visible bg-[#100817] px-5 py-12 md:px-6 md:py-16"
    >

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[#7c3aed]/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[#c4b5fd]/55 md:text-sm">
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
          {/* QUICKCART */}
          <article className="group rounded-2xl border border-[#c4b5fd]/10 bg-[#190d25] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#a78bfa]/25 hover:bg-[#20102f] md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-medium">QuickCart</h3>

              <span className="rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
                Tienda online
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
              Tienda online de demostración con catálogo de productos,
              carrito de compras y flujo de pedido simulado.
            </p>

            <Link
              href="/quickcart"
              className="mt-5 inline-block cursor-pointer text-sm font-medium text-[#c4b5fd] transition hover:text-white"
            >
              Ver proyecto →
            </Link>
          </article>

          {/* BI NE BIANNI */}
          <article className="group rounded-2xl border border-[#c4b5fd]/10 bg-[#190d25] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#a78bfa]/25 hover:bg-[#20102f] md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-medium">Bi Ne Bianni</h3>

              <span className="rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
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
              className="mt-5 inline-block cursor-pointer text-sm font-medium text-[#c4b5fd] transition hover:text-white"
            >
              Ver sitio →
            </a>
          </article>

          {/* HAMBURGUESAS FÁTIMA */}
          <article className="group rounded-2xl border border-[#c4b5fd]/10 bg-[#190d25] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#a78bfa]/25 hover:bg-[#20102f] md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-medium">
                Hamburguesas Fátima
              </h3>

              <span className="rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
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
              className="mt-5 inline-block cursor-pointer text-sm font-medium text-[#c4b5fd] transition hover:text-white"
            >
              Ver sitio →
            </a>
          </article>

          {/* PRÓXIMO PROYECTO */}
          <article className="group rounded-2xl border border-[#c4b5fd]/10 bg-[#190d25] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#a78bfa]/25 hover:bg-[#20102f] md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-medium">
                Próximo proyecto
              </h3>

              <span className="rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/5 px-3 py-1 text-xs text-[#ddd6fe]/60">
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

      <BiNeBianniDivider position="bottom" />
    </section>
  );
}