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
    <section id="productos" className="text-gray-400 body-font">
      <div className="bg-gray-900">
        <h3 className="border-y-2 border-gray-400 rounded-sm flex bg-gray-800 text-center text-white py-5 text-xl justify-center">
          ↓↓ PRODUCTOS ↓↓
        </h3>
      </div>

      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap">
          {productos.map((producto, index) => (
            <div key={index} className="lg:w-1/3 md:w-1/2 p-4 w-full">
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-gray-800">
                <img
                  className="w-full h-56 object-cover object-center"
                  src={producto.img}
                  alt={producto.nombre}
                />
                <div className="p-4">
                  <h2 className="text-white title-font text-lg font-medium mb-1">
                    {producto.nombre}
                  </h2>
                  <p className="text-blue-400 text-sm mb-2">
                    {producto.categoria}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {producto.descripcion}
                  </p>

                  <Link href="/tienda">
                    <button className="mt-3 w-full bg-blue-600/30 text-white py-2 rounded hover:bg-blue-700 transition">
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
