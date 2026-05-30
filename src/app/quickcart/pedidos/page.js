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
  const [localPedidos, setLocalPedidos] = useState([]);
  const [productos, setProductos] = useState([]);

  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  const [freezeRecomendados, setFreezeRecomendados] = useState(false);

  useEffect(() => {
    if (loadingUser) return;

    let mounted = true;

    const load = async () => {
      try {
        if (user) await fetchPedidos();
      } finally {
        if (mounted) setCargando(false);
      }
    };

    load();

    return () => (mounted = false);
  }, [user, loadingUser, fetchPedidos]);

  useEffect(() => {
    setLocalPedidos(pedidos || []);
  }, [pedidos]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/productos", {
          cache: "no-store",
        });

        const data = await res.json();

        setProductos(
          data.map((p) => ({
            id: p.id,
            producto_nombre: p.nombre,
            precio_unitario: Number(p.precio) || 0,
            imagen_url: p.imagen || "/placeholder.png",
          }))
        );
      } catch {
        setProductos([]);
      }
    };

    fetchProducts();
  }, []);

  const relatedProducts = useMemo(() => {
    if (!productos.length) return [];

    if (freezeRecomendados) return productos.slice(0, 5);

    return [...productos].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [productos, freezeRecomendados]);

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
    setFreezeRecomendados(true);

    showToast("Agregado al carrito 🛒", "success");

    setTimeout(() => {
      setAddedId(null);
      setFreezeRecomendados(false);
    }, 1200);
  } catch (error) {
    console.error("Error addItem pedidos:", error);
    setAddingId(null);
    showToast("Error al agregar al carrito", "error");
  }
};

  if (loadingUser || cargando || loadingPedidos) {
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

          <div className="flex gap-3 mt-6">
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
                Tus compras aparecerán aquí cuando realices tu primer pedido
              </p>

              <div className="flex gap-3 mt-4 flex-wrap justify-center">
                <button
                  onClick={() => router.push("/quickcart/carrito")}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm hover:opacity-90"
                >
                  Ver carrito completo
                </button>

                <button
                  onClick={() => router.push("/quickcart")}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm hover:opacity-90"
                >
                  Ver tienda completa
                </button>
              </div>
            </div>
          ) : (
            localPedidos.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-2xl overflow-hidden"
              >
                <div className="flex justify-between p-3 border-b">
                  <div>
                    <p className="text-[11px] text-gray-500">
                      Pedido realizado
                    </p>
                    <p className="text-[12px] font-medium">
                      {new Date(p.fecha).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-gray-500">Total</p>
                    <p className="text-blue-600 font-bold">${p.total}</p>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <button
                    onClick={() => cancelarPedido(p.id)}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Cancelar pedido
                  </button>

                  {p.items?.map((i, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 bg-gray-50 p-2 rounded-xl"
                    >
                      <img
                        src={i.imagen || "/placeholder.png"}
                        className="w-11 h-11 object-contain bg-white border rounded-lg"
                      />

                      <div>
                        <p className="text-[11px] font-medium truncate">
                          {i.nombre_producto}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          x{i.cantidad}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
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