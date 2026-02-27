"use client";
import ProductosDestacados from "../components/ProductosDestacados";

export default function Page() {
  return (
    <div className="bg-gray-800 text-white">
      {/* HERO */}
      <section
        id="inicio"
        className="w-full h-screen bg-[url('/images/ppp.png')] bg-cover bg-center -mt-[124px]"
      >
        {/* Wrapper desde bottom del header hasta bottom del hero */}
        <div className="w-full h-full pt-[124px] flex flex-col justify-center items-center text-center px-4">
          {/* Contenido centrado estilo móvil con breakpoint LG */}
          <div className="backdrop-blur bg-white/7 mx-4 rounded-2xl inline-block p-3 max-w-xs lg:max-w-lg lg:p-8">
            <h1 className="text-xl lg:text-5xl py-1 font-bold bg-black/60 rounded-2xl">
              Bienvenido a ROROSIN
            </h1>
            <p className="text-white font-bold break-words text-black mt-2 text-sm lg:text-lg">
              Explora nuestro sitio web para descubrir nuestros productos y
              servicios, conoce nuestra empresa y encuentra justo lo que
              necesitas, disfrutando de una experiencia única y agradable al
              navegar.
            </p>
          </div>

          {/* Flechas animadas */}
          <div className="mt-2 animate-bounce text-white text-2xl lg:text-4xl">
            &#x2193; &#x2193; &#x2193;
          </div>

          {/* Botón de invitación */}
          <button
            className="p-1 -mt-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold cursor-pointer text-sm lg:px-6 lg:py-3 lg:text-lg"
            onClick={() =>
              document
                .getElementById("productos")
                .scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Seguir viendo
          </button>
        </div>
      </section>

      {/* Productos destacados */}
      <section id="productos">
        <ProductosDestacados />
      </section>
    </div>
  );
}