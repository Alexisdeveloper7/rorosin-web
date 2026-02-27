"use client";

import { FaHistory, FaCog, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export default function SobreNosotros() {
  return (
    <div className="bg-gray-10 w-full h-auto">
      {/* Título pegado arriba */}
      <h1 className="text-2xl sm:text-3xl font-bold text-black px-4 py-2 sticky top-0 bg-gray-10 z-10 border-b border-gray-300">
        Sobre Nosotros
      </h1>

      {/* SECCIÓN DE CARDS */}
      <section className="max-w-3xl mx-auto px-4 py-4 space-y-3 sm:space-y-4">
        {/* Historia */}
        <div className="bg-blue-100 rounded-2xl p-3 shadow-md hover:shadow-xl transition flex items-center gap-3">
          <FaHistory className="text-blue-600 text-2xl" />
          <div>
            <h2 className="text-lg font-bold text-blue-700">Nuestra Historia</h2>
            <p className="text-gray-800 text-sm">
              ROROSIN nace con la misión de ofrecer piezas de máquinas industriales de calidad, confiables y duraderas.
            </p>
          </div>
        </div>

        {/* Qué Vendemos */}
        <div className="bg-green-100 rounded-2xl p-3 shadow-md hover:shadow-xl transition flex items-center gap-3">
          <FaCog className="text-green-600 text-2xl" />
          <div>
            <h2 className="text-lg font-bold text-green-700">Qué Vendemos</h2>
            <p className="text-gray-800 text-sm">
              Rodillos, rodamientos y soluciones industriales para maquinaria.
            </p>
          </div>
        </div>

        {/* Experiencia */}
        <div className="bg-yellow-100 rounded-2xl p-3 shadow-md hover:shadow-xl transition flex items-center gap-3">
          <FaClock className="text-yellow-600 text-2xl" />
          <div>
            <h2 className="text-lg font-bold text-yellow-700">Experiencia</h2>
            <p className="text-gray-800 text-sm">
              Más de 10 años proporcionando soluciones industriales confiables.
            </p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-purple-100 rounded-2xl p-3 shadow-md hover:shadow-xl transition flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-purple-600 text-2xl" />
            <h2 className="text-lg font-bold text-purple-700">Nuestra Sucursal</h2>
          </div>
          <p className="text-gray-800 text-sm text-center">
            Guadalajara, Jalisco, México
          </p>
          <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-purple-300 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.123456789!2d-103.349!3d20.673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b2c2f0c8f7d1%3A0x123456789abcdef!2sGuadalajara%2C%20Jalisco%2C%20México!5e0!3m2!1ses!2sus!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}