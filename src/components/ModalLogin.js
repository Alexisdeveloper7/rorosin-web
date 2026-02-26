"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { X } from "lucide-react";

export default function ModalLogin({ isOpen, onClose, onOpenSignup, initialMessage = "" }) {
  const { login } = useUser();

  const [form, setForm] = useState({ usuario: "", contrasena: "" });
  const [errorUser, setErrorUser] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errorUserKey, setErrorUserKey] = useState(0);
  const [errorPassKey, setErrorPassKey] = useState(0);

  useEffect(() => setMounted(true), []);

  // 🔒 Bloqueo scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ⌨️ Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  // 🔄 Reset modal y mostrar alerta si viene de signup
  useEffect(() => {
    if (!isOpen) return;
    setForm({ usuario: "", contrasena: "" });
    setErrorUser("");
    setErrorPass("");
    setLoading(false);

    if (initialMessage) {
      setSuccess(initialMessage); // la alerta se mantiene si viene de signup
    } else {
      setSuccess(""); // limpia cualquier alerta anterior
    }
  }, [isOpen, initialMessage]);

  // 🔄 Limpiar alertas al cerrar
  useEffect(() => {
    if (!isOpen) return;
    return () => {
      setSuccess("");
      setErrorUser("");
      setErrorPass("");
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setErrorUser("");
    setErrorPass("");
    setSuccess("");
    setLoading(true);

    if (!form.usuario) {
      setErrorUser("El usuario es obligatorio");
      setErrorUserKey(k => k + 1);
      setLoading(false);
      return;
    }

    if (!form.contrasena) {
      setErrorPass("La contraseña es obligatoria");
      setErrorPassKey(k => k + 1);
      setLoading(false);
      return;
    }

    try {
      const res = await login(form.usuario, form.contrasena);

      if (!res.success) {
        setErrorPass(res.message || "Usuario o contraseña incorrectos");
        setErrorPassKey(k => k + 1);
        setLoading(false);
        return;
      }

      setSuccess("¡Sesión iniciada correctamente!");
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1200);

    } catch {
      setErrorPass("Error del servidor");
      setErrorPassKey(k => k + 1);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`relative w-[90%] max-w-md rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,.35)] transition-all duration-300 transform ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2"}`}>

        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:bg-red-100/80 rounded-full p-1 transition hover:scale-110 cursor-pointer">
          <X size={26} />
        </button>

        <h2 className="text-3xl font-extrabold text-center mb-3">Iniciar sesión</h2>

        {/* Mensaje de éxito fijo */}
        {success && (
          <div className="mb-4">
            <div className="bg-emerald-500 text-white text-sm text-center font-semibold rounded-xl px-4 py-3 shadow-lg border border-emerald-300">
              {success}
            </div>
          </div>
        )}

        {/* Usuario */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-text"
          />
          {errorUser && (
            <p key={errorUserKey} className="bg-red-100 text-red-700 text-xs text-center rounded-lg px-2 py-1 mt-2">
              {errorUser}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            name="contrasena"
            type="password"
            value={form.contrasena}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-text"
          />
          {errorPass && (
            <p key={errorPassKey} className="bg-red-100 text-red-700 text-xs text-center rounded-lg px-2 py-1 mt-2">
              {errorPass}
            </p>
          )}
        </div>

        {/* Botón Entrar */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold transition hover:scale-105 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        {/* Link a signup */}
        <div className="text-sm text-center mt-4">
          <span className="text-gray-700">¿No tienes cuenta? </span>
          <button
            onClick={() => { onClose(); onOpenSignup(); }}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            ¡Crea una ahora!
          </button>
        </div>

      </div>
    </div>
  );
}