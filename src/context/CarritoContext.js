"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { user } = useUser();

  // 🛒 CARRITO
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📦 PEDIDOS
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  /* ===============================
     🔄 FETCH CARRITO
  =============================== */
  const fetchCarrito = useCallback(async () => {
    try {
      const res = await fetch("/api/carrito/listar", { credentials: "include" });
      const data = await res.json();
      const lista = data.success ? data.items || [] : [];
      setItems(lista);
      return lista;
    } catch (error) {
      console.error("Error cargando carrito:", error);
      setItems([]);
      return [];
    }
  }, []);

  /* ===============================
     🔄 FETCH PEDIDOS
  =============================== */
  const fetchPedidos = useCallback(async () => {
    if (!user) {
      setPedidos([]);
      return [];
    }
    try {
      const res = await fetch(`/api/pedidos/usuario?usuarioId=${user.id}`, { credentials: "include" });
      const data = await res.json();
      const lista = data.success ? data.pedidos || [] : [];
      setPedidos(lista);
      return lista;
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setPedidos([]);
      return [];
    }
  }, [user]);

  /* ===============================
     🔥 EFECTO PRINCIPAL
  =============================== */
  useEffect(() => {
    if (!user) {
      setItems([]);
      setPedidos([]);
      setLoading(false);
      setLoadingPedidos(false);
      return;
    }

    const cargarDatos = async () => {
      setLoading(true);
      setLoadingPedidos(true);
      await fetchCarrito();
      await fetchPedidos();
      setLoading(false);
      setLoadingPedidos(false);
    };

    cargarDatos();
  }, [user]);

  /* ===============================
     🔔 SYNC ENTRE PESTAÑAS
  =============================== */
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "carrito_actualizado") fetchCarrito();
      if (e.key === "pedidos_actualizados") fetchPedidos();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchCarrito, fetchPedidos]);

  /* ===============================
     ➕ AGREGAR ITEM
  =============================== */
  const addItem = async (productoId, variacionId, cantidad = 1) => {
    try {
      const res = await fetch("/api/carrito/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productoId, variacionId, cantidad }),
      });
      const data = await res.json();
      if (!data.success) return false;

      await fetchCarrito();
      localStorage.setItem("carrito_actualizado", Date.now());
      return true;
    } catch (error) {
      console.error("Error agregar item:", error);
      return false;
    }
  };

  /* ===============================
     🔄 ACTUALIZAR ITEM
  =============================== */
  const actualizarItem = async (idItem, cantidad) => {
    if (cantidad < 1) return false;
    try {
      const res = await fetch("/api/carrito/actualizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idItem, cantidad }),
      });
      const data = await res.json();
      if (!data.success) return false;

      await fetchCarrito();
      localStorage.setItem("carrito_actualizado", Date.now());
      return true;
    } catch (error) {
      console.error("Error actualizar item:", error);
      return false;
    }
  };

  /* ===============================
     🗑 ELIMINAR ITEM
  =============================== */
  const eliminarItem = async (idItem) => {
    try {
      const res = await fetch("/api/carrito/eliminar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idItem }),
      });
      const data = await res.json();
      if (!data.success) return false;

      await fetchCarrito();
      localStorage.setItem("carrito_actualizado", Date.now());
      return true;
    } catch (error) {
      console.error("Error eliminar item:", error);
      return false;
    }
  };

  /* ===============================
     🧾 CONFIRMAR PEDIDO
     ✅ Devuelve { success, message }
  =============================== */
  const confirmarPedido = async () => {
    if (!user || items.length === 0) return { success: false, message: "Carrito vacío" };

    try {
      const itemsParaAPI = items.map((i) => ({
        id_producto: i.id_producto,
        nombre_producto: i.producto_nombre, // debe coincidir con tu backend
        cantidad: i.cantidad,
        precio: i.precio || 0,
      }));

      const res = await fetch("/api/pedidos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuarioId: user.id, items: itemsParaAPI }),
      });

      const data = await res.json();

      // 🔑 Solo revisar data.success, NO res.ok
      if (!data.success) return { success: false, message: data.message || "❌ No se pudo confirmar el pedido" };

      // Vaciar carrito y actualizar pedidos
      setItems([]);
      await fetchPedidos();
      localStorage.setItem("carrito_actualizado", Date.now());
      localStorage.setItem("pedidos_actualizados", Date.now());

      return { success: true, message: data.message || "✅ Pedido realizado correctamente" };
    } catch (error) {
      console.error("Error confirmando pedido:", error);
      return { success: false, message: error.message || "❌ Error inesperado al confirmar pedido" };
    }
  };

  const vaciarCarrito = () => {
    setItems([]);
    localStorage.setItem("carrito_actualizado", Date.now());
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        loading,
        fetchCarrito,
        addItem,
        actualizarItem,
        eliminarItem,
        vaciarCarrito,
        pedidos,
        loadingPedidos,
        fetchPedidos,
        confirmarPedido,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
}