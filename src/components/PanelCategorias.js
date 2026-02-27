"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PanelCategorias({ isOpen, onCerrar, onFiltrar }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);
  const [seleccionActual, setSeleccionActual] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/productos", { cache: "no-store" });
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  const toggleCategoria = (id) => {
    setCategoriaAbierta((prev) => (prev === id ? null : id));
  };

  const manejarClickSubcategoria = (nombre) => {
    setSeleccionActual(nombre);
    onFiltrar("subcategoria", nombre);
    onCerrar();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex justify-start items-start"
          onClick={onCerrar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-80 h-full bg-white p-4 shadow-lg rounded-r-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Categorías
            </h2>

            {/* Mensaje destacado */}
            <div className="mb-4 px-3 text-lg py-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700 font-medium rounded shadow-sm">
              Selecciona una categoria   &#x2193;
            </div>

            {categorias.length === 0 ? (
              <p className="text-gray-500 text-sm">Cargando...</p>
            ) : (
              categorias.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <button
                    onClick={() => toggleCategoria(cat.id)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                  >
                    <span className="text-sm">{cat.nombre}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        categoriaAbierta === cat.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {categoriaAbierta === cat.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 mt-2"
                      >
                        {cat.subcategorias.map((sub) => (
                          <p
                            key={sub.id}
                            onClick={() => manejarClickSubcategoria(sub.nombre)}
                            className={`cursor-pointer text-sm py-1 border-b border-gray-200 rounded transition ${
                              seleccionActual === sub.nombre
                                ? "bg-green-100 text-green-700 font-semibold"
                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                            }`}
                          >
                            {sub.nombre}
                          </p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}

            <button
              onClick={onCerrar}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm w-full hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}