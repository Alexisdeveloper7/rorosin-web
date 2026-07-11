"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

const PROYECTOS = ["Hamburguesas Fátima", "Bi Ne Bianni"];

function capitalizarNombre(nombre = "") {
  return String(nombre)
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

export default function PortfolioReviews({ abrirLogin, abrirSignup }) {
  const router = useRouter();

  const {
    user,
    logout,
    loading: loadingUser,
    openLoginModal,
    openSignupModal,
  } = useUser();

  const { showToast } = useToast();

  const [resenas, setResenas] = useState([]);
  const [loadingResenas, setLoadingResenas] = useState(true);
  const [formAbierto, setFormAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    proyecto: "",
    comentario: "",
  });

  const nombreCuenta =
    user?.nombre_usuario ||
    user?.usuario ||
    user?.nombre ||
    user?.name ||
    "";

  const nombreCuentaVisual = capitalizarNombre(nombreCuenta);

  const cargarResenas = async () => {
    try {
      setLoadingResenas(true);

      const res = await fetch("/api/resenas", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar los comentarios");
      }

      const data = await res.json();
      setResenas(Array.isArray(data) ? data : []);
    } catch {
      setResenas([]);
    } finally {
      setLoadingResenas(false);
    }
  };

  useEffect(() => {
    cargarResenas();
  }, []);

  const abrirModalLogin = () => {
    setError("");

    if (typeof abrirLogin === "function") {
      abrirLogin();
      return;
    }

    openLoginModal?.();
  };

  const abrirModalSignup = () => {
    setError("");

    if (typeof abrirSignup === "function") {
      abrirSignup();
      return;
    }

    openSignupModal?.();
  };

  const abrirFormulario = () => {
    setError("");

    if (!user) {
      abrirModalLogin();
      return;
    }

    setFormAbierto(true);
  };

  const cerrarFormulario = () => {
    if (enviando) return;

    setFormAbierto(false);
    setError("");
  };

  const cambiarCampo = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const irMiCuenta = () => {
    router.push("/quickcart/mi-cuenta");
  };

  const cerrarSesion = () => {
    logout();
    setFormAbierto(false);
    setError("");
    showToast?.("Sesión cerrada correctamente", "success");
  };

  const enviarResena = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      abrirModalLogin();
      return;
    }

    const nombre = nombreCuenta.trim();
    const proyecto = form.proyecto.trim();
    const comentario = form.comentario.trim();

    if (!nombre) {
      setError("No se pudo obtener el nombre de tu cuenta.");
      return;
    }

    if (!proyecto) {
      setError("Elige sobre qué página quieres comentar.");
      return;
    }

    if (!PROYECTOS.includes(proyecto)) {
      setError("Selecciona una página válida.");
      return;
    }

    if (comentario.length < 10) {
      setError("Escribe un comentario un poco más completo.");
      return;
    }

    try {
      setEnviando(true);

      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          id_usuario: user?.id || null,
          nombre,
          empresa: "",
          proyecto,
          comentario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo guardar el comentario");
      }

      setForm({
        proyecto: "",
        comentario: "",
      });

      setFormAbierto(false);
      await cargarResenas();
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el comentario.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      id="resenas"
      className="relative isolate overflow-hidden border-t border-violet-400/10 bg-[#09060f] px-5 py-10 md:px-6 md:py-12"
    >
      {/* Resplandores morados del fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute -right-44 top-1/3 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[140px]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-300/60 md:text-sm">
            Comentarios
          </p>

          <h2 className="mt-2 bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-2xl font-semibold text-transparent md:text-4xl">
            Comentarios de clientes
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-violet-100/50 md:text-base">
            Comentarios reales de personas y negocios con los que he trabajado.
          </p>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={abrirFormulario}
              className="w-full cursor-pointer rounded-full border border-violet-300/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-medium text-white shadow-[0_12px_38px_rgba(124,58,237,0.32)] transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-[0_16px_44px_rgba(168,85,247,0.4)] sm:w-auto"
            >
              Dejar comentario
            </button>
          </div>
        </div>

        {/* Estado de la cuenta */}
        <div className="mx-auto mt-6 max-w-4xl rounded-[1.4rem] border border-violet-400/15 bg-[#120b1d]/80 p-3.5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-4">
          {loadingUser ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/40">
                Verificando sesión
              </p>

              <div className="mx-auto mt-2.5 h-3.5 w-40 animate-pulse rounded-full bg-violet-300/10" />

              <div className="mx-auto mt-2 h-3 w-60 max-w-full animate-pulse rounded-full bg-violet-300/10" />
            </div>
          ) : user ? (
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:text-left">
              <div className="min-w-0 text-center md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/40">
                  Sesión iniciada como
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-white md:text-base">
                  {nombreCuentaVisual}
                </p>

                <p className="mt-0.5 text-xs text-violet-100/40">
                  Tu comentario se publicará con este nombre.
                </p>
              </div>

              <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row md:shrink-0">
                <button
                  type="button"
                  onClick={irMiCuenta}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-4 py-2 text-sm font-medium text-violet-100/75 transition duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white"
                >
                  Ver mi cuenta
                </button>

                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="cursor-pointer rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition duration-300 hover:border-red-400/30 hover:bg-red-500/15"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:text-left">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/40">
                  Comentarios de clientes
                </p>

                <p className="mt-1 text-sm font-medium text-violet-50/85 md:text-base">
                  Debes iniciar sesión para dejar un comentario.
                </p>

                <p className="mt-0.5 text-xs text-violet-100/40">
                  Así tu comentario se publica con el nombre de tu cuenta.
                </p>
              </div>

              <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row md:shrink-0">
                <button
                  type="button"
                  onClick={abrirModalLogin}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-4 py-2 text-sm font-medium text-violet-100/75 transition duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={abrirModalSignup}
                  className="cursor-pointer rounded-full border border-violet-300/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_25px_rgba(124,58,237,0.25)] transition duration-300 hover:from-violet-500 hover:to-fuchsia-500"
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Formulario */}
        {formAbierto && user && (
          <div className="mx-auto mt-7 max-w-4xl rounded-[1.4rem] border border-violet-400/20 bg-[#120b1d]/90 p-4 shadow-[0_24px_70px_rgba(76,29,149,0.15)] backdrop-blur-xl md:p-5">
            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
              <div>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  Escribe tu comentario
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-violet-100/50">
                  Comparte tu experiencia sobre una de las páginas que he
                  realizado.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                className="mx-auto cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-4 py-2 text-sm text-violet-100/60 transition duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white sm:mx-0"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={enviarResena} className="mt-5 grid gap-3.5">
              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.16em] text-violet-200/40 sm:text-left">
                  Publicando como
                </label>

                <div className="mt-2 rounded-2xl border border-violet-300/15 bg-violet-400/5 px-4 py-2.5 text-center sm:text-left">
                  <p className="truncate text-sm font-semibold text-white">
                    {nombreCuentaVisual}
                  </p>

                  <p className="mt-0.5 text-xs text-violet-100/35">
                    Este nombre viene de tu cuenta y no se puede cambiar aquí.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.16em] text-violet-200/40 sm:text-left">
                  Página comentada
                </label>

                <select
                  name="proyecto"
                  value={form.proyecto}
                  onChange={cambiarCampo}
                  className="mt-2 w-full cursor-pointer rounded-2xl border border-violet-300/15 bg-[#0d0815] px-4 py-2.5 text-center text-sm text-white outline-none transition duration-300 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15 sm:text-left"
                >
                  <option value="">Elige una página</option>

                  <option value="Hamburguesas Fátima">
                    Hamburguesas Fátima
                  </option>

                  <option value="Bi Ne Bianni">Bi Ne Bianni</option>
                </select>
              </div>

              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.16em] text-violet-200/40 sm:text-left">
                  Comentario
                </label>

                <textarea
                  name="comentario"
                  value={form.comentario}
                  onChange={cambiarCampo}
                  placeholder="Escribe tu comentario sobre el trabajo realizado..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-violet-300/15 bg-[#0d0815]/80 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-violet-100/25 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15"
                />
              </div>

              {error && (
                <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-200">
                  {error}
                </p>
              )}

              <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-6 py-2.5 text-sm font-medium text-violet-100/70 transition duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={enviando}
                  className="cursor-pointer rounded-full border border-violet-300/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(124,58,237,0.3)] transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50"
                >
                  {enviando ? "Guardando..." : "Publicar comentario"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comentarios */}
        <div className="mt-8">
          {loadingResenas ? (
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-[1.4rem] border border-violet-400/10 bg-[#120b1d]/80 p-5 backdrop-blur-xl"
                >
                  <div className="mx-auto h-3.5 w-24 rounded bg-violet-300/10" />

                  <div className="mx-auto mt-3 h-4 w-40 rounded bg-violet-300/10" />

                  <div className="mt-5 h-4 w-full rounded bg-violet-300/10" />

                  <div className="mx-auto mt-2.5 h-4 w-[85%] rounded bg-violet-300/10" />
                </div>
              ))}
            </div>
          ) : resenas.length === 0 ? (
            <div className="rounded-[1.4rem] border border-violet-400/10 bg-[#120b1d]/80 p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8">
              <p className="text-lg font-medium text-violet-50/85 md:text-xl">
                No hay comentarios actualmente.
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm text-violet-100/40">
                Cuando un cliente deje un comentario, aparecerá en esta sección.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {resenas.map((resena) => (
                <article
                  key={resena.id}
                  className="group w-full max-w-xl rounded-[1.4rem] border border-violet-400/10 bg-gradient-to-br from-[#160d25]/95 via-[#120b1d]/95 to-[#0d0816]/95 p-4 text-center shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-[0_24px_70px_rgba(124,58,237,0.16)] md:w-[calc(50%-0.5rem)] md:p-5"
                >
                  <div className="mx-auto max-w-md">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/40">
                      Nombre
                    </p>

                    <h3 className="mt-1 truncate text-base font-semibold text-white">
                      {capitalizarNombre(resena.nombre)}
                    </h3>

                    {resena.proyecto && (
                      <div className="mx-auto mt-3 rounded-2xl border border-violet-400/15 bg-violet-500/5 px-4 py-2.5 transition duration-300 group-hover:bg-violet-500/10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/40">
                          Página comentada
                        </p>

                        <p className="mt-1 text-sm font-medium text-violet-50/85">
                          {resena.proyecto}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 border-t border-violet-400/10 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/40">
                        Comentario
                      </p>

                      <p className="mx-auto mt-2.5 text-sm leading-relaxed text-violet-50/80 md:text-[15px]">
                        “{resena.comentario}”
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}