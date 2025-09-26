"use client";
import { useState, useEffect } from "react";
import HeaderFlotante from "./components/Header";
import { FaUser } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gray-900">
      {/* Header flotante */}
      <HeaderFlotante />

      {/* Hero */}
      <div id="inicio" className="relative w-full h-[108vh] overflow-hidden">
        <img
          src="/images/heropc.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Cuadro centrado sobre el hero */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-white/40 mx-5 backdrop-blur-md p-6 rounded-lg text-center max-w-md sm:max-w-xl sm:p-10 sm:rounded-xl -translate-y-10">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">
              Rodillos Rodamientos y Soluciones Industriales
            </h1>
            <p className="text-base sm:text-lg mb-4">
              Somos una empresa dedicada a ofrecer productos industriales de alta calidad, como rodamientos, cadenas, poleas y soluciones personalizadas para tus proyectos.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById("productos");
                if (element) {
                  const yOffset = -94;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ↓↓↓ Click aquí para ver nuestros productos ↓↓↓
            </button>
          </div>
        </div>
      </div>

      {/* Productos */}
      <section id="productos" className="text-gray-400 body-font">
        <div className="pt-5 bg-gray-900">
          <h3 className="rounded-sm flex bg-gray-800 text-center text-white py-3 text-xl justify-center">
            ↓↓ PRODUCTOS ↓↓
          </h3>
        </div>

        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap">
            {[
              {
                img: "/images/1.png",
                nombre: "Rodamientos",
                categoria: "Industrial",
                descripcion:
                  "El desarrollo, diseño y fabricación de rodamientos está en el centro de nuestro negocio. Con rodamientos montados y soporte para diversas aplicaciones."
              },
              {
                img: "/images/2.png",
                nombre: "Sellos",
                categoria: "Automotriz",
                descripcion:
                  "Ofrecemos una amplia variedad de sellos industriales y automotrices. Los sellos ayudan a reducir la fricción, prolongar el mantenimiento y minimizar el impacto ambiental."
              },
              {
                img: "/images/3.png",
                nombre: "Lubricación",
                categoria: "Mantenimiento",
                descripcion:
                  "En muchas aplicaciones, la lubricación es vital para el rendimiento de los rodamientos. Un uso adecuado de lubricantes reduce costos y prolonga la vida útil de los componentes."
              },
            ].map((producto, index) => (
              <div key={index} className="lg:w-1/3 md:w-1/2 p-4 w-full">
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-gray-800">
                  <img
                    className="w-full h-56 object-cover object-center"
                    src={producto.img}
                    alt={producto.nombre}
                  />
                  <div className="p-4">
                    <h2 className="text-white title-font text-lg font-medium mb-1">{producto.nombre}</h2>
                    <p className="text-blue-400 text-sm mb-2">{producto.categoria}</p>
                    <p className="text-gray-300 text-sm mb-4">{producto.descripcion}</p>
                    <button className="mt-3 w-full bg-blue-600/30 text-white py-2 rounded hover:bg-blue-700 transition">
                      Ver stock 
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="bg-gray-800 py-12">
        <div className="container px-5 mx-auto text-center">
          <h2 className="text-2xl text-white font-bold mb-8">Reseñas de nuestros clientes</h2>
          <p className="text-gray-300 mb-6">
            &iquest;Quieres dejarnos tu opini&oacute;n? &iexcl;Nos encantar&iacute;a saber tu experiencia!
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition mb-8">
            ↓ Dejar una reseña ↓
          </button>
          <div className="flex flex-wrap -m-4 justify-center">
            {[
              { cliente: "Cliente 1", empresa: "Empresa XYZ", estrellas: 5 },
              { cliente: "Cliente 2", empresa: "Empresa ABC", estrellas: 4 },
              { cliente: "Cliente 3", empresa: "Empresa LMN", estrellas: 3 },
            ].map((item, index) => (
              <div key={index} className="p-4 w-full md:w-1/3">
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center mb-4 text-gray-300">
                    <FaUser className="text-3xl mr-2" />
                    <h3 className="text-white font-bold">{item.cliente}</h3>
                  </div>
                  <p className="text-gray-200 mb-4">
                    "Excelente producto y servicio. Muy recomendable para cualquier proyecto industrial."
                  </p>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-yellow-400 text-xl ${star > item.estrellas ? "opacity-40" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">{item.empresa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
