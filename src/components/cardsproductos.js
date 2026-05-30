"use client";

import { motion } from "framer-motion";

export default function CardProducto({
  prod,
  abrirModal,
  agregarDirecto,
  loading,
  success,
}) {
  if (!prod) return null;

  const rating = prod?.rating > 0 ? prod.rating : null;
  const reviews = prod?.reviews > 0 ? prod.reviews : null;

  const isLoading = loading;
  const isSuccess = success;

  let buttonText = "Añadir al carrito";
  let buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white";
  let disabled = false;

  if (isLoading) {
    buttonText = "Agregando...";
    buttonStyle = "bg-gray-500 text-white cursor-wait";
    disabled = true;
  }

  if (isSuccess) {
    buttonText = "Agregado ✔";
    buttonStyle = "bg-green-600 text-white";
    disabled = true;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="
        bg-white w-full
        rounded-[18px]
        overflow-hidden
        border border-gray-200
        shadow-sm hover:shadow-md
        transition-all duration-300
        flex flex-col
      "
    >
      {/* IMAGE */}
      <div className="aspect-square bg-white flex items-center justify-center p-2 border-b border-gray-100 overflow-hidden">
        <img
          src={prod.imagen}
          alt={prod.nombre}
          className="w-full h-full object-contain transition-all duration-500 ease-out hover:scale-105"
        />
      </div>

      {/* INFO */}
      <div className="p-2 flex flex-col flex-1">

        {/* TITLE */}
        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 min-h-[28px]">
          {prod.nombre}
        </h4>

        {/* RATING */}
        {rating && (
          <div className="mt-1 flex items-center">
            <p className="text-[10px] text-yellow-500 font-semibold">
              ★ {rating}
            </p>

            {reviews && (
              <span className="text-[10px] text-gray-500 ml-1">
                ({reviews})
              </span>
            )}
          </div>
        )}

        {/* PRICE */}
        <div className="mt-2">
          <p className="text-base font-bold text-gray-900">
            ${prod.precio}
          </p>
          <p className="text-[10px] text-gray-500">MXN</p>
        </div>

        {/* BUTTONS */}
        <div className="mt-3 flex flex-col gap-1.5">

          {/* ADD TO CART */}
          <button
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              agregarDirecto(prod);
            }}
            className={`w-full text-xs font-medium py-1.5 rounded-xl transition-all duration-300 active:scale-[0.98] ${buttonStyle}`}
          >
            {buttonText}
          </button>

          {/* DETAILS */}
          <button
            onClick={() => abrirModal(prod)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-1.5 rounded-xl transition-all duration-300 active:scale-[0.98]"
          >
            Ver detalles
          </button>

        </div>
      </div>
    </motion.div>
  );
}