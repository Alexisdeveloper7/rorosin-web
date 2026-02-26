"use client";

import { useState, useRef, useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { useUser } from "@/context/UserContext";

export default function ModalProducto({ producto, onCerrar }) {
  const { user } = useUser();
  const { addItem } = useCarrito();

  const [variacionSeleccionada, setVariacionSeleccionada] = useState(
    producto.variaciones[0]
  );
  const [cantidad, setCantidad] = useState(1);
  const [mensajeExito, setMensajeExito] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // cerrar dropdown al clickear fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const incrementar = () => setCantidad((prev) => prev + 1);
  const decrementar = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const handleCantidadKey = (e) => {
    if (e.key === "Enter") {
      let valor = parseInt(e.target.value);
      if (isNaN(valor) || valor < 1) valor = 1;
      setCantidad(valor);
    }
  };

  const handleAgregar = async () => {
    if (!user) {
      setMensajeExito("Para agregar un producto al carrito debes iniciar sesión ❌");
      return;
    }

    const exito = await addItem(producto.id, variacionSeleccionada.id, cantidad);
    if (exito) {
      setMensajeExito("Producto agregado correctamente ✅");
      setTimeout(() => onCerrar(), 1500);
    } else {
      setMensajeExito("No se pudo agregar el producto ❌");
    }
  };

  const handleVariacionClick = (v) => {
    setVariacionSeleccionada(v);
    setDropdownOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        className="bg-white rounded-md p-4 w-11/12 max-w-xs text-center shadow-lg relative flex flex-col max-h-[90vh]"
      >
        {/* Botón X cerrar grande y rojo */}
        <button
          onClick={onCerrar}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white text-xl font-bold cursor-pointer"
          title="Cerrar"
        >
          ×
        </button>

        {/* Imagen */}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-auto rounded-md mb-2"
        />

        {/* Título */}
        <h2 className="text-base font-semibold mb-2">{producto.nombre}</h2>

        {/* Descripción */}
        <p className="text-xs text-gray-600 mb-2">{producto.descripcion}</p>

        {/* Dropdown de variaciones */}
        <div className="mb-2 relative text-left" ref={dropdownRef}>
          <div
            className="border rounded p-1 text-xs cursor-pointer bg-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Selecciona una variación: <strong>{variacionSeleccionada.nombre}</strong>
          </div>
          {dropdownOpen && (
            <div className="absolute w-full border rounded mt-1 max-h-32 overflow-y-auto bg-white z-10 shadow-md">
              <div className="sticky top-0 bg-white font-medium text-xs p-1 border-b">
                Variaciones
              </div>
              {producto.variaciones.map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleVariacionClick(v)}
                  className="text-xs p-1 hover:bg-gray-100 cursor-pointer"
                >
                  {v.nombre}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medidas */}
        <div className="mb-2 text-left text-xs">
          {Object.entries(variacionSeleccionada.medidas).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </div>

        {/* Cantidad */}
        <div className="flex items-center justify-center gap-2 mb-2 text-xs">
          <button
            onClick={decrementar}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            onKeyDown={handleCantidadKey}
            className="w-12 text-center border rounded p-1 text-xs"
          />
          <button
            onClick={incrementar}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Mensaje */}
        {mensajeExito && (
          <p
            className={`text-xs mb-2 font-semibold ${
              mensajeExito.includes("correctamente") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensajeExito}
          </p>
        )}

        {/* Botones */}
        <div className="flex justify-center gap-2 mt-auto">
          <button
            onClick={onCerrar}
            className="px-3 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400 cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={handleAgregar}
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 cursor-pointer"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}