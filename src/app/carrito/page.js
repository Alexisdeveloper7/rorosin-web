"use client";

import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import ConfirmarPedidoModal from "@/components/ConfirmarPedidoModal";
import ModalLogin from "@/components/ModalLogin";
import ModalSignup from "@/components/ModalSignup";

export default function CarritoPage() {
  const {
    items,
    loading: loadingCarrito,
    actualizarItem,
    eliminarItem,
    confirmarPedido,
    fetchCarrito,
    fetchPedidos,
  } = useCarrito();

  const {
    user,
    loading: loadingUser,
    openLoginModal,
    openSignupModal,
    loginModalOpen,
    signupModalOpen,
    closeLoginModal,
    closeSignupModal
  } = useUser();

  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]); // ids en actualización
  const [cantidadesTemp, setCantidadesTemp] = useState({}); // cantidad editable

  const handleActualizar = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 0) nuevaCantidad = 0;
    setLoadingIds(prev => [...prev, id]);
    try {
      if (nuevaCantidad === 0) {
        await eliminarItem(id);
      } else {
        await actualizarItem(id, nuevaCantidad);
      }
      await fetchCarrito();
      setCantidadesTemp(prev => ({ ...prev, [id]: nuevaCantidad }));
    } catch (err) {
      console.error("Error actualizar carrito:", err);
    } finally {
      setLoadingIds(prev => prev.filter(lid => lid !== id));
    }
  };

  const handleConfirmarPedido = async () => {
    try {
      const exito = await confirmarPedido();
      if (!exito) return false;
      await fetchPedidos();
      await fetchCarrito();
      setModalOpen(false);
      return true;
    } catch (error) {
      console.error("Error confirmar pedido:", error);
      return false;
    }
  };

  // ======== TÍTULO SIEMPRE VISIBLE ========
  return (
    <>
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-4 mt-4">
        Tu Carrito
      </h1>

      {/* ======== LOADING SKELETON ======== */}
      {(loadingUser || loadingCarrito) && (
        <div className="max-w-md mx-auto p-4 space-y-4">
          <p className="text-center text-gray-400 animate-pulse">Cargando...</p>

          {/* Una sola card skeleton */}
          <div className="flex flex-col gap-3 p-4 border rounded-xl animate-pulse">
            <div className="w-full h-60 bg-gray-200 rounded-xl"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="ml-auto w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      )}

      {/* ======== USUARIO NO LOGUEADO ======== */}
      {!loadingUser && !user && (
        <div className="max-w-md mx-auto p-4 text-center space-y-4">
          <p className="text-gray-600">Debes iniciar sesión para ver tu carrito.</p>
          <button
            onClick={openLoginModal}
            className="bg-blue-600 text-white mr-4 py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Iniciar sesión
          </button>
          <button
            onClick={openSignupModal}
            className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition cursor-pointer"
          >
            Crear cuenta
          </button>
        </div>
      )}

      {/* ======== CARRITO VACÍO ======== */}
      {!loadingCarrito && user && items.length === 0 && (
        <div className="max-w-md mx-auto p-4 text-center space-y-4">
          <p className="text-gray-600">Tu carrito está vacío.</p>
          <button
            onClick={() => router.push("/tienda")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Ir a tienda
          </button>
          <button
            onClick={() => router.push("/pedidos")}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition cursor-pointer"
          >
            Ver pedidos realizados
          </button>
        </div>
      )}

      {/* ======== CARRITO CON ITEMS ======== */}
      {!loadingCarrito && user && items.length > 0 && (
        <div className="max-w-md mx-auto p-4 space-y-4">
          {items.map((item) => {
            const isLoading = loadingIds.includes(item.id_item);
            const cantidadValor = cantidadesTemp[item.id_item] ?? item.cantidad;

            return (
              <div
                key={item.id_item}
                className="flex flex-col gap-3 p-4 border rounded-xl"
              >
                <img
                  src={item.imagen_url || "/placeholder.png"}
                  alt={item.producto_nombre}
                  className="w-full h-60 object-contain rounded-xl border bg-gray-50"
                />

                <p className="font-semibold text-lg">{item.producto_nombre}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleActualizar(
                        item.id_item,
                        cantidadValor === 1 ? 0 : cantidadValor - 1
                      )
                    }
                    disabled={isLoading}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 transition ${
                      isLoading ? "cursor-wait opacity-60" : "cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    {cantidadValor === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={cantidadValor}
                    onChange={(e) =>
                      setCantidadesTemp(prev => ({ ...prev, [item.id_item]: parseInt(e.target.value) || 1 }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleActualizar(item.id_item, cantidadValor);
                      }
                    }}
                    className="w-16 h-8 text-center border border-gray-300 rounded-lg outline-none"
                    disabled={isLoading}
                  />

                  <button
                    onClick={() =>
                      handleActualizar(item.id_item, cantidadValor + 1)
                    }
                    disabled={isLoading}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 transition ${
                      isLoading ? "cursor-wait opacity-60" : "cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    <Plus size={18} />
                  </button>

                  {isLoading && (
                    <div className="w-5 h-5 ml-2 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                  )}

                  <button
                    onClick={() => handleActualizar(item.id_item, 0)}
                    className="ml-auto text-red-500 text-sm hover:underline cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}

          <div className="h-px bg-gray-200 my-4"></div>

          <div className="space-y-2">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Confirmar Pedido
            </button>

            <button
              onClick={() => router.push("/tienda")}
              className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition cursor-pointer"
            >
              Ir a tienda
            </button>

            <button
              onClick={() => router.push("/pedidos")}
              className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition cursor-pointer"
            >
              Ver pedidos realizados
            </button>
          </div>
        </div>
      )}

      {/* MODALES */}
      <ConfirmarPedidoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmarPedido}
      />
      <ModalLogin isOpen={loginModalOpen} onClose={closeLoginModal} />
      <ModalSignup
        isOpen={signupModalOpen}
        onClose={closeSignupModal}
        onOpenLogin={openLoginModal}
      />
    </>
  );
}