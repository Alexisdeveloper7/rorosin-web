"use client";
import Link from "next/link";

export default function ProductosDestacados() {
  const productos = [
    {
      img: "/images/1.png",
      nombre: "Rodamientos",
      categoria: "Industrial",
      descripcion:
        "El desarrollo, diseño y fabricación de rodamientos está en el centro de nuestro negocio.",
    },
    {
      img: "/images/2.png",
      nombre: "Sellos",
      categoria: "Automotriz",
      descripcion:
        "Ofrecemos una amplia variedad de sellos industriales y automotrices. Los sellos ayudan a reducir la fricción y prolongar el mantenimiento.",
    },
    {
      img: "/images/3.png",
      nombre: "Lubricación",
      categoria: "Mantenimiento",
      descripcion:
        "En muchas aplicaciones, la lubricación es vital para el rendimiento de los rodamientos y esta imagen es sacada de skf.",
    },
    {
      img: "/images/4.png",
      nombre: "Cadenas",
      categoria: "Industrial",
      descripcion:
        "Ofrecemos cadenas de alta resistencia para aplicaciones industriales y automotrices, esto es de prueba.",
    },
    {
      img: "/images/5.png",
      nombre: "Poleas",
      categoria: "Industrial",
      descripcion:
        "Poleas y correas de alta calidad para sistemas de transmisión. Diseñadas para larga duración y mínimo mantenimiento.",
    },
    {
      img: "/images/6.png",
      nombre: "Lubricantes Especiales",
      categoria: "Mantenimiento",
      descripcion:
        "Lubricantes de alto rendimiento para maquinaria y rodamientos. Reducen fricción y aumentan la vida útil.",
    },
  ];

  return (
    <section id="productos" className="body-font text-gray-400">
      {/* Encabezado */}
      <div className="bg-gray-900">
        <h3 className="border-y-2 border-gray-400 bg-gray-800 text-white text-center py-5 text-xl font-semibold">
          ↓↓ PRODUCTOS ↓↓
        </h3>
      </div>

      {/* Contenedor de productos */}
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-4">
          {productos.map((producto, index) => (
            <div key={index} className="p-4 w-full md:w-1/2 lg:w-1/3">
              <div className="border rounded-xl overflow-hidden bg-gray-800 cursor-pointe hover:shadow-2xl hover:scale-105 transition-transform duration-300">
                {/* Imagen */}
                <img
                  className="w-full h-56 object-cover object-center"
                  src={producto.img}
                  alt={producto.nombre}
                />

                {/* Contenido */}
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-white text-xl font-bold mb-2">
                      {producto.nombre}
                    </h2>
                    <p className="text-blue-400 text-sm mb-2 font-medium">
                      {producto.categoria}
                    </p>
                    <p className="text-gray-300 text-sm mb-4">
                      {producto.descripcion}
                    </p>
                  </div>

                  {/* Botón */}
                  <Link href="/tienda">
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-transform duration-200 cursor-pointer">
                      Ver stock
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