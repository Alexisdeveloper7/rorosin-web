"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PanelCategorias({
  isOpen,
  onCerrar,
  onFiltrar,
  categoriaSeleccionada,
}) {
  const [categorias, setCategorias] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    if (categoriaSeleccionada) {
      setSeleccionada(Number(categoriaSeleccionada));
    } else {
      setSeleccionada(null);
    }
  }, [categoriaSeleccionada]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/productos", {
          cache: "no-store",
        });

        const data = await res.json();

        const map = new Map();

        data.forEach((p) => {
          if (!map.has(p.categoria_id)) {
            map.set(p.categoria_id, {
              id: p.categoria_id,
              nombre: p.categoria,
            });
          }
        });

        setCategorias([...map.values()]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategorias();
  }, []);

  // BLOQUEO DE SCROLL
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const seleccionarCategoria = (cat) => {
    setSeleccionada(cat.id);
    onFiltrar("categoria", cat.id, cat.nombre);
    onCerrar();
  };

  const verTodos = () => {
    setSeleccionada(null);
    onFiltrar(null, null, null);
    onCerrar();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          onClick={onCerrar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* OVERLAY (IGUAL A PANELRIGHT) */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* SIDEBAR */}
          <motion.div
            className="w-72 rounded-r-3xl h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl p-4 overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* HEADER */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Categorías
                </h2>
                <p className="text-xs text-gray-500">
                  Filtra productos rápidamente
                </p>
              </div>

              <button
                onClick={onCerrar}
                className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* GUIDED TEXT */}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500">
                Selecciona la categoría a filtrar
              </p>
            </div>

            {/* CATEGORÍAS */}
            <div className="space-y-2">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => seleccionarCategoria(cat)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border transition cursor-pointer relative ${
                    seleccionada === cat.id
                      ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold shadow-sm"
                      : "hover:bg-gray-100 border-gray-200 text-gray-800"
                  }`}
                >
                  {seleccionada === cat.id && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                  )}

                  {cat.nombre}
                </button>
              ))}
            </div>

            {/* VER TODOS */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <button
                onClick={verTodos}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition cursor-pointer font-medium ${
                  seleccionada === null
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "hover:bg-gray-100 border-gray-200 text-gray-800"
                }`}
              >
                Ver todos los productos
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}