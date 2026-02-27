'use client';

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { State, City } from "country-state-city";

export default function MiCuentaPage() {
  const { user, loading, openLoginModal, openSignupModal } = useUser();
  const [datos, setDatos] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const [editUsuario, setEditUsuario] = useState(false);
  const [editEstado, setEditEstado] = useState(false);
  const [editCiudad, setEditCiudad] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [nuevaCiudad, setNuevaCiudad] = useState("");

  const estadosMX = State.getStatesOfCountry("MX");
  const [ciudadesEstado, setCiudadesEstado] = useState([]);
  const [filtroCiudad, setFiltroCiudad] = useState("");

  const estadoRef = useRef(null);
  const ciudadRef = useRef(null);
  const inputCiudadRef = useRef(null);

  // Cargar datos del usuario
  useEffect(() => {
    const obtenerDatos = async () => {
      if (!user) { setCargandoDatos(false); return; }
      try {
        const res = await fetch(`/api/micuenta?id=${user.id}`);
        const data = await res.json();
        if (data.ok) {
          setDatos({
            ...data.usuario,
            pais: "México",
            estado: data.usuario.estado || "",
            ciudad: data.usuario.ciudad || ""
          });
          if (data.usuario.estado) {
            const estadoObj = estadosMX.find(e => e.name === data.usuario.estado);
            setCiudadesEstado(estadoObj ? City.getCitiesOfState("MX", estadoObj.isoCode) : []);
          }
        }
      } catch (err) { console.error("Error:", err); }
      finally { setCargandoDatos(false); }
    };
    if (!loading) obtenerDatos();
  }, [user, loading]);

  // Click fuera para cerrar dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editEstado && estadoRef.current && !estadoRef.current.contains(e.target)) setEditEstado(false);
      if (editCiudad && ciudadRef.current && !ciudadRef.current.contains(e.target)) setEditCiudad(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editEstado, editCiudad]);

  // Enfocar input ciudad cuando se abre
  useEffect(() => {
    if (editCiudad && inputCiudadRef.current) inputCiudadRef.current.focus();
  }, [editCiudad]);

  const seleccionarEstado = async (estado) => {
    setNuevoEstado(estado);
    try {
      const res = await fetch(`/api/micuenta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, estado })
      });
      const data = await res.json();
      if (data.ok) {
        setDatos(prev => ({ ...prev, estado, ciudad: "" }));
        setEditEstado(false);
        setNuevaCiudad("");
        setFiltroCiudad("");
        const estadoObj = estadosMX.find(e => e.name === estado);
        setCiudadesEstado(estadoObj ? City.getCitiesOfState("MX", estadoObj.isoCode) : []);
        setEditCiudad(true);
      }
    } catch (err) { console.error(err); }
  };

  const seleccionarCiudad = async (ciudad) => {
    setNuevaCiudad(ciudad);
    try {
      const res = await fetch(`/api/micuenta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, ciudad })
      });
      const data = await res.json();
      if (data.ok) {
        setDatos(prev => ({ ...prev, ciudad }));
        setEditCiudad(false);
        setFiltroCiudad("");
      }
    } catch (err) { console.error(err); }
  };

  const ciudadesFiltradas = filtroCiudad.length > 0
    ? ciudadesEstado.filter(c => c.name.toLowerCase().includes(filtroCiudad.toLowerCase()))
    : [];

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 px-3 py-6">
      <div className="w-full max-w-xl sm:max-w-2xl bg-white shadow-xl rounded-xl p-5 space-y-5">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-4">Mi Cuenta</h1>

        {(loading || cargandoDatos) && <p className="text-center text-gray-500 text-sm animate-pulse">Cargando...</p>}

        {user && datos && !loading && !cargandoDatos && (
          <div className="space-y-5">

            {/* Nombre de Usuario */}
            <Fila
              label="Nombre de usuario"
              value={editUsuario ? (
                <div className="flex flex-wrap gap-2 items-center w-full">
                  <input
                    className="border px-3 py-1 text-sm rounded-md flex-1 min-w-[150px]"
                    value={nuevoUsuario}
                    onChange={e => setNuevoUsuario(e.target.value)}
                    placeholder="Escribe tu nuevo nombre"
                  />
                  <button onClick={async () => {
                    const res = await fetch(`/api/micuenta`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, usuario: nuevoUsuario }) });
                    const data = await res.json();
                    if(data.ok){ setDatos(prev => ({...prev, usuario: nuevoUsuario})); setEditUsuario(false); setNuevoUsuario(""); }
                  }} className="px-5 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 flex-shrink-0">Guardar</button>
                  <button onClick={() => { setEditUsuario(false); setNuevoUsuario(""); }} className="px-5 py-1 text-sm font-medium rounded-md bg-gray-400 text-white hover:bg-gray-500 flex-shrink-0">Cancelar</button>
                </div>
              ) : <span className="ml-2">{datos.usuario}</span>}
              boton={!editUsuario ? "Editar" : null}
              onClick={() => { setEditUsuario(true); setNuevoUsuario(""); }}
              color="blue"
            />

            {/* País */}
            <Fila label="País" value={<span className="ml-2">{datos.pais}</span>} />

            {/* Estado */}
            <Fila
              label="Estado"
              value={
                <div className="relative w-full ml-2">
                  {!editEstado && <span>{datos.estado || "Sin datos"}</span>}
                  {editEstado && (
                    <div ref={estadoRef} className="absolute top-full left-0 w-full z-50 bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto mt-1">
                      <div className="sticky top-0 bg-white px-3 py-2 font-semibold border-b text-sm">Selecciona un estado</div>
                      {estadosMX.map(e => (
                        <div key={e.isoCode} className="px-3 py-1 hover:bg-gray-200 cursor-pointer text-sm" onClick={() => seleccionarEstado(e.name)}>{e.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              }
              boton={!editEstado ? (datos.estado ? "Editar" : "Añadir") : null}
              onClick={() => setEditEstado(true)}
              color={datos.estado ? "blue" : "green"}
            />

            {/* Ciudad */}
            <Fila
              label="Ciudad"
              value={
                <div className="relative w-full ml-2">
                  {!editCiudad && <span>{datos.ciudad || "Sin datos"}</span>}
                  {editCiudad && (
                    <div ref={ciudadRef} className="absolute top-full left-0 w-full z-50 bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto mt-1">
                      <div className="sticky top-0 bg-white px-3 py-2 border-b z-10 flex flex-col">
                        <div className="font-semibold text-sm mb-1">Selecciona una ciudad</div>
                        <input
                          ref={inputCiudadRef}
                          type="text"
                          className="border w-full px-2 py-1 text-sm rounded-md"
                          placeholder="Escribe tu ciudad"
                          value={filtroCiudad}
                          onChange={e => setFiltroCiudad(e.target.value)}
                        />
                      </div>
                      <div>
                        {ciudadesFiltradas.length > 0 ? (
                          ciudadesFiltradas.map(c => (
                            <div key={c.name} className="px-3 py-1 hover:bg-gray-200 cursor-pointer text-sm" onClick={() => seleccionarCiudad(c.name)}>{c.name}</div>
                          ))
                        ) : (
                          filtroCiudad.length > 0 && (
                            <div className="px-3 py-1 text-gray-500 text-sm">No se encontraron ciudades</div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              }
              boton={!editCiudad ? (datos.ciudad ? "Editar" : "Añadir") : null}
              onClick={() => { if(datos.estado) setEditCiudad(true); }}
              color={datos.ciudad ? "blue" : "green"}
              disabled={!datos.estado}
            />

            {/* Creado */}
            <Fila label="Creado" value={<span className="ml-2">{datos.fecha_creacion ? new Date(datos.fecha_creacion).toLocaleDateString() : "Sin datos"}</span>} />

          </div>
        )}

        {!user && !loading && !cargandoDatos && (
          <div className="space-y-2 text-center">
            <p className="text-gray-600 text-sm">Inicia sesión para ver tu cuenta.</p>
            <button onClick={openLoginModal} className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition">Iniciar sesión</button>
            <button onClick={openSignupModal} className="w-full bg-green-600 text-white py-2 rounded-md text-sm hover:bg-green-700 transition">Crear cuenta</button>
          </div>
        )}

      </div>
    </div>
  );
}

function Fila({ label, value, boton, onClick, color, disabled }) {
  const baseBtn = "px-5 py-1 text-sm font-medium rounded-md transition";
  const colores = { blue: "bg-blue-600 text-white hover:bg-blue-700", green: "bg-green-600 text-white hover:bg-green-700" };

  return (
    <div className="flex justify-between items-center bg-gray-50 px-3 py-3 rounded-md relative">
      <span className="text-sm font-semibold text-gray-600 w-36">{label}</span>
      <div className="flex items-center gap-3 flex-wrap w-full justify-between">
        <div className="flex-1">{value}</div>
        {boton && (
          <button onClick={onClick} disabled={disabled} className={`${baseBtn} ${disabled ? "bg-gray-400 text-white cursor-not-allowed" : colores[color]}`}>{boton}</button>
        )}
      </div>
    </div>
  );
}