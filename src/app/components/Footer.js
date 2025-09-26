"use client";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t-3 border-gray-400  text-white ">
      <div className=" container mx-auto px-5 flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Logo y descripción */}
        

        {/* Contacto */}
        <div className="mt-5 mb-6 md:mb-0">
          <h2 className="font-bold mb-2">Contacto</h2>
          <ul>
            <li className="flex items-center gap-2 mb-1">
              <FaWhatsapp /> <span>+52 33 1234 5678</span>
            </li>
            <li className="flex items-center gap-2 mb-1">
              <FaPhoneAlt /> <span>+52 33 9876 5432</span>
            </li>
            <li className="flex items-center gap-2 mb-1">
              <FaEnvelope /> <span>info@rorosin.com</span>
            </li>
            <li className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt /> <span>Guadalajara, Jalisco, México</span>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="">
          <h2 className="font-bold mb-2">Síguenos</h2>
          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-green-500 transition"><FaWhatsapp /></a>
            <a href="#" className="hover:text-blue-500 transition"><FaPhoneAlt /></a>
            <a href="#" className="hover:text-gray-400 transition"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className=" mt-8 pb-10 text-center text-gray-500 text-sm">
        &copy; 2025 Rorosin. Todos los derechos reservados.
      </div>
    </footer>
  );
}
