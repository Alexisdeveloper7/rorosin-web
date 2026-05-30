"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

import ProductosRecomendados from "@/components/ProductosRecomendados";
import ModalLogin from "@/components/ModalLogin";
import ModalSignup from "@/components/ModalSignup";

export default function PedidosPage() {
  const router = useRouter();

  const { pedidos, loadingPedidos, fetchPedidos, addItem } = useCarrito();

  const {
    user,
    loading: loadingUser,
    loginModalOpen,
    signupModalOpen,
    openLoginModal,
    openSignupModal,
    closeLoginModal,
    closeSignupModal,
  } = useUser();

  const { showToast } = useToast();

  const [cargando, setCargando] = useState(true);
  const [primeraCargaTerminada, setPrimeraCargaTerminada] = useState(false);

  const [localPedidos, setLocalPedidos] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [productosRecomendados, setProductosRecomendados] = useState([]);

  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (loadingUser) return;

    let mounted = true;

    const load = async () => {
      try {
        if (user) {
          await fetchPedidos();
        }
      } finally {
        if (mounted) {
          setCargando(false);
          setPrimeraCargaTerminada(true);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user, loadingUser, fetchPedidos]);

  // ===============================
  // ✅ PEDIDOS SIN REFRESCAR TODAS LAS CARDS
  // ===============================
  useEffect(() => {
    if (!pedidos) return;

    setLocalPedidos((prev) => {
      if (prev.length === 0) {
        return pedidos;
      }

      const idsActuales = new Set(prev.map((pedido) => pedido.id));

      const pedidosNuevos = pedidos.filter(
        (pedido) => !idsActuales.has(pedido.id)
      );

      if (pedidosNuevos.length === 0) {
        return prev;
      }

      return [...pedidosNuevos, ...prev];
    });
  }, [pedidos]);

  // ===============================
  // PRODUCTOS RECOMENDADOS ESTABLES
  // ===============================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/productos", {
          cache: "no-store",
        });

        const data = await res.json();

        const productosMapeados = data.map((p) => ({
          id: p.id,
          producto_nombre: p.nombre,
          precio_unitario: Number(p.precio) || 0,
          imagen_url: p.imagen || "/placeholder.png",
        }));

        setTodosProductos(productosMapeados);

        setProductosRecomendados(
          [...productosMapeados].sort(() => Math.random() - 0.5).slice(0, 5)
        );
      } catch {
        setTodosProductos([]);
        setProductosRecomendados([]);
      }
    };

    fetchProducts();
  }, []);

  const relatedProducts = useMemo(() => {
    return productosRecomendados;
  }, [productosRecomendados]);

  const rellenarRecomendados = (productoAgregadoId) => {
    setProductosRecomendados((prev) => {
      const filtrados = prev.filter(
        (producto) => producto.id !== productoAgregadoId
      );

      const idsActuales = new Set(filtrados.map((producto) => producto.id));

      const disponibles = todosProductos.filter(
        (producto) =>
          producto.id !== productoAgregadoId && !idsActuales.has(producto.id)
      );

      const mezclados = [...disponibles].sort(() => Math.random() - 0.5);

      const faltantes = 5 - filtrados.length;

      if (faltantes <= 0) {
        return filtrados.slice(0, 5);
      }

      return [...filtrados, ...mezclados.slice(0, faltantes)].slice(0, 5);
    });
  };

  const formatPrice = (value) => {
    return Number(value || 0).toFixed(2);
  };

  const getItemPrice = (item) => {
    return (
      Number(item.precio_unitario) ||
      Number(item.precio) ||
      Number(item.precio_producto) ||
      0
    );
  };

  const getItemSubtotal = (item) => {
    const cantidad = Number(item.cantidad) || 1;
    const precio = getItemPrice(item);

    return cantidad * precio;
  };

  const getTotalProductos = (pedido) => {
    return (
      pedido.items?.reduce((total, item) => {
        return total + (Number(item.cantidad) || 1);
      }, 0) || 0
    );
  };

  const getTotalPedido = (pedido) => {
    if (pedido.total !== undefined && pedido.total !== null) {
      return Number(pedido.total) || 0;
    }

    return (
      pedido.items?.reduce((total, item) => {
        return total + getItemSubtotal(item);
      }, 0) || 0
    );
  };

  const cancelarPedido = async (id) => {
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      setLocalPedidos((prev) => prev.filter((p) => p.id !== id));

      showToast("Pedido cancelado ❌", "success");
    } catch {
      showToast("Error al cancelar", "error");
    }
  };

  const handleAddRecommended = async (item) => {
    if (!user) return openLoginModal();

    setAddingId(item.id);

    try {
      await new Promise((r) => setTimeout(r, 300));

      await addItem(item.id, null, 1);

      setAddingId(null);
      setAddedId(item.id);

      showToast("Agregado al carrito 🛒", "success");

      setTimeout(() => {
        setAddedId(null);
        rellenarRecomendados(item.id);
      }, 1200);
    } catch (error) {
      console.error("Error addItem pedidos:", error);
      setAddingId(null);
      showToast("Error al agregar al carrito", "error");
    }
  };

  const mostrarSkeleton =
    loadingUser || (!primeraCargaTerminada && (cargando || loadingPedidos));

  if (mostrarSkeleton) {
    return (
      <div className="w-full px-4 py-6 animate-pulse">
        <h1 className="text-4xl font-extrabold text-center text-gray-300 mb-6">
          Mis pedidos
        </h1>

        <div className="flex gap-6 max-w-6xl mx-auto">
          <div className="flex-1 space-y-4">
            <div className="h-40 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>

          <div className="hidden md:flex w-[320px] flex-col gap-4">
            <div className="h-32 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full px-4 py-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
          Mis pedidos
        </h1>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.5l-9-5-9 5 9 5 9-5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.5v7l9 5 9-5v-7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            Inicia sesión para ver tus pedidos
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Necesitas una cuenta para consultar el historial de tus compras.
          </p>

          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            <button
              onClick={openLoginModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Iniciar sesión
            </button>

            <button
              onClick={openSignupModal}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Crear cuenta
            </button>
          </div>
        </div>

        <ModalLogin isOpen={loginModalOpen} onClose={closeLoginModal} />
        <ModalSignup isOpen={signupModalOpen} onClose={closeSignupModal} />
      </div>
    );
  }

  const isEmpty = localPedidos.length === 0;

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
        Mis pedidos
      </h1>

      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        <div className="flex-1 space-y-4">
          {isEmpty ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 8.5l-9-5-9 5 9 5 9-5z" />
                  <path d="M3 8.5v7l9 5 9-5v-7" />
                  <path d="M12 13.5v7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-700">
                No tienes pedidos aún
              </h2>

              <p className="text-sm text-gray-500">
                Tus compras aparecerán aquí cuando realices tu primer pedido.
              </p>

              <div className="flex gap-3 mt-4 flex-wrap justify-center">
                <button
                  onClick={() => router.push("/quickcart")}
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-black transition"
                >
                  Ver tienda
                </button>

                <button
                  onClick={() => router.push("/quickcart/carrito")}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  Ver carrito
                </button>
              </div>
            </div>
          ) : (
            <>
              {localPedidos.map((p) => {
                const totalProductos = getTotalProductos(p);
                const totalPedido = getTotalPedido(p);

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="flex justify-between gap-4 p-4 border-b bg-gray-50">
                      <div>
                        <p className="text-[11px] text-gray-500">
                          Pedido realizado
                        </p>

                        <p className="text-[12px] font-medium text-gray-800">
                          {new Date(p.fecha).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] text-gray-500">Productos</p>

                        <p className="text-[13px] font-bold text-gray-800">
                          {totalProductos}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 space-y-3">
                      {p.items?.map((i, idx) => {
                        const cantidad = Number(i.cantidad) || 1;
                        const precioUnitario = getItemPrice(i);
                        const subtotal = getItemSubtotal(i);

                        return (
                          <div
                            key={`${p.id}-${i.id || i.producto_id || idx}`}
                            className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
                          >
                            <img
                              src={i.imagen || "/placeholder.png"}
                              className="w-14 h-14 object-contain bg-white border rounded-lg"
                              alt={i.nombre_producto}
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-gray-800 truncate">
                                {i.nombre_producto}
                              </p>

                              <div className="mt-1 space-y-0.5">
                                <p className="text-[11px] text-gray-500">
                                  Cantidad:{" "}
                                  <span className="font-medium text-gray-700">
                                    {cantidad}
                                  </span>
                                </p>

                                <p className="text-[11px] text-gray-500">
                                  Precio unitario:{" "}
                                  <span className="font-medium text-gray-700">
                                    ${formatPrice(precioUnitario)}
                                  </span>
                                </p>

                                <p className="text-[11px] text-gray-500">
                                  Subtotal:{" "}
                                  <span className="font-bold text-blue-600">
                                    ${formatPrice(subtotal)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="border-t pt-3 mt-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[12px] font-semibold text-gray-800">
                              Total del pedido
                            </p>

                            <p className="text-[11px] text-gray-500">
                              {totalProductos}{" "}
                              {totalProductos === 1
                                ? "producto"
                                : "productos"}{" "}
                              en total
                            </p>
                          </div>

                          <p className="text-[16px] font-extrabold text-blue-600">
                            ${formatPrice(totalPedido)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => cancelarPedido(p.id)}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Cancelar pedido
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      ¿Quieres seguir comprando?
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Puedes volver a la tienda o revisar tu carrito cuando
                      quieras.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.push("/quickcart")}
                      className="
                        bg-gray-900 hover:bg-black
                        text-white
                        px-5 py-3
                        rounded-xl
                        text-sm font-semibold
                        transition
                        shadow-sm
                      "
                    >
                      Ver tienda
                    </button>

                    <button
                      onClick={() => router.push("/quickcart/carrito")}
                      className="
                        bg-blue-600 hover:bg-blue-700
                        text-white
                        px-5 py-3
                        rounded-xl
                        text-sm font-semibold
                        transition
                        shadow-sm
                      "
                    >
                      Ver carrito
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden md:flex w-[320px] flex-col gap-4">
          <ProductosRecomendados
            relatedProducts={relatedProducts}
            addingId={addingId}
            addedId={addedId}
            handleAddRecommended={handleAddRecommended}
          />
        </div>
      </div>

      <div className="md:hidden mt-6">
        <ProductosRecomendados
          mobile
          relatedProducts={relatedProducts}
          addingId={addingId}
          addedId={addedId}
          handleAddRecommended={handleAddRecommended}
        />
      </div>
    </div>
  );
}