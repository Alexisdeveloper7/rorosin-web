"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import { useUser } from "@/context/UserContext";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { user } = useUser();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  const addingRef = useRef(false);
  const [adding, setAdding] = useState(false);

  const hasLoadedRef = useRef(false);

  /* ===============================
     FETCH CARRITO
  =============================== */
  const fetchCarrito = useCallback(
    async (force = false) => {
      if (!user) {
        setItems([]);
        setLoading(false);
        return [];
      }

      if (!hasLoadedRef.current || force) {
        setLoading(true);
      }

      try {
        const res = await fetch("/api/carrito/listar", {
          credentials: "include",
        });

        const data = await res.json();

        const lista = data.success ? data.items || [] : [];

        const normalized = lista.map((item) => ({
          id_item: item.id_item,
          producto_id: item.id_producto,
          producto_nombre: item.producto_nombre,
          cantidad: Number(item.cantidad || 0),
          precio_unitario: Number(item.precio_unitario || 0),

          // FRONT: siempre trabajas con imagen_url
          imagen_url: item.imagen_url || "/placeholder.png",

          categoria: item.categoria || "otros",
        }));

        setItems(normalized);
        hasLoadedRef.current = true;

        return normalized;
      } catch (error) {
        console.error("Error cargando carrito:", error);
        setItems([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /* ===============================
     FETCH PEDIDOS
  =============================== */
  const fetchPedidos = useCallback(async () => {
    if (!user) {
      setPedidos([]);
      return [];
    }

    setLoadingPedidos(true);

    try {
      const res = await fetch(
        `/api/pedidos/usuario?usuarioId=${user.id}`,
        { credentials: "include" }
      );

      const data = await res.json();

      setPedidos(data.success ? data.pedidos || [] : []);

      return data.pedidos || [];
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setPedidos([]);
      return [];
    } finally {
      setLoadingPedidos(false);
    }
  }, [user]);

  /* ===============================
     INIT
  =============================== */
  useEffect(() => {
    if (!user) {
      setItems([]);
      setPedidos([]);
      setLoading(false);
      setLoadingPedidos(false);
      hasLoadedRef.current = false;
      return;
    }

    fetchCarrito(true);
    fetchPedidos();
  }, [user, fetchCarrito, fetchPedidos]);

  /* ===============================
     ADD ITEM
  =============================== */
  const addItem = async (productoId, variacionId, cantidad = 1) => {
    if (addingRef.current || adding) return false;

    addingRef.current = true;
    setAdding(true);

    try {
      const res = await fetch("/api/carrito/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productoId,
          variacionId,
          cantidad,
        }),
      });

      const data = await res.json();

      if (!data.success) return false;

      await fetchCarrito(true);

      return true;
    } catch (error) {
      console.error("Error agregar item:", error);
      return false;
    } finally {
      addingRef.current = false;
      setAdding(false);
    }
  };

  /* ===============================
     UPDATE ITEM
  =============================== */
  const actualizarItem = async (idItem, cantidad) => {
    if (cantidad < 1) return false;

    setItems((prev) =>
      prev.map((i) =>
        i.id_item === idItem ? { ...i, cantidad: Number(cantidad) } : i
      )
    );

    try {
      const res = await fetch("/api/carrito/actualizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idItem,
          cantidad,
        }),
      });

      const data = await res.json();

      return data.success;
    } catch (error) {
      console.error("Error actualizar item:", error);
      return false;
    }
  };

  /* ===============================
     DELETE ITEM
  =============================== */
  const eliminarItem = async (idItem) => {
    setItems((prev) => prev.filter((i) => i.id_item !== idItem));

    try {
      const res = await fetch("/api/carrito/eliminar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idItem }),
      });

      const data = await res.json();

      if (!data.success) {
        await fetchCarrito(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error eliminar item:", error);
      await fetchCarrito(true);
      return false;
    }
  };

  /* ===============================
     CONFIRMAR PEDIDO (FIX FINAL)
  =============================== */
  const confirmarPedido = async () => {
    if (!user || items.length === 0) {
      return {
        success: false,
        message: "Carrito vacío o usuario no logueado",
      };
    }

    try {
      const itemsFormateados = items.map((item) => ({
        id_producto: item.producto_id,
        nombre_producto: item.producto_nombre,
        cantidad: Number(item.cantidad || 0),
        precio: Number(item.precio_unitario || 0),

        // FIX: backend espera imagen
        imagen: item.imagen_url,
      }));

      const res = await fetch("/api/pedidos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: itemsFormateados,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Error al confirmar pedido",
        };
      }

      setItems([]);
      await fetchPedidos();

      return {
        success: true,
        message: data.message || "Pedido realizado correctamente",
      };
    } catch (error) {
      console.error("Error confirmar pedido:", error);

      return {
        success: false,
        message: "Error inesperado al confirmar pedido",
      };
    }
  };

  const vaciarCarrito = () => {
    setItems([]);
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

        adding,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }

  return context;
}