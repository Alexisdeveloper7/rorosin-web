"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function CartAuthLogin({
  isOpen,
  onClose,
  onLoginClick,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0
            bg-black/40 backdrop-blur-sm
            flex items-center justify-center
            z-[90]
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="
              relative
              w-[92%]
              max-w-sm
              bg-white
              rounded-3xl
              shadow-2xl
              p-6
              text-center
            "
          >
            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                w-8 h-8
                rounded-full
                bg-red-500
                hover:bg-red-600
                text-white
                transition
                cursor-pointer
                flex items-center justify-center
              "
            >
              ×
            </button>

            {/* ICON */}
            <div className="text-5xl mb-4">
              🔐
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Inicia sesión para continuar
            </h2>

            {/* TEXT */}
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Necesitas iniciar sesión para poder agregar
              productos a tu carrito.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="
                  flex-1
                  py-3
                  rounded-2xl
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-700
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                Cancelar
              </button>

              <button
                onClick={onLoginClick}
                className="
                  flex-1
                  py-3
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                  active:scale-[0.98]
                "
              >
                Iniciar sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}