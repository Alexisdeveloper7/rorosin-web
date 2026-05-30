"use client";

import { Plus, Minus } from "lucide-react";

export default function ListaCarrito({
  items,
  loading,
  onUpdate,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const price =
          Number(item.precio_unitario) || 0;

        return (
          <div
            key={item.id_item}
            className="flex items-center gap-4 bg-white border rounded-2xl p-4"
          >
            <img
              src={
                item.imagen_url ||
                "/placeholder.png"
              }
              className="w-20 h-20 object-contain"
              alt={item.producto_nombre}
            />

            <div className="flex-1">
              <p className="font-semibold">
                {item.producto_nombre}
              </p>

              <p className="text-sm text-gray-500">
                ${price.toFixed(2)}
              </p>

              <p className="text-green-600 font-bold">
                $
                {(
                  price * item.cantidad
                ).toFixed(2)}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() =>
                    onUpdate(
                      item.id_item,
                      item.cantidad - 1
                    )
                  }
                >
                  <Minus size={16} />
                </button>

                <span>
                  {item.cantidad}
                </span>

                <button
                  onClick={() =>
                    onUpdate(
                      item.id_item,
                      item.cantidad + 1
                    )
                  }
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={() =>
                    onDelete(item.id_item)
                  }
                  className="text-red-500 text-sm ml-auto"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}