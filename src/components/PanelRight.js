"use client";

import { useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PanelRight({
  isOpen,
  onClose,
  abrirLogin,
  abrirSignup,
  abrirConfirmarPedido,
}) {
  const {
    items,
    loading,
    actualizarItem,
    eliminarItem,
  } = useCarrito();

  const { user } = useUser();
  const router = useRouter();

  const carritoVacio = items.length === 0;

  const totalPiezas = items.reduce((acc, item) => {
    return acc + (Number(item.cantidad) || 0);
  }, 0);

  const totalCarrito = items.reduce((acc, item) => {
    const precio = Number(item.precio_unitario) || 0;
    const cantidad = Number(item.cantidad) || 0;

    return acc + precio * cantidad;
  }, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const abrirModalConfirmar = () => {
    if (!user) {
      onClose();

      setTimeout(() => {
        abrirLogin();
      }, 180);

      return;
    }

    if (carritoVacio) return;

    onClose();

    setTimeout(() => {
      abrirConfirmarPedido();
    }, 220);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[52] flex justify-end items-start"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* OVERLAY */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* PANEL */}
            <motion.div
              className="w-80 h-full bg-[#fbfbfd] flex flex-col relative overflow-hidden rounded-tl-[36px] border-l border-white/40"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              {/* HEADER */}
              <div className="relative px-6 pt-7 pb-5 bg-[#fbfbfd]/95 backdrop-blur-xl border-b border-[#ececec]">
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white hover:bg-[#f5f5f7] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer border border-[#ececec]"
                  style={{
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  <X
                    size={18}
                    strokeWidth={2.7}
                    className="text-[#6e6e73]"
                  />
                </button>

                <div className="space-y-1">
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#b0b0b5]">
                    QuickCart
                  </p>

                  <h2 className="text-[30px] leading-none font-semibold text-[#1d1d1f] tracking-tight">
                    Tu Carrito
                  </h2>

                  {user && !carritoVacio && (
                    <p className="text-[12px] text-[#86868b] font-medium pt-1">
                      {totalPiezas}{" "}
                      {totalPiezas === 1
                        ? "producto"
                        : "productos"}{" "}
                      en el carrito
                    </p>
                  )}
                </div>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f5f5f7]">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-2 bg-white p-3 rounded-[24px] animate-pulse border border-[#efefef]"
                    >
                      <div className="w-12 h-12 bg-[#ececec] rounded-[18px]"></div>

                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#ececec] rounded-full w-28"></div>
                        <div className="h-2.5 bg-[#f4f4f4] rounded-full w-16"></div>
                        <div className="h-2.5 bg-[#f4f4f4] rounded-full w-20"></div>
                      </div>
                    </div>
                  ))
                ) : !user ? (
                  <div className="flex flex-col items-center text-center gap-5 mt-14">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center bg-white border border-[#ececec]"
                      style={{
                        boxShadow:
                          "0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    >
                      <span className="text-4xl">🛒</span>
                    </div>

                    <div>
                      <h3 className="text-[23px] font-semibold text-[#1d1d1f] tracking-tight">
                        Inicia sesión
                      </h3>

                      <p className="text-[#86868b] text-sm mt-2 leading-relaxed">
                        Accede para ver tu carrito y pedidos
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full mt-2">
                      <button
                        onClick={() => {
                          onClose();

                          setTimeout(() => {
                            abrirLogin();
                          }, 180);
                        }}
                        className="w-full bg-white text-[#1d1d1f] py-3.5 rounded-[22px] font-semibold transition-all duration-200 cursor-pointer border border-[#e5e5ea] hover:bg-[#f5f5f7]"
                        style={{
                          boxShadow:
                            "0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                      >
                        Iniciar Sesión
                      </button>

                      <button
                        onClick={() => {
                          onClose();

                          setTimeout(() => {
                            abrirSignup();
                          }, 180);
                        }}
                        className="w-full bg-[#f2f2f7] border border-[#e5e5ea] text-[#1d1d1f] py-3.5 rounded-[22px] font-semibold hover:bg-[#ebebf0] transition-all duration-200 cursor-pointer"
                      >
                        Crear Cuenta
                      </button>
                    </div>
                  </div>
                ) : carritoVacio ? (
                  <div className="flex flex-col items-center text-center gap-5 mt-14">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center bg-white border border-[#ececec]"
                      style={{
                        boxShadow:
                          "0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    >
                      <span className="text-4xl">📦</span>
                    </div>

                    <div>
                      <h3 className="text-[23px] font-semibold text-[#1d1d1f] tracking-tight">
                        Tu carrito está vacío
                      </h3>

                      <p className="text-[#86868b] text-sm mt-2">
                        Agrega productos para comenzar
                      </p>
                    </div>
                  </div>
                ) : (
                  items.map((item) => {
                    const precio =
                      Number(item.precio_unitario) || 0;

                    const cantidad =
                      Number(item.cantidad) || 0;

                    const subtotal =
                      precio * cantidad;

                    return (
                      <motion.div
                        key={item.id_item}
                        whileTap={{ scale: 0.985 }}
                        className="flex gap-2 bg-white p-3 rounded-[24px] border border-[#ececec]"
                        style={{
                          boxShadow:
                            "0 5px 16px rgba(0,0,0,0.035), inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                      >
                        <div
                          className="w-12 h-12 flex-shrink-0 bg-[#fafafa] rounded-[18px] border border-[#f0f0f0] flex items-center justify-center overflow-hidden"
                          style={{
                            boxShadow:
                              "inset 0 2px 4px rgba(0,0,0,0.03)",
                          }}
                        >
                          <img
                            src={
                              item.imagen_url ||
                              "/placeholder.png"
                            }
                            alt={item.producto_nombre}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <p className="font-semibold text-[12px] text-[#1d1d1f] leading-tight line-clamp-2">
                              {item.producto_nombre}
                            </p>

                            <div className="mt-1 space-y-0.5">
                              <p className="text-[10px] text-[#86868b]">
                                Precio: ${precio.toFixed(2)}
                              </p>

                              <p className="text-[10px] text-[#86868b]">
                                Subtotal:{" "}
                                <span className="font-semibold text-[#1d1d1f]">
                                  ${subtotal.toFixed(2)}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              onClick={() =>
                                actualizarItem(
                                  item.id_item,
                                  item.cantidad - 1
                                )
                              }
                              className="w-6 h-6 rounded-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-semibold transition cursor-pointer"
                            >
                              -
                            </button>

                            <span className="min-w-[18px] text-center text-xs font-semibold text-[#1d1d1f]">
                              {item.cantidad}
                            </span>

                            <button
                              onClick={() =>
                                actualizarItem(
                                  item.id_item,
                                  item.cantidad + 1
                                )
                              }
                              className="w-6 h-6 rounded-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-semibold transition cursor-pointer"
                            >
                              +
                            </button>

                            <button
                              onClick={() =>
                                eliminarItem(item.id_item)
                              }
                              className="ml-auto text-[#ff453a] text-[11px] font-medium hover:opacity-70 cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              {user && (
                <div className="p-5 border-t border-[#ececec] bg-[#fbfbfd]/95 backdrop-blur-xl space-y-3">
                  <div className="flex justify-center">
                    <div className="h-1 w-16 rounded-full bg-[#d2d2d7]"></div>
                  </div>

                  {!carritoVacio && (
                    <div className="bg-white border border-[#ececec] rounded-[22px] px-4 py-3 space-y-2">
                      <div className="flex justify-between text-[12px] text-[#86868b]">
                        <span>Productos</span>

                        <span className="font-semibold text-[#1d1d1f]">
                          {totalPiezas}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-semibold text-[#1d1d1f]">
                          Total
                        </span>

                        <span className="text-[18px] font-bold text-[#1d1d1f]">
                          ${totalCarrito.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {!carritoVacio && (
                    <button
                      onClick={abrirModalConfirmar}
                      className="w-full bg-white text-[#1d1d1f] py-3.5 rounded-[22px] font-semibold transition-all duration-200 cursor-pointer border border-[#e5e5ea] hover:bg-[#f5f5f7]"
                      style={{
                        boxShadow:
                          "0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    >
                      Confirmar Pedido
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      router.push("/quickcart/carrito");
                    }}
                    className="w-full bg-[#f2f2f7] text-[#1d1d1f] py-3.5 rounded-[22px] font-semibold hover:bg-[#ebebf0] transition-all duration-200 cursor-pointer border border-[#e5e5ea]"
                  >
                    Ver carrito completo
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      router.push("/quickcart/pedidos");
                    }}
                    className="w-full bg-[#f2f2f7] text-[#1d1d1f] py-3.5 rounded-[22px] font-semibold hover:bg-[#ebebf0] transition-all duration-200 cursor-pointer border border-[#e5e5ea]"
                  >
                    Ver pedidos realizados
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}