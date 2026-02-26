import React from "react";

// Función para verificar sesión en el servidor
async function getSession() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
      cache: "no-store",
      credentials: "include",
    });
    const data = await res.json();
    return data.success ? true : false;
  } catch (err) {
    console.error("Error fetching session:", err);
    return false;
  }
}

// Función para obtener datos de la BD en el servidor
async function getTables() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bdpanel`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error("Error fetching tables:", err);
    return {};
  }
}

export default async function BDPanelPage() {
  const loggedIn = await getSession();
  const tables = await getTables();

  const active = Object.keys(tables)[0] || "";
  const open = true; // estado inicial panel izquierdo

  return (
    <div className="pt-32 flex h-screen bg-gray-100 overflow-hidden relative">
      {/* Panel izquierdo */}
      <div
        className={`transition-all duration-300 bg-white shadow-md border-r border-gray-300 overflow-y-auto ${
          open ? "w-24" : "w-5"
        }`}
      >
        <div className="flex flex-col items-start p-2 space-y-2">
          {open ? (
            Object.keys(tables).map((key) => (
              <button
                key={key}
                className={`w-full text-left text-[10px] px-2 py-1 rounded ${
                  active === key ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                {key}
              </button>
            ))
          ) : (
            <div className="text-[10px] text-gray-400 rotate-90 mt-10">TABLAS</div>
          )}
        </div>
      </div>

      {/* Botón de mostrar/ocultar */}
      <button
        onClick={() => {}}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-l-md px-2 py-1 text-xs shadow z-50"
      >
        ⮜
      </button>

      {/* Panel derecho */}
      <div className="flex-1 overflow-auto bg-gray-50 p-3">
        {loggedIn ? (
          active && Array.isArray(tables[active]) && tables[active].length > 0 ? (
            <div className="overflow-auto border border-gray-300 rounded-lg bg-white p-2 shadow-sm">
              <table className="min-w-max border-collapse text-xs">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    {Object.keys(tables[active][0]).map((col) => (
                      <th
                        key={col}
                        className="p-2 border border-gray-300 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tables[active].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="p-2 border border-gray-300 whitespace-nowrap"
                        >
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="h-12" />
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No hay datos disponibles en esta tabla.
            </p>
          )
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Debes iniciar sesión para ver la información.
          </p>
        )}
      </div>
    </div>
  );
}
