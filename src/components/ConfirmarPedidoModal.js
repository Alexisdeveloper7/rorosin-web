"use client";

import { useState } from "react";
import { useCarrito } from "@/context/CarritoContext";

export default function ConfirmarPedidoModal({ isOpen, onClose }) {
  const { confirmarPedido } = useCarrito();
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await confirmarPedido(); // Devuelve { success, message }

      if (result.success) {
        setMensajeExito(result.message || "✅ Pedido realizado correctamente");

        // Mantener mensaje visible 2 segundos antes de cerrar
        setTimeout(() => {
          setMensajeExito("");
          setLoading(false);
          onClose();
        }, 1200);
      } else {
        // Mensaje de error dentro del modal
        setMensajeExito(result.message || "❌ No se pudo confirmar el pedido");
        setTimeout(() => {
          setMensajeExito("");
          setLoading(false);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      setMensajeExito("❌ Error inesperado al confirmar pedido");
      setTimeout(() => {
        setMensajeExito("");
        setLoading(false);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-80 max-w-full text-center shadow-2xl">
        {/* Mostrar mensaje si existe */}
        {mensajeExito ? (
          <p
            className={`font-semibold text-center mb-4 ${
              mensajeExito.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensajeExito}
          </p>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4">Confirmar pedido</h2>
            <p className="text-sm text-gray-700 mb-6">
              ¿Estás seguro de que quieres confirmar este pedido?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className={`px-4 py-2 rounded bg-gray-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
                }`}
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded text-white flex items-center justify-center ${
                  loading
                    ? "bg-green-600 opacity-70 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
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