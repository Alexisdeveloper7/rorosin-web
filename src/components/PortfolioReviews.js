"use client";

import { useEffect, useRef, useState } from "react";
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

  const sectionRef = useRef(null);
  const accountRef = useRef(null);
  const reviewsRef = useRef(null);
  const reviewRefs = useRef([]);

  const [sectionVisible, setSectionVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(() => new Set());
  const [formVisible, setFormVisible] = useState(false);

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
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar los comentarios");
      }

      const data = await res.json();

      setResenas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
      setResenas([]);
    } finally {
      setLoadingResenas(false);
    }
  };

  useEffect(() => {
    cargarResenas();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const account = accountRef.current;
    const reviews = reviewsRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setSectionVisible(true);
      setAccountVisible(true);
      setReviewsVisible(true);
      return;
    }

    const crearObserver = (element, onVisible, options) => {
      if (!element) return null;

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return;

        onVisible();
        observer.unobserve(entry.target);
      }, options);

      observer.observe(element);

      return observer;
    };

    const sectionObserver = crearObserver(
      section,
      () => setSectionVisible(true),
      {
        threshold: 0.05,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    const accountObserver = crearObserver(
      account,
      () => setAccountVisible(true),
      {
        threshold: 0.1,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    const reviewsObserver = crearObserver(
      reviews,
      () => setReviewsVisible(true),
      {
        threshold: 0.06,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    return () => {
      sectionObserver?.disconnect();
      accountObserver?.disconnect();
      reviewsObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (loadingResenas || resenas.length === 0) return;

    reviewRefs.current = reviewRefs.current.slice(0, resenas.length);

    const cards = reviewRefs.current.filter(Boolean);

    if (cards.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisibleReviews(new Set(resenas.map((_, index) => index)));
      return;
    }

    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.dataset.reviewIndex);

          setVisibleReviews((anteriores) => {
            if (anteriores.has(index)) {
              return anteriores;
            }

            const nuevos = new Set(anteriores);
            nuevos.add(index);

            return nuevos;
          });

          cardsObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -2% 0px",
      },
    );

    cards.forEach((card) => {
      cardsObserver.observe(card);
    });

    return () => {
      cardsObserver.disconnect();
    };
  }, [loadingResenas, resenas.length]);

  useEffect(() => {
    let firstFrame;
    let secondFrame;

    if (!formAbierto) {
      setFormVisible(false);
      return undefined;
    }

    setFormVisible(false);

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setFormVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);

      if (secondFrame) {
        window.cancelAnimationFrame(secondFrame);
      }
    };
  }, [formAbierto]);

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

    setError("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const irMiCuenta = () => {
    router.push("/quickcart/mi-cuenta");
  };

  const cerrarSesion = async () => {
    try {
      await logout();

      setFormAbierto(false);
      setError("");

      showToast?.("Sesión cerrada correctamente", "success");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      showToast?.("No se pudo cerrar la sesión", "error");
    }
  };

  const enviarResena = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      abrirModalLogin();
      return;
    }

    const idUsuario = user?.id_usuario ?? user?.id ?? null;
    const nombre = nombreCuenta.trim();
    const proyecto = form.proyecto.trim();
    const comentario = form.comentario.trim();

    if (!idUsuario) {
      setError(
        "No se pudo identificar tu cuenta. Cierra sesión e inicia nuevamente.",
      );
      return;
    }

    if (!nombre) {
      setError("No se pudo obtener el nombre de tu cuenta.");
      return;
    }

    if (!proyecto) {
      setError("Selecciona el proyecto relacionado con tu comentario.");
      return;
    }

    if (!PROYECTOS.includes(proyecto)) {
      setError("Selecciona un proyecto válido.");
      return;
    }

    if (comentario.length < 10) {
      setError("Escribe un comentario de al menos 10 caracteres.");
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
        credentials: "include",
        body: JSON.stringify({
          id_usuario: idUsuario,
          nombre,
          empresa: "",
          proyecto,
          comentario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error || "No se pudo publicar el comentario.",
        );
      }

      setForm({
        proyecto: "",
        comentario: "",
      });

      setFormAbierto(false);

      await cargarResenas();

      showToast?.("Comentario publicado correctamente", "success");
    } catch (err) {
      console.error("Error al publicar comentario:", err);

      setError(
        err?.message || "Ocurrió un error al publicar el comentario.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="resenas"
      className="relative isolate overflow-hidden border-t border-violet-400/10 bg-[#09060f] px-5 py-8 md:px-6 md:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_10%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_100%_55%,rgba(147,51,234,0.08),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.045),transparent_30%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className={`
              transform-gpu text-xs font-medium uppercase
              tracking-[0.2em] text-violet-300/55
              transition-[opacity,transform]
              duration-700
              ease-[cubic-bezier(0.16,1,0.3,1)]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              md:text-sm
              ${
                sectionVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-7 opacity-0"
              }
            `}
          >
            Comentarios
          </p>

          <h2
            className={`
              mt-1.5 transform-gpu
              bg-gradient-to-r from-white via-violet-100 to-violet-200
              bg-clip-text text-2xl font-semibold text-transparent
              transition-[opacity,transform]
              delay-[80ms] duration-[800ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              md:text-4xl
              ${
                sectionVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-6 scale-[0.96] opacity-0"
              }
            `}
          >
            Opiniones de clientes
          </h2>

          <p
            className={`
              mx-auto mt-2.5 max-w-2xl transform-gpu
              text-sm leading-relaxed text-violet-100/45
              transition-[opacity,transform]
              delay-[170ms] duration-[700ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              md:text-base
              ${
                sectionVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }
            `}
          >
            Experiencias reales sobre los proyectos y páginas que he
            desarrollado.
          </p>

          <div
            className={`
              mt-4 flex transform-gpu justify-center
              transition-[opacity,transform]
              delay-[250ms] duration-[700ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              ${
                sectionVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-5 scale-[0.96] opacity-0"
              }
            `}
          >
            <button
              type="button"
              onClick={abrirFormulario}
              className="w-full cursor-pointer rounded-full border border-violet-300/15 bg-[#553770] px-6 py-2.5 text-sm font-medium text-white shadow-[0_10px_26px_rgba(0,0,0,0.24)] transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-violet-200/25 hover:bg-[#634180] hover:shadow-[0_13px_30px_rgba(0,0,0,0.28)] active:scale-[0.98] sm:w-auto"
            >
              Dejar comentario
            </button>
          </div>
        </div>

        {/* Estado de la cuenta */}
        <div
          ref={accountRef}
          className={`
            mx-auto mt-4 max-w-4xl transform-gpu
            rounded-[1.2rem] border border-violet-400/12
            bg-[#120b1d]/90 p-3 text-center
            shadow-[0_14px_45px_rgba(0,0,0,0.22)]
            transition-[opacity,transform]
            duration-[800ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            md:p-3.5
            ${
              accountVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-7 scale-[0.97] opacity-0"
            }
          `}
        >
          {loadingUser ? (
            <div className="py-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/40">
                Verificando sesión
              </p>

              <div className="mx-auto mt-2 h-3.5 w-40 animate-pulse rounded-full bg-violet-300/10" />
            </div>
          ) : user ? (
            <div className="flex flex-col items-center justify-between gap-2.5 md:flex-row">
              <div className="min-w-0 text-center md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/40">
                  Sesión iniciada como
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-white md:text-base">
                  {nombreCuentaVisual}
                </p>

                <p className="mt-0.5 text-xs text-violet-100/35">
                  Tu comentario se publicará con este nombre.
                </p>
              </div>

              <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={irMiCuenta}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-4 py-2 text-sm font-medium text-violet-100/70 transition-[transform,border-color,background-color,color] duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white active:scale-[0.98]"
                >
                  Ver mi cuenta
                </button>

                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="cursor-pointer rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition-[transform,border-color,background-color] duration-300 hover:border-red-400/30 hover:bg-red-500/15 active:scale-[0.98]"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between gap-2.5 md:flex-row">
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-violet-50/85 md:text-base">
                  Inicia sesión para dejar un comentario.
                </p>

                <p className="mt-0.5 text-xs text-violet-100/35">
                  Se publicará con el nombre de tu cuenta.
                </p>
              </div>

              <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={abrirModalLogin}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-4 py-2 text-sm font-medium text-violet-100/75 transition-[transform,border-color,background-color,color] duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white active:scale-[0.98]"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={abrirModalSignup}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-[#553770] px-4 py-2 text-sm font-medium text-white transition-[transform,border-color,background-color] duration-300 hover:border-violet-200/25 hover:bg-[#634180] active:scale-[0.98]"
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Formulario */}
        {formAbierto && user && (
          <div
            className={`
              mx-auto mt-5 max-w-4xl transform-gpu
              rounded-[1.25rem] border border-violet-400/18
              bg-[#120b1d]/95 p-4
              shadow-[0_18px_55px_rgba(76,29,149,0.12)]
              transition-[opacity,transform]
              duration-[600ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              motion-reduce:transform-none
              motion-reduce:opacity-100
              motion-reduce:transition-none
              ${
                formVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-5 scale-[0.98] opacity-0"
              }
            `}
          >
            <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Escribe tu comentario
                </h3>

                <p className="mt-1 text-sm text-violet-100/45">
                  Selecciona el proyecto y comparte tu experiencia.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                disabled={enviando}
                className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-4 py-2 text-sm text-violet-100/60 transition-[transform,border-color,background-color,color,opacity] duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={enviarResena} className="mt-4 grid gap-3">
              <div>
                <label className="block text-center text-xs font-medium uppercase tracking-[0.15em] text-violet-200/40">
                  Publicando como
                </label>

                <div className="mt-1.5 rounded-xl border border-violet-300/12 bg-violet-400/5 px-4 py-2.5 text-center">
                  <p className="truncate text-sm font-semibold text-white">
                    {nombreCuentaVisual}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="proyecto-comentario"
                  className="block text-center text-xs font-medium uppercase tracking-[0.15em] text-violet-200/40"
                >
                  Proyecto relacionado
                </label>

                <select
                  id="proyecto-comentario"
                  name="proyecto"
                  value={form.proyecto}
                  onChange={cambiarCampo}
                  required
                  disabled={enviando}
                  className="mt-1.5 w-full cursor-pointer rounded-xl border border-violet-300/15 bg-[#0d0815] px-4 py-2.5 text-center text-sm text-white outline-none transition-[border-color,box-shadow,opacity] duration-300 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona un proyecto</option>

                  {PROYECTOS.map((proyecto) => (
                    <option key={proyecto} value={proyecto}>
                      {proyecto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="comentario-proyecto"
                  className="block text-center text-xs font-medium uppercase tracking-[0.15em] text-violet-200/40"
                >
                  Comentario
                </label>

                <textarea
                  id="comentario-proyecto"
                  name="comentario"
                  value={form.comentario}
                  onChange={cambiarCampo}
                  placeholder="Cuéntanos tu experiencia con este proyecto..."
                  rows={4}
                  required
                  minLength={10}
                  maxLength={2000}
                  disabled={enviando}
                  className="mt-1.5 w-full resize-none rounded-xl border border-violet-300/15 bg-[#0d0815]/80 px-4 py-3 text-center text-sm text-white outline-none transition-[border-color,box-shadow,opacity] duration-300 placeholder:text-violet-100/25 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <p className="mt-1 text-center text-[10px] text-violet-100/25">
                  {form.comentario.length}/2000
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-200"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  disabled={enviando}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-violet-400/5 px-5 py-2.5 text-sm font-medium text-violet-100/70 transition-[transform,border-color,background-color,color,opacity] duration-300 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={enviando}
                  className="cursor-pointer rounded-full border border-violet-300/15 bg-[#553770] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-[transform,border-color,background-color,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:border-violet-200/25 hover:bg-[#634180] active:scale-[0.98] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50"
                >
                  {enviando ? "Publicando..." : "Publicar comentario"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tarjetas de comentarios */}
        <div
          ref={reviewsRef}
          className={`
            mt-5 transform-gpu
            transition-[opacity,transform]
            duration-[800ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
            motion-reduce:transform-none
            motion-reduce:opacity-100
            motion-reduce:transition-none
            ${
              reviewsVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-7 opacity-0"
            }
          `}
        >
          {loadingResenas ? (
            <div className="grid items-start gap-3 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-violet-400/10 bg-[#120b1d]/90 p-4 text-center"
                >
                  <div className="mx-auto h-3 w-28 animate-pulse rounded bg-violet-300/10" />
                  <div className="mx-auto mt-2 h-5 w-40 animate-pulse rounded bg-violet-300/10" />

                  <div className="mx-auto mt-3 h-3 w-32 animate-pulse rounded bg-violet-300/10" />
                  <div className="mx-auto mt-2 h-5 w-36 animate-pulse rounded bg-violet-300/10" />

                  <div className="mx-auto mt-3 h-3 w-24 animate-pulse rounded bg-violet-300/10" />
                  <div className="mt-2 h-14 animate-pulse rounded-xl bg-violet-300/[0.06]" />
                </div>
              ))}
            </div>
          ) : resenas.length === 0 ? (
            <div className="rounded-[1.2rem] border border-violet-400/10 bg-[#120b1d]/90 p-6 text-center shadow-[0_16px_45px_rgba(0,0,0,0.2)]">
              <p className="text-lg font-medium text-violet-50/85">
                Todavía no hay comentarios.
              </p>

              <p className="mx-auto mt-1.5 max-w-md text-sm text-violet-100/40">
                Los comentarios publicados aparecerán en esta sección.
              </p>
            </div>
          ) : (
            <div className="grid items-start gap-3 md:grid-cols-2">
              {resenas.map((resena, index) => {
                const reviewVisible = visibleReviews.has(index);
                const nombreVisual = capitalizarNombre(resena.nombre);

                return (
                  <article
                    key={resena.id}
                    ref={(element) => {
                      reviewRefs.current[index] = element;
                    }}
                    data-review-index={index}
                    className={`
                      group relative w-full transform-gpu overflow-hidden
                      rounded-[1.3rem] border border-violet-400/12
                      bg-gradient-to-br
                      from-[#180f27]/95
                      via-[#120b1d]/95
                      to-[#0d0815]/95
                      p-4 text-center
                      shadow-[0_14px_40px_rgba(0,0,0,0.22)]
                      transition-[opacity,transform,border-color,box-shadow]
                      duration-[650ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      hover:-translate-y-0.5
                      hover:border-violet-400/25
                      hover:shadow-[0_18px_50px_rgba(76,29,149,0.14)]
                      motion-reduce:transform-none
                      motion-reduce:opacity-100
                      motion-reduce:transition-none
                      ${
                        reviewVisible
                          ? "translate-y-0 scale-100 opacity-100"
                          : "translate-y-6 scale-[0.98] opacity-0"
                      }
                    `}
                    style={{
                      transitionDelay: reviewVisible
                        ? `${Math.min(index, 5) * 60}ms`
                        : "0ms",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent"
                    />

                    {/* Nombre */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-violet-200/40">
                        Nombre del cliente
                      </p>

                      <h3 className="mt-1 break-words text-lg font-semibold leading-tight text-white">
                        {nombreVisual}
                      </h3>
                    </div>

                    {/* Proyecto */}
                    {resena.proyecto && (
                      <div className="mt-3 border-t border-violet-400/10 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-violet-200/40">
                          Proyecto relacionado
                        </p>

                        <div className="mx-auto mt-1.5 w-fit max-w-full rounded-full border border-violet-300/15 bg-violet-400/[0.07] px-3.5 py-1.5">
                          <p className="truncate text-xs font-medium text-violet-100/80">
                            {resena.proyecto}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Comentario */}
                    <div className="mt-3 border-t border-violet-400/10 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-violet-200/40">
                        Comentario
                      </p>

                      <div className="relative mt-2 overflow-hidden rounded-xl border border-violet-300/[0.08] bg-black/10 px-3.5 py-3 transition-[border-color,background-color] duration-300 group-hover:border-violet-300/15 group-hover:bg-violet-400/[0.035]">
                        <p className="whitespace-pre-wrap break-words text-center text-sm leading-[1.6] text-violet-50/80 md:text-[14.5px]">
                          “{resena.comentario}”
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}