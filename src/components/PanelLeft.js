'use client';

import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function PanelLeft({
  isOpen,
  onClose,
  abrirLogin,
  abrirSignup
}) {
  const { user, logout, loading } = useUser();
  const router = useRouter();

  // 🔒 Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goTo = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-start items-start"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-80 h-full bg-white p-6 shadow-xl rounded-tr-2xl flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition shadow-sm cursor-pointer"
            >
              <X size={20} strokeWidth={2.5} className="text-gray-700" />
            </button>

            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-600 tracking-wide">
                Menú
              </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-8 flex flex-col gap-3 text-base">

              {[
                { name: 'Inicio', path: '/' },
                { name: 'Tienda', path: '/tienda' },
                { name: 'Mi carrito', path: '/carrito' },
                { name: 'Mis pedidos', path: '/pedidos' },
                { name: 'Acerca de la empresa', path: '/sobrenosotros' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => goTo(item.path)}
                  className="flex items-center justify-between px-5 py-3 rounded-2xl font-medium text-gray-700 
                             bg-gray-50 hover:bg-green-50 hover:text-green-600 shadow-sm hover:shadow-md 
                             transition-all duration-200 cursor-pointer border border-gray-100"
                >
                  <span>{item.name}</span>
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              ))}

              <div className="border-t border-gray-200 my-4"></div>

              {loading ? (
                <>
                  <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse mt-3"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse mt-2"></div>
                </>
              ) : user ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Sesión Iniciada Como
                    </p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {user.nombre_usuario || user.usuario}
                    </p>
                  </div>

                  <button
                    onClick={() => goTo('/mi-cuenta')}
                    className="bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
                  >
                    Mi Cuenta
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      abrirLogin();
                      onClose();
                    }}
                    className="bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>

                  <button
                    onClick={() => {
                      abrirSignup();
                      onClose();
                    }}
                    className="bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition cursor-pointer"
                  >
                    Crear Cuenta
                  </button>
                </>
              )}
            </nav>

            <div className="mt-auto pt-6">
              <div className="h-1 w-16 bg-green-600 rounded-full mx-auto"></div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}