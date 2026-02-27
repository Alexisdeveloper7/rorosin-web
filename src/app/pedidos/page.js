"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useCarrito } from "@/context/CarritoContext";
import { useRouter } from "next/navigation";

export default function PedidosPage() {
  const { user, loading: loadingUsuario, openLoginModal, openSignupModal } = useUser();
  const { pedidos, fetchPedidos } = useCarrito();
  const router = useRouter();

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!loadingUsuario) {
        if (user) await fetchPedidos(true);
        setCargando(false);
      }
    };
    cargar();
  }, [user, loadingUsuario, fetchPedidos]);

  // Función para mostrar fecha/hora correcta en Guadalajara
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString("es-MX", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "America/Mexico_City",
    });
  };

  // =========================
  // Skeleton loading
  // =========================
  if (cargando || loadingUsuario) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 text-center">Mis pedidos</h1>
        <p className="text-center text-gray-500 mb-2">Cargando...</p>
        <div className="border rounded-lg p-4 animate-pulse bg-gray-100 space-y-2">
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded mb-3"></div>
          <div className="space-y-1">
            {[0,1,2].map(i => <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>)}
          </div>
          <div className="mt-4 h-10 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // =========================
  // Usuario no logeado
  // =========================
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Mis pedidos</h1>
        <p className="mb-4 text-gray-600">Debes iniciar sesión para ver tus pedidos realizados.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={openLoginModal}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Iniciar sesión
          </button>
          <button
            onClick={openSignupModal}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition cursor-pointer"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // Logeado pero sin pedidos
  // =========================
  if (pedidos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Mis pedidos</h1>
        <p className="mb-4 text-green-800 bg-green-50 p-4 border rounded-lg">
          Aún no tienes pedidos realizados. Agrega productos al carrito y confirma tu primer pedido.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push("/tienda")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Ir a tienda
          </button>
          <button
            onClick={() => router.push("/carrito")}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition cursor-pointer"
          >
            Ver carrito
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // Logeado con pedidos
  // =========================
  // Ordenar pedidos por fecha descendente (más reciente arriba)
  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">Mis pedidos</h1>
      {pedidosOrdenados.map((pedido, index) => (
        <div
          key={pedido.id}
          className="border rounded-xl p-5 shadow-md hover:shadow-lg transition bg-white"
        >
          <div className="mb-2">
            <p className="font-semibold text-lg">Pedido #{pedidos.length - index}</p>
            <p className="text-sm text-gray-500 mt-1">Fecha: {formatearFecha(pedido.fecha)}</p>
          </div>

          <div className="divide-y divide-gray-200">
            {pedido.items.map((item, idx) => (
              <div key={idx} className="py-2 flex justify-between items-center">
                <span className="font-medium">{item.nombre_producto}</span>
                <span className="ml-2 text-gray-600">x{item.cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <button
          className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition cursor-pointer"
          onClick={() => router.push("/tienda")}
        >
          Ir a tienda
        </button>
        <button
          className="flex-1 border border-blue-600 text-blue-600 py-3 rounded hover:bg-blue-50 transition cursor-pointer"
          onClick={() => router.push("/carrito")}
        >
          Ver carrito
        </button>
        <button
          className="flex-1 bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition cursor-pointer"
          onClick={() => router.push("/")}
        >
          Ir a inicio
        </button>
      </div>
    </div>
  );
}