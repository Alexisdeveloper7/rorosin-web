"use client";

import { useState, useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ConfirmarPedidoModal from "./ConfirmarPedidoModal";

export default function PanelRight({
  isOpen,
  onClose,
  abrirLogin,
  abrirSignup,
}) {
  const {
    items,
    loading,
    actualizarItem,
    eliminarItem,
    fetchCarrito,
    fetchPedidos,
    confirmarPedido,
  } = useCarrito();

  const { user } = useUser();
  const router = useRouter();
  const [modalConfirmarOpen, setModalConfirmarOpen] = useState(false);

  /* 🔒 Scroll Lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const abrirModalConfirmar = () => {
    if (!user) {
      onClose();
      abrirLogin();
      return;
    }
    setModalConfirmarOpen(true);
  };

  const handleConfirmarPedido = async () => {
    try {
      const exito = await confirmarPedido();
      if (!exito) return false;

      await fetchPedidos();
      await fetchCarrito();

      window.scrollTo({ top: 0, behavior: "smooth" });
      setModalConfirmarOpen(false);
      onClose();
      return true;
    } catch (error) {
      console.error("Error confirmar pedido:", error);
      return false;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end items-start"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-80 h-full bg-white p-6 shadow-xl flex flex-col relative rounded-tl-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
                <h2 className="text-xl font-bold text-blue-600 tracking-wide">
                  Tu Carrito
                </h2>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto mt-6 space-y-4">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-3 bg-gray-100 p-3 rounded-xl animate-pulse"
                    >
                      <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                    </div>
                  ))
                ) : !user ? (
                  <div className="flex flex-col items-center text-center gap-4 mt-10">
                    <p className="text-gray-600">
                      Debes iniciar sesión para ver tu carrito.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={() => { onClose(); abrirLogin(); }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer w-full"
                      >
                        Iniciar Sesión
                      </button>

                      <button
                        onClick={() => { onClose(); abrirSignup(); }}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition cursor-pointer w-full"
                      >
                        Crear Cuenta
                      </button>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center text-center gap-4 mt-10">
                    <p className="text-gray-600">Tu carrito está vacío.</p>

                    <button
                      onClick={() => { onClose(); router.push("/tienda"); }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer w-full"
                    >
                      Ir a tienda
                    </button>

                    <button
                      onClick={() => { onClose(); router.push("/carrito"); }}
                      className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition cursor-pointer w-full"
                    >
                      Ver carrito completo
                    </button>

                    <button
                      onClick={() => { onClose(); router.push("/pedidos"); }}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition cursor-pointer w-full"
                    >
                      Ver pedidos realizados
                    </button>
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                      <div
                        key={item.id_item}
                        className="flex gap-3 bg-gray-50 p-3 rounded-xl"
                      >
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.imagen_url || "/placeholder.png"}
                            alt={item.producto_nombre}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <p className="font-semibold text-sm">{item.producto_nombre}</p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                actualizarItem(item.id_item, item.cantidad - 1)
                              }
                              className="px-2 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition cursor-pointer"
                            >
                              -
                            </button>

                            <span className="min-w-[20px] text-center text-sm font-semibold">
                              {item.cantidad}
                            </span>

                            <button
                              onClick={() =>
                                actualizarItem(item.id_item, item.cantidad + 1)
                              }
                              className="px-2 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition cursor-pointer"
                            >
                              +
                            </button>

                            <button
                              onClick={() => eliminarItem(item.id_item)}
                              className="ml-auto text-red-500 text-xs hover:underline cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Footer con botones */}
                    <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                      <button
                        onClick={abrirModalConfirmar}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
                      >
                        Confirmar Pedido
                      </button>

                      <button
                        onClick={() => { onClose(); router.push("/carrito"); }}
                        className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition cursor-pointer"
                      >
                        Ver carrito completo
                      </button>

                      <button
                        onClick={() => { onClose(); router.push("/pedidos"); }}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition cursor-pointer"
                      >
                        Ver pedidos realizados
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Línea azul siempre al fondo, pegada al panel */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="h-1 w-16 bg-blue-600 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmarPedidoModal
        isOpen={modalConfirmarOpen}
        onClose={() => setModalConfirmarOpen(false)}
        onConfirm={handleConfirmarPedido}
      />
    </>
  );
}