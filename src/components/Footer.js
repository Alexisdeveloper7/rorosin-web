"use client";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const mostrarAvisoDemo = () => {
    alert("Esta es una versión de demostración. No contiene contactos reales.");
  };

  return (
    <footer className="text-gray-700 text-sm border-t border-gray-200 bg-white">
      <div className="w-full pt-4 pb-2 flex flex-col items-center gap-2">
        {/* CONTACTO */}
        <div className="flex flex-col items-center gap-1 text-center">
          {/* Teléfono */}
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-gray-500 text-xs" />
            <button
              type="button"
              onClick={mostrarAvisoDemo}
              className="text-gray-600 hover:text-gray-900 transition text-xs cursor-pointer"
            >
              +52 000 000 0000
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500 text-xs" />
            <button
              type="button"
              onClick={mostrarAvisoDemo}
              className="text-gray-600 hover:text-gray-900 transition text-xs cursor-pointer"
            >
              contact@example.com
            </button>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2 text-[11px]">
            <FaMapMarkerAlt className="text-gray-400" />
            <button
              type="button"
              onClick={mostrarAvisoDemo}
              className="text-gray-500 hover:text-gray-900 hover:underline transition cursor-pointer"
            >
              Guadalajara, Jalisco, México
            </button>
          </div>
        </div>

        {/* REDES / ACCIONES */}
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={mostrarAvisoDemo}
            className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition text-gray-700 flex items-center justify-center cursor-pointer"
          >
            <FaPhoneAlt size={14} />
          </button>

          <button
            type="button"
            onClick={mostrarAvisoDemo}
            className="bg-[#25D366] p-1.5 rounded-full hover:bg-[#1fb855] transition text-white flex items-center justify-center shadow-sm cursor-pointer"
          >
            <FaWhatsapp size={20} />
          </button>

          <button
            type="button"
            onClick={mostrarAvisoDemo}
            className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition text-gray-700 flex items-center justify-center cursor-pointer"
          >
            <FaEnvelope size={14} />
          </button>
        </div>

        {/* TEXTO FINAL */}
        <div className="text-gray-400 text-center text-[10px] leading-tight mt-1">
          Creado por Alexis Sánchez – Aplicación web de e-commerce
          <br />
          Proyecto de portafolio
        </div>
      </div>
    </footer>
  );
}