"use client";

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import PanelCategorias from "../../../components/PanelCategorias";
import ModalProducto from "../../../components/ModalProducto";
import CardProducto from "../../../components/cardsproductos";
import CartAuthLogin from "../../../components/cartauthlogin";

import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

function TiendaContent() {
  const searchParams = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [error, setError] = useState(null);

  const [producto, setProducto] = useState(null);
  const [panelAbierto, setPanelAbierto] = useState(null);
  const [showAuthLogin, setShowAuthLogin] = useState(false);

  const [filtro, setFiltro] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  const { user, openLoginModal } = useUser();
  const { addItem } = useCarrito();
  const { showToast } = useToast();

  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const [orden, setOrden] = useState("none");
  const [ordenAbierto, setOrdenAbierto] = useState(false);
  const ordenRef = useRef(null);

  useEffect(() => {
    const categoria = searchParams.get("categoria");
    const nombre = searchParams.get("nombre");

    if (categoria) {
      setFiltro({
        tipo: "categoria",
        valor: Number(categoria),
        nombre: nombre || null,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ordenRef.current && !ordenRef.current.contains(e.target)) {
        setOrdenAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoadingProductos(true);

        const res = await fetch("/api/productos", { cache: "no-store" });

        if (!res.ok) throw new Error("Error al obtener productos");

        const data = await res.json();

        setProductos(
          data.map((p) => ({
            ...p,
            rating: (4 + Math.random()).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 10,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, orden]);

  const productosFiltrados = useMemo(() => {
    let lista = [...productos];

    if (filtro?.tipo === "categoria") {
      lista = lista.filter((p) => p.categoria_id === filtro.valor);
    }

    if (orden === "price_asc") {
      lista.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    }

    if (orden === "price_desc") {
      lista.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    }

    if (orden === "rating_desc") {
      lista.sort(
        (a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
      );
    }

    if (orden === "rating_asc") {
      lista.sort(
        (a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0)
      );
    }

    return lista;
  }, [productos, filtro, orden]);

  const tituloProductos = useMemo(() => {
    if (filtro?.tipo !== "categoria") {
      return "TODOS LOS PRODUCTOS";
    }

    const productoCategoria = productos.find(
      (p) => p.categoria_id === filtro.valor
    );

    return (
      filtro.nombre ||
      productoCategoria?.categoria_nombre ||
      productoCategoria?.nombre_categoria ||
      productoCategoria?.categoria ||
      "CATEGORÍA SELECCIONADA"
    ).toUpperCase();
  }, [productos, filtro]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(productosFiltrados.length / productosPorPagina)
  );

  const productosFinal =
    filtro?.tipo === "categoria"
      ? productosFiltrados
      : productosFiltrados.slice(
          (paginaActual - 1) * productosPorPagina,
          paginaActual * productosPorPagina
        );

  const handleAdd = async (p) => {
    const id = p.id ?? p.producto_id;

    if (!user) {
      setShowAuthLogin(true);
      return;
    }

    try {
      setAddingId(id);
      setSuccessId(null);

      const ok = await addItem(id, null, 1);

      setAddingId(null);
      if (!ok) return;

      setSuccessId(id);
      showToast("Agregado al carrito 🛒", "success");

      setTimeout(() => setSuccessId(null), 1200);
    } catch {
      setAddingId(null);
    }
  };

  const SkeletonCard = () => (
    <div className="w-[240px] bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-square bg-gray-200 w-full" />
      <div className="p-3 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-[85%]" />
        <div className="h-4 bg-gray-200 rounded w-[60%]" />
        <div className="h-3 bg-gray-200 rounded w-[40%]" />
        <div className="h-6 bg-gray-200 rounded w-[50%]" />
        <div className="h-10 bg-gray-200 rounded-2xl" />
        <div className="h-10 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );

  const SkeletonButton = ({ w = "w-32" }) => (
    <div className={`h-10 ${w} bg-gray-200 rounded-xl animate-pulse`} />
  );

  const SkeletonTitle = () => (
    <div className="flex justify-center mb-3">
      <div className="h-6 w-60 bg-gray-200 rounded animate-pulse" />
    </div>
  );

  const SkeletonPagination = () => (
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
        disabled={paginaActual === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {[...Array(totalPaginas)].map((_, i) => {
        const page = i + 1;

        return (
          <button
            key={i}
            onClick={() => setPaginaActual(page)}
            className={`w-10 h-10 rounded-xl border cursor-pointer ${
              paginaActual === page
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
        disabled={paginaActual === totalPaginas}
        className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="flex-1 pb-3 bg-[#eef1f4]">
      <div className="pt-6 pb-2">
        <h1 className="text-3xl xl:text-5xl text-center font-semibold text-gray-950 tracking-tight drop-shadow-sm">
          Catálogo de Productos
        </h1>
      </div>

      <div className="flex justify-center mb-4 px-3">
        <div className="w-full max-w-[1700px] flex justify-between">
          {loadingProductos ? (
            <SkeletonButton w="w-36" />
          ) : (
            <button
              className="bg-white px-4 py-2 rounded-xl border cursor-pointer"
              onClick={() =>
                setPanelAbierto((p) =>
                  p === "categorias" ? null : "categorias"
                )
              }
            >
              Categorías
            </button>
          )}

          {loadingProductos ? (
            <SkeletonButton w="w-28" />
          ) : (
            <div className="relative" ref={ordenRef}>
              <button
                onClick={() => setOrdenAbierto(!ordenAbierto)}
                className="bg-white px-4 py-2 rounded-xl border flex items-center gap-2 cursor-pointer hover:bg-gray-50"
              >
                Ordenar <ChevronDown className="w-4 h-4" />
              </button>

              {ordenAbierto && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="p-2 border-b">
                    <p className="text-xs text-gray-400 px-2 mb-1">GENERAL</p>

                    <button
                      onClick={() => {
                        setOrden("none");
                        setOrdenAbierto(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${
                        orden === "none"
                          ? "bg-red-500 text-white"
                          : "text-red-500 hover:bg-red-50"
                      }`}
                    >
                      Sin orden
                    </button>
                  </div>

                  <div className="p-2 border-b">
                    <p className="text-xs text-gray-400 px-2 mb-1">PRECIO</p>

                    <button
                      onClick={() => {
                        setOrden("price_asc");
                        setOrdenAbierto(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${
                        orden === "price_asc"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Menor a mayor
                    </button>

                    <button
                      onClick={() => {
                        setOrden("price_desc");
                        setOrdenAbierto(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${
                        orden === "price_desc"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Mayor a menor
                    </button>
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-2 mb-1">
                      VALORACIÓN
                    </p>

                    <button
                      onClick={() => {
                        setOrden("rating_desc");
                        setOrdenAbierto(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${
                        orden === "rating_desc"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Mejor valorados ⭐
                    </button>

                    <button
                      onClick={() => {
                        setOrden("rating_asc");
                        setOrdenAbierto(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${
                        orden === "rating_asc"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Menos valorados 📉
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loadingProductos ? (
        <SkeletonTitle />
      ) : (
        <div className="text-center mb-3">
          <h2 className="text-xl font-semibold text-slate-600 tracking-wide">
            {tituloProductos}
          </h2>
        </div>
      )}

      <div className="flex justify-center pb-3 px-4 ">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 justify-items-center">
          {loadingProductos
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : productosFinal.map((prod) => (
                <CardProducto
                  key={prod.id ?? prod.producto_id}
                  prod={prod}
                  abrirModal={setProducto}
                  agregarDirecto={handleAdd}
                  loading={addingId === (prod.id ?? prod.producto_id)}
                  success={successId === (prod.id ?? prod.producto_id)}
                />
              ))}
        </div>
      </div>

      {loadingProductos ? (
        <SkeletonPagination />
      ) : (
        filtro?.tipo !== "categoria" && <Pagination />
      )}

      <PanelCategorias
        isOpen={panelAbierto === "categorias"}
        onCerrar={() => setPanelAbierto(null)}
        onFiltrar={(tipo, valor, nombre) =>
          setFiltro(tipo && valor ? { tipo, valor, nombre } : null)
        }
        categoriaSeleccionada={filtro?.tipo === "categoria" ? filtro.valor : null}
      />

      <AnimatePresence>
        {producto && (
          <ModalProducto
            producto={producto}
            onCerrar={() => setProducto(null)}
            onRequireAuth={() => setShowAuthLogin(true)}
          />
        )}
      </AnimatePresence>

      <CartAuthLogin
        isOpen={showAuthLogin}
        onClose={() => setShowAuthLogin(false)}
        onLoginClick={() => {
          setShowAuthLogin(false);
          setTimeout(() => openLoginModal(), 120);
        }}
      />
    </div>
  );
}

export default function TiendaPage() {
  return (
    <Suspense fallback={null}>
      <TiendaContent />
    </Suspense>
  );
}