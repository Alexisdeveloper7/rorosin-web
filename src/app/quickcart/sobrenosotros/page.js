"use client";

import {
  FaShoppingCart,
  FaLaptop,
  FaRocket,
  FaCode,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* HEADER */}
      <div className="bg-white/90 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-5 py-3 md:py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Sobre Nosotros
          </h1>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 md:px-5 pt-6 md:pt-10 pb-4 md:pb-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight text-gray-950">
            QuickCart
          </h2>

          <p className="mt-3 md:mt-4 text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Web moderna desarrollada para mostrar habilidades como programador
            freelancer, enfocada en diseño profesional, rendimiento y una
            experiencia de usuario clara.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="max-w-5xl mx-auto px-4 md:px-5 pb-10">
        <div className="grid gap-4 md:gap-5">
          <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FaShoppingCart className="text-lg md:text-xl text-blue-600" />
              </div>

              <div>
                <h3 className="text-base md:text-xl font-semibold text-gray-900">
                  Web E-commerce
                </h3>

                <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
                  QuickCart es una aplicación web tipo e-commerce creada para
                  demostrar experiencia en interfaces modernas, carrito de
                  compras, pedidos y flujo de usuario.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                <FaLaptop className="text-lg md:text-xl text-purple-600" />
              </div>

              <div>
                <h3 className="text-base md:text-xl font-semibold text-gray-900">
                  Diseño Profesional
                </h3>

                <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
                  La web está enfocada en un diseño limpio, moderno y responsivo,
                  pensado para verse bien en móviles pequeños y también en
                  escritorio.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <FaRocket className="text-lg md:text-xl text-orange-600" />
              </div>

              <div>
                <h3 className="text-base md:text-xl font-semibold text-gray-900">
                  Experiencia de Usuario
                </h3>

                <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
                  Incluye navegación fluida, estados visuales, carrito,
                  autenticación, pedidos y componentes reutilizables para una
                  experiencia clara.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                <FaCode className="text-lg md:text-xl text-green-600" />
              </div>

              <div>
                <h3 className="text-base md:text-xl font-semibold text-gray-900">
                  Desarrollador Freelancer
                </h3>

                <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
                  Desarrollado por Alexis Sánchez como proyecto de portafolio
                  para mostrar habilidades en React, Next.js, Tailwind CSS,
                  autenticación, base de datos, carrito de compras, pedidos y
                  flujo de usuario.
                </p>
              </div>
            </div>
          </div>

          {/* MAPA */}
          <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <FaMapMarkerAlt className="text-red-500" />

              <h3 className="text-base md:text-xl font-semibold text-gray-900">
                Guadalajara, Jalisco
              </h3>
            </div>

            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5">
              Ubicación general del desarrollador freelancer.
            </p>

            <div className="w-full h-52 md:h-[320px] rounded-3xl overflow-hidden border border-gray-200 bg-gray-100">
              <iframe
                src="https://maps.google.com/maps?q=Guadalajara,Jalisco,Mexico&t=&z=12&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="eager"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="max-w-5xl mx-auto px-4 md:px-5 pb-10 md:pb-12">
        <div className="bg-white border border-gray-200 rounded-3xl p-5 md:p-8 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            QuickCart
          </h2>

          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Proyecto web full stack de portafolio, desarrollado para demostrar
            funcionalidades de e-commerce como autenticación, base de datos,
            carrito de compras, pedidos y flujo de usuario. No incluye pagos
            reales.
          </p>

          <div className="mt-6 text-xs md:text-sm text-gray-400 space-y-1">
            <p>Desarrollado por Alexis Sánchez</p>
            <p>Desarrollador Web Freelancer</p>
            <p>Guadalajara, Jalisco, México</p>
          </div>
        </div>
      </section>
    </div>
  );
}