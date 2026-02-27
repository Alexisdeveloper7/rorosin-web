"use client";

import { useEffect, useState } from "react";

export default function TestDBPage() {
  const [message, setMessage] = useState("Cargando...");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [inserted, setInserted] = useState(null);

  // Obtener la hora actual desde la DB
  useEffect(() => {
    fetch("/api/testdb")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.error) setMessage(`Error en API: ${data.error}`);
        else if (data.now) setMessage(`Hora actual en la DB: ${data.now.now}`);
        else setMessage("Respuesta inesperada de la API");
      })
      .catch(err => setMessage(`Error de conexión: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  // Insertar un nombre en la DB
  const handleInsert = async () => {
    if (!name) return alert("Ingresa un nombre");
    try {
      const res = await fetch("/api/testdb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.error) setInserted(`Error: ${data.error}`);
      else setInserted(`Insertado: ${JSON.stringify(data.inserted)}`);
      setName("");
    } catch (err) {
      setInserted(`Error de conexión: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test DB API</h1>

      {loading ? (
        <div className="p-4 bg-yellow-100 rounded">Cargando datos...</div>
      ) : (
        <div className="p-4 bg-gray-100 rounded mb-4">{message}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre para insertar"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleInsert}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Insertar
        </button>
      </div>

      {inserted && (
        <div className="p-4 bg-green-100 rounded">{inserted}</div>
      )}
    </div>
  );
}