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

  const convertirSingular = (texto) => {
    if (!texto) return "Sin categoría";

    const categoria = texto.trim();

    const categoriasEspeciales = {
      "Celulares": "Celular",
      "Audífonos": "Audífono",
      "Audífonos de diadema": "Audífono de diadema",
      "Headsets": "Audífono de diadema",
      "Laptops": "Laptop",
      "Computadoras": "Computadora",
      "Teclados": "Teclado",
      "Mouses": "Mouse",
      "Ratones": "Mouse",
      "Monitores": "Monitor",
      "Tablets": "Tablet",
      "Cámaras": "Cámara",
      "Bocinas": "Bocina",
      "Consolas": "Consola",
      "Accesorios": "Accesorio",
      "Relojes": "Reloj",
      "Impresoras": "Impresora",
    };

    if (categoriasEspeciales[categoria]) {
      return categoriasEspeciales[categoria];
    }

    if (categoria.endsWith("es")) {
      return categoria.slice(0, -2);
    }

    if (categoria.endsWith("s")) {
      return categoria.slice(0, -1);
    }

    return categoria;
  };

  const categoria = convertirSingular(
    prod.categoria_nombre ||
      prod.nombre_categoria ||
      prod.categoria ||
      prod.tipo_categoria
  );

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
        {/* CATEGORY */}
        <p className="mb-1 text-[10px] font-medium text-indigo-600 truncate">
          {categoria}
        </p>

        {/* TITLE */}
        <h4 className="text-[13px] font-semibold text-gray-950 line-clamp-2 min-h-[32px] leading-snug">
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