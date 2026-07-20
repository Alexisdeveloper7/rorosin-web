export default function ProjectMockupCard({
  href,
  domain,
  image,
  title,
  description,
  category,
  alt,
  animationDelay = "0s",
  className = "",
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver el sitio real de ${title} en ${domain}`}
      className={`group block fw-card ${className}`}
      style={{ animationDelay }}
    >
      {/* MOCKUP DEL NAVEGADOR */}
      <div
        className="
          overflow-hidden rounded-2xl border
          transition-all duration-300
          group-hover:-translate-y-1.5
          group-hover:shadow-[0_24px_48px_-16px_rgba(6,15,9,0.5)]
        "
        style={{
          borderColor: "rgba(255, 255, 255, 0.09)",
          background: "rgb(17, 31, 23)",
          boxShadow: "rgba(6, 15, 9, 0.45) 0px 8px 24px -12px",
        }}
      >
        {/* BARRA SUPERIOR */}
        <div
          className="flex h-8 items-center gap-2.5 px-3"
          style={{
            background: "rgb(11, 23, 15)",
          }}
        >
          {/* BOTONES DEL NAVEGADOR */}
          <div className="flex gap-1.5" aria-hidden="true">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "rgb(255, 95, 87)" }}
            />

            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "rgb(254, 188, 46)" }}
            />

            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "rgb(40, 200, 64)" }}
            />
          </div>

          {/* BARRA DEL DOMINIO */}
          <div
            className="
              flex h-5 min-w-0 flex-1
              items-center gap-1.5 rounded-md px-2.5
            "
            style={{
              background: "rgb(22, 40, 28)",
            }}
          >
            <svg
              aria-hidden="true"
              className="h-2.5 w-2.5 flex-shrink-0 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z"
              />
            </svg>

            <span className="truncate text-[11px] text-stone-400">
              {domain}
            </span>
          </div>
        </div>

        {/* CONTENEDOR EDITABLE DE LA IMAGEN */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "16 / 10" }}
        >
          <img
            src={image}
            alt={alt || `Sitio web de ${title}`}
            loading="lazy"
            draggable="false"
            className="
              h-full w-full object-cover object-top
              transition-transform duration-500
              group-hover:scale-[1.03]
            "
          />

          {/* CAPA HOVER */}
          <div
            className="
              absolute inset-0 flex items-center justify-center
              opacity-0 transition-opacity duration-300
              group-hover:opacity-100
            "
            style={{
              background: "rgba(6, 15, 9, 0.55)",
            }}
          >
            <span
              className="
                flex items-center gap-2 rounded-full
                bg-emerald-600 px-5 py-2.5
                text-sm font-black text-white
              "
            >
              Visitar sitio real

              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="m14 5 7 7m0 0-7 7m7-7H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DEL PROYECTO */}
      <div className="mt-3 flex items-center justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-white">
            {title}
          </p>

          <p className="mt-0.5 truncate text-xs text-stone-500">
            {description}
          </p>
        </div>

        <span
          className="
            flex-shrink-0 rounded-md px-2 py-1
            text-[10px] font-black uppercase tracking-wide
          "
          style={{
            background: "rgba(5, 150, 105, 0.12)",
            color: "rgb(52, 211, 153)",
          }}
        >
          {category}
        </span>
      </div>
    </a>
  );
}