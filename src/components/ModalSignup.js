"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ModalSignup({ isOpen, onClose }) {
  const { signup, openLoginModal, closeSignupModal } = useUser();

  const [form, setForm] = useState({ usuario: "", contrasena: "" });
  const [errorUser, setErrorUser] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorUserKey, setErrorUserKey] = useState(0);
  const [errorPassKey, setErrorPassKey] = useState(0);

  // 🔒 Bloqueo scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ⌨️ Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  // 🔄 Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setForm({ usuario: "", contrasena: "" });
      setErrorUser("");
      setErrorPass("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorUser("");
    setErrorPass("");
    setLoading(true);

    // Validaciones frontend
    if (!form.usuario) { setErrorUser("El usuario es obligatorio"); setErrorUserKey(k => k + 1); setLoading(false); return; }
    if (form.usuario.length < 3) { setErrorUser("El usuario debe tener mínimo 3 caracteres"); setErrorUserKey(k => k + 1); setLoading(false); return; }
    if (form.usuario.length > 50) { setErrorUser("El usuario no puede superar 50 caracteres"); setErrorUserKey(k => k + 1); setLoading(false); return; }
    if (!form.contrasena) { setErrorPass("La contraseña es obligatoria"); setErrorPassKey(k => k + 1); setLoading(false); return; }
    if (form.contrasena.length < 4) { setErrorPass("La contraseña debe tener mínimo 4 caracteres"); setErrorPassKey(k => k + 1); setLoading(false); return; }
    if (form.contrasena.length > 50) { setErrorPass("La contraseña no puede superar 50 caracteres"); setErrorPassKey(k => k + 1); setLoading(false); return; }

    try {
      const result = await signup(form.usuario.trim(), form.contrasena);

      if (!result.success) {
        setErrorUser(result.message || "Ya hay una cuenta creada con este nombre de usuario, intenta con otro nombre");
        setErrorUserKey(k => k + 1);
        setLoading(false);
        return;
      }

      // ✅ Solo cerrar modal y limpiar formulario
      onClose();
      setForm({ usuario: "", contrasena: "" });
      setErrorUser("");
      setErrorPass("");
      setLoading(false);

      // 🔹 No llamamos onOpenLogin, el UserContext abrirá LoginModal
    } catch (err) {
      setErrorUser("Error del servidor");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`relative w-[90%] max-w-md rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,.35)] transition-all duration-300 transform ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2"}`}>

        {/* Cerrar modal */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:bg-red-100/80 rounded-full p-1 transition hover:scale-110 cursor-pointer">
          <X size={26} />
        </button>

        <h2 className="text-3xl font-extrabold text-center mb-3">Crear cuenta</h2>

        {/* Usuario */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 mb-1 focus:ring-green-500 outline-none transition"
          />
          {errorUser && (
            <p key={errorUserKey} className="bg-red-100 text-red-700 text-xs text-center rounded-lg px-2 py-1 mt-1 transition-all duration-300">
              {errorUser}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div className="relative">
            <input
              name="contrasena"
              type={showPassword ? "text" : "password"}
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full p-3 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errorPass && (
            <p key={errorPassKey} className="bg-red-100 mt-2 text-red-700 text-xs text-center rounded-lg px-2 py-1 transition-all duration-300">
              {errorPass}
            </p>
          )}
        </div>

        {/* Botón Crear cuenta */}
        <div className="flex justify-center mt-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold transition hover:scale-105 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </div>

        {/* Link a login */}
        <div className="text-sm text-center mt-4">
          <span className="text-gray-700">¿Ya tienes cuenta? </span>
          <button
            onClick={() => {
              closeSignupModal();
              openLoginModal();
            }}
            className="text-green-600 font-bold hover:scale-105 transition cursor-pointer"
          >
            ¡Inicia sesión!
          </button>
        </div>

      </div>
    </div>
  );
}