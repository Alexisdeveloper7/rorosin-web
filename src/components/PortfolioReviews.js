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

      if (!res.ok) throw new Error("No se pudieron cargar los comentarios");

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
      className="border-t border-white/5 bg-[#242424] px-5 py-10 md:px-6 md:py-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-white/40 md:text-sm">
            Comentarios
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white md:text-4xl">
            Comentarios de clientes
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            Comentarios reales de personas y negocios con los que he trabajado.
          </p>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={abrirFormulario}
              className="w-full cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90 sm:w-auto"
            >
              Dejar comentario
            </button>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-[1.4rem] border border-white/10 bg-[#1f1f1f] p-3.5 text-center md:p-4">
          {loadingUser ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Verificando sesión
              </p>

              <div className="mx-auto mt-2.5 h-3.5 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="mx-auto mt-2 h-3 w-60 max-w-full animate-pulse rounded-full bg-white/10" />
            </div>
          ) : user ? (
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:text-left">
              <div className="min-w-0 text-center md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Sesión iniciada como
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-white md:text-base">
                  {nombreCuentaVisual}
                </p>

                <p className="mt-0.5 text-xs text-white/40">
                  Tu comentario se publicará con este nombre.
                </p>
              </div>

              <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row md:shrink-0">
                <button
                  type="button"
                  onClick={irMiCuenta}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  Ver mi cuenta
                </button>

                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="cursor-pointer rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:text-left">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Comentarios de clientes
                </p>

                <p className="mt-1 text-sm font-medium text-white/80 md:text-base">
                  Debes iniciar sesión para dejar un comentario.
                </p>

                <p className="mt-0.5 text-xs text-white/40">
                  Así tu comentario se publica con el nombre de tu cuenta.
                </p>
              </div>

              <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row md:shrink-0">
                <button
                  type="button"
                  onClick={abrirModalLogin}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={abrirModalSignup}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          )}
        </div>

        {formAbierto && user && (
          <div className="mx-auto mt-7 max-w-4xl rounded-[1.4rem] border border-white/10 bg-[#1f1f1f] p-4 md:p-5">
            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
              <div>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  Escribe tu comentario
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                  Comparte tu experiencia sobre una de las páginas que he realizado.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                className="mx-auto cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10 sm:mx-0"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={enviarResena} className="mt-5 grid gap-3.5">
              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.16em] text-white/35 sm:text-left">
                  Publicando como
                </label>

                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center sm:text-left">
                  <p className="truncate text-sm font-semibold text-white">
                    {nombreCuentaVisual}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Este nombre viene de tu cuenta y no se puede cambiar aquí.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.16em] text-white/35 sm:text-left">
                  Página comentada
                </label>

                <select
                  name="proyecto"
                  value={form.proyecto}
                  onChange={cambiarCampo}
                  className="mt-2 w-full cursor-pointer rounded-2xl border border-white/10 bg-[#2a2a2a] px-4 py-2.5 text-center text-sm text-white outline-none focus:border-white/25 sm:text-left"
                >
                  <option value="">Elige una página</option>
                  <option value="Hamburguesas Fátima">
                    Hamburguesas Fátima
                  </option>
                  <option value="Bi Ne Bianni">Bi Ne Bianni</option>
                </select>
              </div>

              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.16em] text-white/35 sm:text-left">
                  Comentario
                </label>

                <textarea
                  name="comentario"
                  value={form.comentario}
                  onChange={cambiarCampo}
                  placeholder="Escribe tu comentario sobre el trabajo realizado..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
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
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={enviando}
                  className="cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {enviando ? "Guardando..." : "Publicar comentario"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8">
          {loadingResenas ? (
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-[1.4rem] border border-white/5 bg-[#2a2a2a] p-5"
                >
                  <div className="mx-auto h-3.5 w-24 rounded bg-white/10" />
                  <div className="mx-auto mt-3 h-4 w-40 rounded bg-white/10" />
                  <div className="mt-5 h-4 w-full rounded bg-white/10" />
                  <div className="mx-auto mt-2.5 h-4 w-[85%] rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : resenas.length === 0 ? (
            <div className="rounded-[1.4rem] border border-white/5 bg-[#2a2a2a] p-7 text-center md:p-8">
              <p className="text-lg font-medium text-white/80 md:text-xl">
                No hay comentarios actualmente.
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
                Cuando un cliente deje un comentario, aparecerá en esta sección.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {resenas.map((resena) => (
                <article
                  key={resena.id}
                  className="w-full max-w-xl rounded-[1.4rem] border border-white/5 bg-[#2a2a2a] p-4 text-center transition hover:border-white/10 hover:bg-[#2d2d2d] md:w-[calc(50%-0.5rem)] md:p-5"
                >
                  <div className="mx-auto max-w-md">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      Nombre
                    </p>

                    <h3 className="mt-1 truncate text-base font-semibold text-white">
                      {capitalizarNombre(resena.nombre)}
                    </h3>

                    {resena.proyecto && (
                      <div className="mx-auto mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                          Página comentada
                        </p>

                        <p className="mt-1 text-sm font-medium text-white/80">
                          {resena.proyecto}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 border-t border-white/5 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                        Comentario
                      </p>

                      <p className="mx-auto mt-2.5 text-sm leading-relaxed text-white/80 md:text-[15px]">
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