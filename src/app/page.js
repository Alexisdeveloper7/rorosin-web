"use client";
import ProductosDestacados from "../components/ProductosDestacados";

export default function Page() {
  return (
    <div className="bg-gray-800 text-white">
      {/* HERO */}
      <section
        id="inicio"
        className="w-full h-screen bg-[url('/images/ppp.png')] bg-cover bg-center"
      >
        {/* Espacio del header sticky */}
        <div className="-mt-[124px]"></div>

        {/* Contenido centrado verticalmente */}
        <div className="flex flex-col justify-center items-center text-center h-[calc(100vh-124px)]">
          <div className="backdrop-blur bg-white/7 mx-6 rounded-2xl inline-block">
            <h1 className="text-3xl py-1 font-bold bg-black/60 rounded-2xl">
              Bienvenido a ROROSIN
            </h1>
            <p className="text-white font-bold break-words text-black">
              Explora nuestro sitio web para descubrir nuestros productos y servicios, conoce nuestra empresa y encuentra justo lo que necesitas, disfrutando de una experiencia única y agradable al navegar.
            </p>
          </div>

          {/* Flechas animadas */}
          <div className="mt-2 animate-bounce text-white text-3xl">
            &#x2193; &#x2193; &#x2193;
          </div>

          {/* Botón de invitación */}
          <button
            className="p-2 -mt-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
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