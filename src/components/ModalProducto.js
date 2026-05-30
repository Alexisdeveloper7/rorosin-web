"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

export default function ModalProducto({
  producto,
  onCerrar,
  onRequireAuth,
}) {
  const { user } = useUser();
  const { addItem } = useCarrito();
  const { showToast } = useToast();

  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locked, setLocked] = useState(false);

  // 🔥 FIX: control real de visibilidad para exit animation
  const [visible, setVisible] = useState(false);

  const scrollYRef = useRef(0);

  const incrementar = () => setCantidad((p) => p + 1);
  const decrementar = () => setCantidad((p) => (p > 1 ? p - 1 : 1));

  useEffect(() => {
    if (producto) {
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
  }, [producto]);

  useEffect(() => {
    if (producto) {
      setCantidad(1);
      setLoading(false);
      setSuccess(false);
      setLocked(false);
    }
  }, [producto]);

  // 🔥 FIX: cierre con delay para permitir exit animation
  const cerrarModal = () => {
    setVisible(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(false);
      setLocked(false);
      onCerrar();
    }, 200);
  };

  const handleAgregar = async () => {
    if (loading || locked || success) return;

    if (!user) {
      cerrarModal();
      setTimeout(() => onRequireAuth(), 120);
      return;
    }

    const productoId =
      producto?.id ?? producto?.producto_id ?? producto?._id;

    try {
      setLoading(true);
      setLocked(true);

      const result = await addItem(productoId, null, cantidad);

      setLoading(false);

      if (!result) {
        setLocked(false);
        showToast("No se pudo agregar ❌", "error");
        return;
      }

      setSuccess(true);
      setLocked(true);

      setTimeout(() => {
        cerrarModal();
        setTimeout(() => {
          showToast("Agregado al carrito 🛒", "success");
        }, 120);
      }, 900);
    } catch (error) {
      setLoading(false);
      setLocked(false);
      showToast("Error del servidor ❌", "error");
    }
  };

  const precio = Number(producto?.precio || 0);
  const total = precio * cantidad;

  return (
    <AnimatePresence mode="wait">
      {visible && producto && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
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
            className="border-4 border-gray-200 relative w-full max-w-md max-h-[90vh]
                       bg-white rounded-[28px] shadow-2xl overflow-y-auto"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            {/* CLOSE */}
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 hover:scale-105 active:scale-95 transition z-10"
            >
              ×
            </button>

            {/* IMAGE */}
            <div className="p-5">
              <img
                src={producto?.imagen}
                alt={producto?.nombre}
                className="w-full h-60 object-contain"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5 border-t-2 border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {producto?.nombre}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {producto?.descripcion}
              </p>
            </div>

            <div className="px-5 pb-5 space-y-4">
              {/* QUANTITY */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cantidad</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementar}
                    disabled={locked}
                    className={`w-10 h-10 rounded-full bg-gray-100 transition ${
                      locked
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-200 active:scale-95"
                    }`}
                  >
                    -
                  </button>

                  <span className="font-semibold">{cantidad}</span>

                  <button
                    onClick={incrementar}
                    disabled={locked}
                    className={`w-10 h-10 rounded-full bg-gray-100 transition ${
                      locked
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-200 active:scale-95"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-500">
                <span className="text-sm font-medium text-gray-600">
                  Total ({cantidad} {cantidad === 1 ? "pieza" : "piezas"})
                </span>

                <span className="text-lg font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleAgregar}
                disabled={loading || locked || success}
                className={`w-full py-3.5 rounded-2xl text-white font-medium cursor-pointer transition-all active:scale-[0.98] ${
                  success
                    ? "bg-green-600"
                    : loading
                    ? "bg-gray-500 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {success
                  ? "Agregado ✔"
                  : loading
                  ? "Agregando..."
                  : "Añadir al carrito"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}