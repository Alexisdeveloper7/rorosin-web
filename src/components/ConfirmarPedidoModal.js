// components/ConfirmarPedidoModal.jsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ConfirmarPedidoModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  const scrollYRef = useRef(0);

  // =========================
  // 🔥 CONTROL DE VISIBILIDAD
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
  // 🔄 RESET
  // =========================
  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setMensaje("");
      setSuccess(false);
    }
  }, [isOpen]);

  // =========================
  // ❌ CERRAR CON ANIMACIÓN
  // =========================
  const cerrarModal = () => {
    if (loading) return;

    setVisible(false);

    setTimeout(() => {
      setLoading(false);
      setMensaje("");
      setSuccess(false);
      onClose();
    }, 200);
  };

  // =========================
  // ✅ CONFIRMAR
  // =========================
  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    setMensaje("");

    try {
      const result = await onConfirm();

      console.log("📦 RESULT:", result);

      if (result?.success || result === true) {
        const mensajeFinal =
          result?.message || "Pedido confirmado correctamente";

        setSuccess(true);
        setMensaje(mensajeFinal);

        setTimeout(() => {
          setVisible(false);

          setTimeout(() => {
            onClose();
            router.push("/quickcart/pedidos");

            setTimeout(() => {
              showToast("Pedido confirmado ✅", "success");
            }, 350);
          }, 200);
        }, 900);
      } else {
        setSuccess(false);

        setMensaje(
          result?.message || "No se pudo confirmar el pedido"
        );

        setLoading(false);
      }
    } catch (error) {
      console.error(error);

      setSuccess(false);

      setMensaje("Error inesperado al confirmar pedido");

      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {visible && isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          onClick={cerrarModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* OVERLAY IGUAL A MODALPRODUCTO */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="border-4 border-gray-200 relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl overflow-hidden"
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {/* CLOSE */}
            {!success && (
              <button
                onClick={cerrarModal}
                disabled={loading}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition z-10 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <X size={18} strokeWidth={3} />
              </button>
            )}

            {/* SUCCESS */}
            {success ? (
              <motion.div
                className="text-center py-8 px-6"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-3xl font-bold">
                    ✓
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Pedido confirmado
                </h2>

                <p className="text-sm text-green-600 font-semibold mb-1">
                  {mensaje}
                </p>

                <p className="text-xs text-gray-400">
                  Redirigiendo a tus pedidos...
                </p>
              </motion.div>
            ) : (
              <>
                {/* HEADER */}
                <div className="p-6 text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-3xl">
                      🛒
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Confirmar pedido
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    ¿Estás seguro de que quieres confirmar este pedido?
                  </p>
                </div>

                {/* CONTENT */}
                <div className="px-6 pb-6 space-y-4 border-t-2 border-gray-200 pt-5">
                  {/* MESSAGE */}
                  {mensaje && (
                    <p className="text-center text-red-600 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold py-2 px-3">
                      {mensaje}
                    </p>
                  )}

                  {/* BUTTONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={cerrarModal}
                      disabled={loading}
                      className={`flex-1 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer active:scale-[0.98]"
                      }`}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className={`flex-1 py-3.5 rounded-2xl text-white font-medium flex items-center justify-center transition-all active:scale-[0.98] ${
                        loading
                          ? "bg-gray-500 cursor-wait"
                          : "bg-green-600 hover:bg-green-700 cursor-pointer"
                      }`}
                    >
                      {loading ? (
                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        "Confirmar"
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}