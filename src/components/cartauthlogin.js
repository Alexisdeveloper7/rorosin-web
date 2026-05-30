"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartAuthLogin({
  isOpen,
  onClose,
  onLoginClick,
}) {
  const [visible, setVisible] = useState(false);
  const scrollYRef = useRef(0);

  // =========================
  // 🔥 CONTROL DE VISIBILIDAD + BLOQUEO SCROLL
  // =========================
  useEffect(() => {
    if (isOpen) {
      setVisible(true);

      scrollYRef.current = window.scrollY;

      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      const scrollY = scrollYRef.current;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // =========================
  // ❌ CERRAR CON ANIMACIÓN
  // =========================
  const cerrarModal = () => {
    setVisible(false);

    setTimeout(() => {
      onClose();
    }, 200);
  };

  // =========================
  // ✅ LOGIN
  // =========================
  const handleLoginClick = () => {
    setVisible(false);

    setTimeout(() => {
      onLoginClick();
    }, 200);
  };

  return (
    <AnimatePresence mode="wait">
      {visible && isOpen && (
        <motion.div
          className="
            fixed inset-0
            z-[9999]
            flex items-center justify-center
            px-4
          "
          onClick={cerrarModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* OVERLAY */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{
              duration: 0.2,
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
              border-4 border-gray-200
            "
          >
            {/* CLOSE */}
            <button
              onClick={cerrarModal}
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
                onClick={cerrarModal}
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
                onClick={handleLoginClick}
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