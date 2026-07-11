import { FaWhatsapp } from "react-icons/fa";

const whatsappMessage =
  "Hola, me interesa solicitar información sobre una página web.";

const whatsappUrl = `https://wa.me/5213312891927?text=${encodeURIComponent(
  whatsappMessage
)}`;

const phoneUrl = "tel:+523312891927";

const emailUrl =
  "mailto:alexissanchezdev7@gmail.com?subject=Cotización%20de%20página%20web";

function BiNeBianniDivider({ position }) {
  const posicion =
    position === "top"
      ? "top-0 -translate-x-1/2 -translate-y-1/2"
      : "bottom-0 -translate-x-1/2 translate-y-1/2";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 z-20 flex w-full max-w-none items-center justify-center gap-0 ${posicion}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40" />

      <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#a78bfa] shadow-[0_0_18px_rgba(167,139,250,0.75)]" />

      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#a78bfa]/80 to-[#a78bfa]/40" />
    </div>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-[90px] overflow-visible bg-[#0b0511] px-5 py-14 text-center md:px-6 md:py-[4.5rem]"
    >
      <BiNeBianniDivider position="top" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3aed]/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[#c4b5fd]/55 md:text-sm">
          Contacto
        </p>

        <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
          ¿Necesitas una página o sistema web?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
          Dime qué tipo de página necesitas, para qué negocio o proyecto
          será, o si buscas mejorar o dar mantenimiento a un sitio
          existente. El precio depende del tipo de sitio web, las
          secciones y funciones que necesites.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#22c55e] px-7 py-3 text-center font-semibold text-white shadow-[0_12px_35px_rgba(34,197,94,0.22)] transition duration-300 hover:bg-[#16a34a] active:scale-[0.97] md:px-8 md:py-4"
          >
            <FaWhatsapp className="text-xl" />
            Contactar por WhatsApp
          </a>

          <a
            href={phoneUrl}
            className="cursor-pointer rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/10 px-7 py-3 text-center font-medium text-white transition duration-300 hover:border-[#c4b5fd]/30 hover:bg-[#8b5cf6]/20 active:scale-[0.97] md:px-8 md:py-4"
          >
            Llamar
          </a>

          <a
            href={emailUrl}
            className="cursor-pointer rounded-full border border-[#c4b5fd]/15 bg-[#8b5cf6]/10 px-7 py-3 text-center font-medium text-white transition duration-300 hover:border-[#c4b5fd]/30 hover:bg-[#8b5cf6]/20 active:scale-[0.97] md:px-8 md:py-4"
          >
            Correo
          </a>
        </div>
      </div>

      <BiNeBianniDivider position="bottom" />
    </section>
  );
}