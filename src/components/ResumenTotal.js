"use client";

export default function ResumenTotal({
  total,
  onConfirm,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">

      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">
          Total
        </span>

        <span className="text-blue-600 font-bold">
          ${total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={onConfirm}
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        Confirmar Pedido
      </button>

    </div>
  );
}