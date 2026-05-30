// components/ConfirmarPedidoModal.jsx

"use client";

import { useEffect, useState } from "react";
import { useCarrito } from "@/context/CarritoContext";

export default function ConfirmarPedidoModal({ isOpen, onClose }) {
  const { confirmarPedido } = useCarrito();

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState(false);

  // =========================
  // 🔄 RESET
  // =========================
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setMensaje("");
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // =========================
  // ✅ CONFIRMAR
  // =========================
  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    setMensaje("");

    try {
      const result = await confirmarPedido();

      console.log("📦 RESULT:", result);

      if (result?.success) {
        setSuccess(true);

        setMensaje(
          result.message || "Pedido realizado correctamente"
        );

        // Espera para mostrar el estado verde y luego cierra
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        setSuccess(false);

        setMensaje(
          result?.message || "No se pudo confirmar el pedido"
        );
      }
    } catch (error) {
      console.error(error);

      setSuccess(false);

      setMensaje("Error inesperado al confirmar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100">

        {/* SUCCESS */}
        {success ? (
          <div className="text-center py-3">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-3xl font-bold">
                ✓
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Pedido confirmado
            </h2>

            <p className="text-sm text-green-600 font-semibold mb-1">
              {mensaje}
            </p>

            <p className="text-xs text-gray-400">
              Cerrando automáticamente...
            </p>
          </div>
        ) : (
          <>
            {/* TITLE */}
            <div className="text-center mb-5">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">
                  🛒
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Confirmar pedido
              </h2>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                ¿Estás seguro de que quieres confirmar este pedido?
              </p>
            </div>

            {/* MESSAGE */}
            {mensaje && (
              <p className="text-center text-red-600 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold mb-4 py-2 px-3">
                {mensaje}
              </p>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center transition shadow-sm ${
                  loading
                    ? "bg-green-500 opacity-80 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  "Confirmar"
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}