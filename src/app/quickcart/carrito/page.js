"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

import ConfirmarPedidoModal from "@/components/ConfirmarPedidoModal";
import ModalLogin from "@/components/ModalLogin";
import ModalSignup from "@/components/ModalSignup";
import ProductosRecomendados from "@/components/ProductosRecomendados";
import ResumenTotal from "@/components/ResumenTotal";
import ListaCarrito from "@/components/ListaCarrito";

export default function CarritoPage() {
  const router = useRouter();

  const {
    items,
    actualizarItem,
    eliminarItem,
    confirmarPedido,
    addItem,
    loading: loadingItems,
  } = useCarrito();

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

  const [modalOpen, setModalOpen] = useState(false);

  const [localItems, setLocalItems] = useState([]);

  const [productos, setProductos] = useState([]);

  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    setLocalItems(items || []);
  }, [items]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/productos", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("API error");
        }

        const data = await res.json();

        const normalized = data.map((p) => ({
          id: p.id,
          producto_nombre: p.nombre,
          precio_unitario: Number(p.precio) || 0,
          imagen_url: p.imagen,
          categoria: p.categoria,
        }));

        setProductos(normalized);
      } catch (err) {
        console.error(err);
        setProductos([]);
      }
    };

    fetchProducts();
  }, []);

  const isEmpty = localItems.length === 0;

  const total = useMemo(() => {
    return localItems.reduce((acc, item) => {
      const price = Number(item.precio_unitario) || 0;

      return acc + price * (item.cantidad || 0);
    }, 0);
  }, [localItems]);

  const mainCategory = useMemo(() => {
    if (!localItems.length) return null;

    const count = {};

    localItems.forEach((item) => {
      const cat = item.categoria || "otros";

      count[cat] = (count[cat] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  }, [localItems]);

  const relatedProducts = useMemo(() => {
    if (!productos.length) return [];

    const cartIds = new Set(
      localItems.map((i) => i.id_item)
    );

    const sameCategory = productos.filter(
      (p) =>
        p.categoria === mainCategory &&
        !cartIds.has(p.id)
    );

    const others = productos.filter(
      (p) =>
        p.categoria !== mainCategory &&
        !cartIds.has(p.id)
    );

    const shuffle = (arr) =>
      [...arr].sort(() => Math.random() - 0.5);

    let result = [
      ...sameCategory.slice(0, 3),
      ...shuffle(others),
    ];

    const unique = [];
    const seen = new Set();

    for (const p of result) {
      if (!seen.has(p.id)) {
        unique.push(p);
        seen.add(p.id);
      }
    }

    return unique.slice(0, 5);
  }, [productos, localItems, mainCategory]);

  const handleAddRecommended = async (item) => {
    const id = item.id;

    if (!user) return;

    try {
      setAddingId(id);

      const existe = localItems.find((i) => i.id_item === id);

      if (existe) {
        setLocalItems((prev) =>
          prev.map((i) =>
            i.id_item === id
              ? { ...i, cantidad: (i.cantidad || 0) + 1 }
              : i
          )
        );
      } else {
        setLocalItems((prev) => [
          {
            id_item: item.id,
            producto_nombre: item.producto_nombre,
            precio_unitario: item.precio_unitario,
            imagen_url: item.imagen_url,
            categoria: item.categoria,
            cantidad: 1,
          },
          ...prev,
        ]);
      }

      const ok = await addItem(id, null, 1);

      if (!ok) {
        setLocalItems(items || []);
        setAddingId(null);
        return;
      }

      setAddingId(null);

      setAddedId(id);

      showToast(
        "Agregado al carrito 🛒",
        "success"
      );

      setTimeout(() => {
        setAddedId(null);
      }, 1400);
    } catch (err) {
      setLocalItems(items || []);
      setAddingId(null);
    }
  };

  const handleUpdate = async (id, qty) => {
    if (qty < 1) {
      return handleDelete(id);
    }

    setLocalItems((prev) =>
      prev.map((i) =>
        i.id_item === id
          ? { ...i, cantidad: qty }
          : i
      )
    );

    await actualizarItem(id, qty);
  };

  const handleDelete = async (id) => {
    setLocalItems((prev) =>
      prev.filter((i) => i.id_item !== id)
    );

    await eliminarItem(id);
  };

  const loadingListaCarrito = loadingItems && localItems.length === 0;

  if (loadingUser || loadingListaCarrito) {
    return (
      <div className="w-full px-4 py-6 animate-pulse">
        <h1 className="text-4xl font-extrabold text-center text-gray-300 mb-6">
          Tu Carrito
        </h1>

        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          <div className="flex-1 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-xl" />

                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3" />

                  <div className="flex gap-3 pt-2">
                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-xl" />

                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-2/3" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/4" />

                  <div className="flex gap-3 pt-2">
                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                    <div className="h-9 bg-gray-200 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-[320px] flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded-lg w-20" />
                <div className="h-5 bg-gray-200 rounded-lg w-24" />
              </div>

              <div className="h-12 bg-gray-200 rounded-xl w-full" />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
              <div className="h-5 bg-gray-200 rounded-lg w-40" />

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-6 bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
          <div className="h-5 bg-gray-200 rounded-lg w-40" />

          <div className="flex gap-3">
            <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-lg w-full" />
              <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-lg w-full" />
              <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full px-4 py-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
          Tu Carrito
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.3 5.2A1 1 0 006.7 19h10.6a1 1 0 001-.8L19 13M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            Inicia sesión para ver tu carrito
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Necesitas una cuenta para guardar productos y continuar con tu compra.
          </p>

          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            <button
              onClick={openLoginModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Iniciar sesión
            </button>

            <button
              onClick={openSignupModal}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Crear cuenta
            </button>
          </div>
        </div>

        <ModalLogin
          isOpen={loginModalOpen}
          onClose={closeLoginModal}
        />

        <ModalSignup
          isOpen={signupModalOpen}
          onClose={closeSignupModal}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
        Tu Carrito
      </h1>

      {user && (
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {/* TOTAL ARRIBA MOBILE */}
          {!isEmpty && (
            <div className="md:hidden">
              <ResumenTotal
                total={total}
                onConfirm={() => setModalOpen(true)}
              />
            </div>
          )}

          {/* CARRITO */}
          <div className="flex-1">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.3 5.2A1 1 0 006.7 19h10.6a1 1 0 001-.8L19 13M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-700">
                  Tu carrito está vacío
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Agrega productos para comenzar
                  tu pedido.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
                  <button
                    onClick={() =>
                      router.push("/quickcart/tienda")
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
                  >
                    Ir a tienda
                  </button>

                  <button
                    onClick={() =>
                      router.push("/quickcart/pedidos")
                    }
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition"
                  >
                    Ver pedidos
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5">
                <ListaCarrito
                  items={localItems}
                  loading={loadingListaCarrito}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </div>

          {/* SIDEBAR PC */}
          <div className="hidden md:flex w-[320px] flex-col gap-4">
            {!isEmpty && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    Total
                  </span>

                  <span className="text-blue-600 font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl"
                >
                  Confirmar Pedido
                </button>
              </div>
            )}

            <ProductosRecomendados
              relatedProducts={relatedProducts}
              addingId={addingId}
              addedId={addedId}
              handleAddRecommended={handleAddRecommended}
            />
          </div>
        </div>
      )}

      {/* RECOMENDADOS MOBILE */}
      {user && (
        <ProductosRecomendados
          mobile
          relatedProducts={relatedProducts}
          addingId={addingId}
          addedId={addedId}
          handleAddRecommended={handleAddRecommended}
        />
      )}

      <ConfirmarPedidoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarPedido}
      />

      <ModalLogin
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
      />

      <ModalSignup
        isOpen={signupModalOpen}
        onClose={closeSignupModal}
      />
    </div>
  );
}