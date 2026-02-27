"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useCarrito } from "@/context/CarritoContext";
import { motion, AnimatePresence } from "framer-motion";

import PanelCategorias from "../../components/PanelCategorias";
import ModalProducto from "../../components/ModalProducto";
import { ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TiendaPage() {
  const [categorias, setCategorias] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();
  const { addItem } = useCarrito();
  const router = useRouter();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [producto, setProducto] = useState(null);
  const [panelAbierto, setPanelAbierto] = useState(null);
  const [filtro, setFiltro] = useState(null);
  const [orden, setOrden] = useState("predeterminado");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/productos", { cache: "no-store" });
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();
  }, []);

  const abrirModal = (p) => {
    setProducto(p);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setProducto(null);
    setModalAbierto(false);
  };

  const manejarFiltro = (tipo, valor) => {
    if (!tipo && !valor) setFiltro(null);
    else setFiltro({ tipo, valor });
    setPanelAbierto(null);
  };

  const categoriasFiltradas = (() => {
    if (!filtro) return categorias;

    if (filtro.tipo === "categoria") {
      return categorias.map((cat) => ({
        ...cat,
        subcategorias: cat.subcategorias.map((sub) => ({ ...sub })),
      }));
    }

    if (filtro.tipo === "subcategoria") {
      return categorias
        .map((cat) => ({
          ...cat,
          subcategorias: cat.subcategorias
            .map((sub) =>
              sub.nombre === filtro.valor
                ? { ...sub }
                : { ...sub, productos: [] }
            )
            .filter((sub) => sub.productos.length > 0),
        }))
        .filter((cat) => cat.subcategorias.length > 0);
    }

    return categorias;
  })();

  const todosProductos = categoriasFiltradas.flatMap((cat) =>
    cat.subcategorias.flatMap((sub) => sub.productos || [])
  );

  const productosOrdenados = (() => {
    if (orden === "reciente")
      return todosProductos.slice().sort((a, b) => b.id - a.id);
    if (orden === "antiguo")
      return todosProductos.slice().sort((a, b) => a.id - b.id);
    return todosProductos;
  })();

  return (
    <div className="flex-1 flex flex-col bg-white w-full">
      <h1 className="text-4xl text-center text-[#042F80] font-bold mt-4 mb-4">
        Catálogo de Productos
      </h1>

      {loadingProductos && (
        <div className="max-w-md mx-auto p-4 space-y-2">
          <p className="text-center text-gray-600 font-semibold animate-pulse">
            Cargando productos...
          </p>
          {/* Skeleton de 1 card */}
          <div className="flex justify-center">
            <div className="w-full max-w-[300px] bg-white border border-gray-300 rounded-3xl overflow-hidden animate-pulse">
              <div className="w-full aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-full" />
                <div className="h-6 bg-gray-300 rounded w-full mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && !loadingProductos && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600 font-bold">{error}</p>
        </div>
      )}

      {!loadingProductos && !error && (
        <>
          <div className="flex justify-between items-center mx-2 md:mx-25 m-3">
            <button
              onClick={() =>
                setPanelAbierto(panelAbierto === "categorias" ? null : "categorias")
              }
              className="text-md bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              Categorías
            </button>

            <div className="relative inline-block">
              <button
                onClick={() =>
                  setPanelAbierto(panelAbierto === "ordenar" ? null : "ordenar")
                }
                className="px-3 py-2 text-sm rounded-lg bg-green-700 text-white font-semibold flex items-center justify-between w-36 shadow transition-all duration-300 hover:scale-105 hover:bg-green-800"
              >
                Ordenar <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {panelAbierto === "ordenar" && (
                <ul className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-lg z-10">
                  {[
                    { value: "predeterminado", label: "Orden predeterminado" },
                    { value: "reciente", label: "Del más reciente al más antiguo" },
                    { value: "antiguo", label: "Del más antiguo al más reciente" },
                  ].map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => {
                        setOrden(opt.value);
                        setPanelAbierto(null);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-green-100 transition-colors duration-300 ${
                        orden === opt.value ? "bg-green-200 font-semibold" : ""
                      }`}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* GRID ANIMADO */}
          <motion.div
            layout
            className="flex-1 grid grid-cols-2 gap-4 w-full p-3 items-start justify-items-center"
          >
            <AnimatePresence>
              {productosOrdenados.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="m-1 bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-3xl flex flex-col items-center w-full max-w-[300px]"
                >
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-3xl">
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    )}
                  </div>

                  <div className="w-full bg-gray-800 p-2 flex flex-col items-center justify-between rounded-b-3xl text-center text-white">
                    <h4 className="text-xs sm:text-sm font-semibold">
                      {prod.nombre}
                    </h4>
                    <p className="text-[10px] sm:text-xs mt-1">
                      {prod.descripcion}
                    </p>
                    <button
                      onClick={() => abrirModal(prod)}
                      className="mt-2 w-full text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg transition-colors duration-300"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      <PanelCategorias
        isOpen={panelAbierto === "categorias"}
        onCerrar={() => setPanelAbierto(null)}
        onFiltrar={manejarFiltro}
      />

      {modalAbierto && producto && (
        <ModalProducto producto={producto} onCerrar={cerrarModal} />
      )}
    </div>
  );
}