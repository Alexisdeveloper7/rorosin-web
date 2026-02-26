"use client";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const contactoNumero = "+52 3312345678"; // único número

  return (
    <footer className="bg-gray-900 text-white text-xs pt-4">
      <div className="max-w-xs mx-auto flex flex-col gap-3 items-center">
        {/* Contacto */}
        <div className="flex flex-col gap-1 items-center">
          <a
            href={`tel:${contactoNumero}`}
            className="flex items-center gap-1 hover:text-green-500 transition font-medium"
          >
            <FaPhoneAlt className="text-sm text-green-300" /> {contactoNumero} (Llamadas & WhatsApp)
          </a>
          <a
            href="mailto:info@rorosin.com"
            className="flex items-center gap-1 hover:text-blue-400 transition font-medium"
          >
            <FaEnvelope className="text-sm text-blue-300" /> correo@rorosin.com
          </a>
          <div className="flex items-center gap-1 text-gray-300 font-medium">
            <FaMapMarkerAlt className="text-sm text-red-300" /> Guadalajara, Jalisco, México
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex gap-3 mt-1">
          <a
            href={`https://wa.me/523312345678`}
            className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition text-white text-sm flex items-center justify-center"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`tel:${contactoNumero}`}
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition text-white text-sm flex items-center justify-center"
          >
            <FaPhoneAlt />
          </a>
          <a
            href="mailto:info@rorosin.com"
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition text-white text-sm flex items-center justify-center"
          >
            <FaEnvelope />
          </a>
        </div>

        {/* Copy */}
        <div className="text-gray-400 text-[10px] mt- border-t border-gray-700 w-full text-center p-1">
          &copy; 2025 Rorosin. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
