"use client";

import { useEffect, useState, useRef } from "react";

export default function ProductosRecomendados({
  relatedProducts,
  addingId,
  addedId,
  handleAddRecommended,
  mobile = false,
}) {
  const [localProducts, setLocalProducts] = useState([]);
  const freezeRef = useRef(false);
  const timeoutRef = useRef(null);
  const latestProductsRef = useRef([]);

  // ===============================
  // CONTROL DE PRODUCTOS (FREEZE SAFE)
  // ===============================
  useEffect(() => {
    latestProductsRef.current = relatedProducts;

    if (freezeRef.current) return;

    setLocalProducts(relatedProducts);
  }, [relatedProducts]);

  // ===============================
  // CLICK HANDLER
  // ===============================
  const handleClick = async (item) => {
    if (freezeRef.current) return;

    freezeRef.current = true;

    // actualiza UI inmediatamente
    await handleAddRecommended(item);

    // espera animación verde
    timeoutRef.current = setTimeout(() => {
      freezeRef.current = false;

      // actualiza la lista completa con los nuevos recomendados
      setLocalProducts(latestProductsRef.current);
    }, 1200);
  };

  // cleanup por seguridad
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={mobile ? "max-w-6xl mx-auto mt-6 px-2 md:hidden" : ""}>
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">

        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-800">
            Productos recomendados
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Agrega productos que podrían interesarte
          </p>
        </div>

        <div className="flex flex-col gap-3">

          {localProducts.map((item, idx) => {
            const price = Number(item.precio_unitario) || 0;

            const isAdding = addingId === item.id;
            const isAdded = addedId === item.id;

            return (
              <div
                key={item.id || idx}
                className="flex items-center justify-between gap-2 border border-gray-100 rounded-xl p-2"
              >
                <div className="flex items-center gap-2 min-w-0">

                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={item.imagen_url || "/placeholder.png"}
                      className="w-9 h-9 object-contain"
                      alt={item.producto_nombre}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.producto_nombre}
                    </p>

                    <p className="text-[11px] text-blue-600 font-bold mt-1">
                      ${price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleClick(item)}
                  disabled={isAdding || isAdded || freezeRef.current}
                  className={`text-[11px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : isAdding
                      ? "bg-gray-400 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {isAdding
                    ? "Añadiendo..."
                    : isAdded
                    ? "✓ Agregado"
                    : "Añadir"}
                </button>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}