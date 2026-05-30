"use client";
import Link from "next/link";

export default function CategoriasDestacadas() {
  const categorias = [
    {
      img: "/images/1111.png",
      nombre: "Monitores",
      categoria_id: 1,
      descripcion:
        "Pantallas de alta resolución para productividad, diseño y gaming.",
    },
    {
      img: "/images/2.png",
      nombre: "Teclados",
      categoria_id: 2,
      descripcion:
        "Teclados mecánicos y de membrana con gran precisión y durabilidad.",
    },
    {
      img: "/images/3.png",
      nombre: "Mouses",
      categoria_id: 3,
      descripcion:
        "Mouse de alta precisión ideales para trabajo y gaming competitivo.",
    },
    {
      img: "/images/4.png",
      nombre: "Headsets",
      categoria_id: 4,
      descripcion: "Audio envolvente con micrófono de alta calidad.",
    },
    {
      img: "/images/121.png",
      nombre: "Accesorios",
      categoria_id: 5,
      descripcion: "Complementos esenciales para mejorar tu setup.",
    },
    {
      img: "/images/6.png",
      nombre: "Gadgets",
      categoria_id: 6,
      descripcion: "Tecnología innovadora para un estilo de vida moderno.",
    },
  ];

  return (
    <section id="categorias" className="body-font bg-white text-gray-900">
      <div className="container px-5 mx-auto">
        <div className="flex flex-wrap -m-4">

          {categorias.map((categoria, index) => (
            <div key={index} className="p-4 w-full md:w-1/2 lg:w-1/3">

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 h-full flex flex-col">

                {/* Imagen */}
                <div className="w-full h-56 flex items-center justify-center bg-white">
                  <img
                    src={categoria.img}
                    alt={categoria.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {categoria.nombre}
                    </h2>

                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      {categoria.descripcion}
                    </p>
                  </div>

                  {/* Botón */}
                  <Link
                    href={`/quickcart/tienda?categoria=${
                      categoria.categoria_id
                    }&nombre=${encodeURIComponent(categoria.nombre)}`}
                    className="w-full"
                  >
                    <button className="w-full border border-gray-300 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition">
                      Ver productos
                    </button>
                  </Link>
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}