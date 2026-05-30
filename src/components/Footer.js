"use client";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const contactoNumero = "+52 3312891927";
  const whatsappNumero = "523312891927";
  const correo = "alexisdev7@outlook.com";

  const ubicacionLink =
    "https://www.google.com/maps/place/Guadalajara,+Jalisco,+México";

  return (
    <footer className="text-gray-700 text-sm border-t border-gray-200 bg-white">
      <div className="w-full pt-4 pb-2 flex flex-col items-center gap-2">
        {/* CONTACTO */}
        <div className="flex flex-col items-center gap-1 text-center">
          {/* Teléfono */}
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-gray-500 text-xs" />
            <a
              href={`tel:${contactoNumero}`}
              className="text-gray-600 hover:text-gray-900 transition text-xs"
            >
              {contactoNumero}
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500 text-xs" />
            <a
              href={`mailto:${correo}`}
              className="text-gray-600 hover:text-gray-900 transition text-xs"
            >
              {correo}
            </a>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2 text-[11px]">
            <FaMapMarkerAlt className="text-gray-400" />
            <a
              href={ubicacionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 hover:underline transition"
            >
              Guadalajara, Jalisco, México
            </a>
          </div>
        </div>

        {/* REDES / ACCIONES */}
        <div className="flex gap-2 mt-1">
          <a
            href={`tel:${contactoNumero}`}
            className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition text-gray-700 flex items-center justify-center"
          >
            <FaPhoneAlt size={14} />
          </a>

          <a
            href={`https://wa.me/${whatsappNumero}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] p-1.5 rounded-full hover:bg-[#1fb855] transition text-white flex items-center justify-center shadow-sm"
          >
            <FaWhatsapp size={20} />
          </a>

          <a
            href={`mailto:${correo}`}
            className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition text-gray-700 flex items-center justify-center"
          >
            <FaEnvelope size={14} />
          </a>
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