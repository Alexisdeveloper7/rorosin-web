"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useCarrito } from "@/context/CarritoContext";

import PanelCategorias from "../../components/PanelCategorias";
import ModalProducto from "../../components/ModalProducto";
import { ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TiendaPage() {
  // -------------------- STATE --------------------
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

  // -------------------- FETCH CLIENT --------------------
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/productos", {
          cache: "no-store",
        });

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

  // -------------------- FILTRADO --------------------
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

  // -------------------- LOADING / ERROR --------------------
  if (loadingProductos) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  // -------------------- RENDER --------------------
  return (
    <div className="flex-1 flex flex-col bg-white w-full">
      <h1 className="text-4xl text-center text-[#042F80] font-bold mt-4 mb-4">
        Catálogo de Productos
      </h1>

      {/* PANEL SUPERIOR */}
      <div className="flex justify-between items-center mx-2 md:mx-25 m-3">
        <button
          onClick={() =>
            setPanelAbierto(panelAbierto === "categorias" ? null : "categorias")
          }
          className="text-md bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
        >
          Categorías
        </button>

        <div className="relative inline-block">
          <button
            onClick={() =>
              setPanelAbierto(panelAbierto === "ordenar" ? null : "ordenar")
            }
            className="px-3 py-2 text-sm rounded-lg bg-green-700 text-white font-semibold flex items-center justify-between w-36 shadow hover:bg-green-900 transition cursor-pointer"
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
                  className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${
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

      {/* PRODUCTOS */}
      <div className="flex-1 bg-white grid grid-cols-2 gap-4 w-full p-3 items-start justify-items-center">
        {productosOrdenados.map((prod) => (
          <div
            key={prod.id}
            className="m-1 bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center w-full max-w-[300px]"
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
              <h4 className="text-xs sm:text-sm font-semibold text-gray-100">
                {prod.nombre}
              </h4>
              <p className="text-[10px] sm:text-xs text-gray-50 mt-1">
                {prod.descripcion}
              </p>
              <button
                onClick={() => abrirModal(prod)}
                className="mt-2 w-full text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg transition cursor-pointer"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

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