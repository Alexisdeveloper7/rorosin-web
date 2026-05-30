"use client";

import { useUser } from "../context/UserContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function PanelLeft({
  isOpen,
  onClose,
  abrirLogin,
  abrirSignup,
}) {
  const { user, logout, loading } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goTo = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-51 flex justify-start items-start"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-64 h-full bg-[#fbfbfd] flex flex-col relative overflow-hidden rounded-tr-[28px] border-r border-white/40"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            {/* HEADER */}
            <div className="relative px-4 pt-5 pb-3 bg-[#fbfbfd]/95 backdrop-blur-xl border-b border-[#ececec]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-[#f5f5f7] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer border border-[#ececec]"
                style={{
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <X size={15} strokeWidth={2.7} className="text-[#6e6e73]" />
              </button>

              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#b0b0b5]">
                  QuickCart
                </p>

                <h2 className="text-[24px] leading-none font-semibold text-[#1d1d1f] tracking-tight">
                  Menú
                </h2>
              </div>
            </div>

            {/* BODY */}
            <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 bg-[#f5f5f7]">
              {[
                { name: "Inicio", path: "/quickcart" },
                { name: "Tienda", path: "/quickcart/tienda" },
                { name: "Mi carrito", path: "/quickcart/carrito" },
                { name: "Mis pedidos", path: "/quickcart/pedidos" },
                {
                  name: "Acerca de la empresa",
                  path: "/quickcart/sobrenosotros",
                },
                { name: "Ver portafolio", path: "/" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => goTo(item.path)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[20px] text-[14px] font-semibold text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] transition-all duration-200 cursor-pointer border border-[#ececec]"
                  style={{
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <span>{item.name}</span>

                  <svg
                    className="w-4 h-4 text-[#6e6e73]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              ))}

              <div className="h-px bg-[#e5e5ea] my-3"></div>

              {loading ? (
                <>
                  <div className="h-12 w-full bg-white rounded-[20px] animate-pulse border border-[#ececec]"></div>
                  <div className="h-10 w-full bg-white rounded-[18px] animate-pulse border border-[#ececec]"></div>
                  <div className="h-10 w-full bg-white rounded-[18px] animate-pulse border border-[#ececec]"></div>
                </>
              ) : user ? (
                <>
                  <div
                    className="bg-white p-3 rounded-[20px] border border-[#ececec]"
                    style={{
                      boxShadow:
                        "0 6px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#b0b0b5]">
                      Sesión Iniciada Como
                    </p>

                    <p className="font-semibold text-[14px] text-[#1d1d1f] mt-1 truncate">
                      {user.nombre_usuario || user.usuario}
                    </p>
                  </div>

                  <button
                    onClick={() => goTo("/quickcart/mi-cuenta")}
                    className="w-full bg-white text-[#1d1d1f] py-2.5 rounded-[18px] text-[14px] font-semibold transition-all duration-200 cursor-pointer border border-[#e5e5ea] hover:bg-[#f5f5f7]"
                    style={{
                      boxShadow:
                        "0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    Mi Cuenta
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      onClose();
                      showToast("Sesión cerrada correctamente", "success");
                    }}
                    className="w-full bg-[#fff1f1] text-[#ff453a] py-2.5 rounded-[18px] text-[14px] font-semibold hover:bg-[#ffe8e8] transition-all duration-200 cursor-pointer border border-[#ffd6d6]"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      abrirLogin();
                      onClose();
                    }}
                    className="w-full bg-white text-[#1d1d1f] py-2.5 rounded-[18px] text-[14px] font-semibold transition-all duration-200 cursor-pointer border border-[#e5e5ea] hover:bg-[#f5f5f7]"
                    style={{
                      boxShadow:
                        "0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    Iniciar Sesión
                  </button>

                  <button
                    onClick={() => {
                      abrirSignup();
                      onClose();
                    }}
                    className="w-full bg-[#f2f2f7] border border-[#e5e5ea] text-[#1d1d1f] py-2.5 rounded-[18px] text-[14px] font-semibold hover:bg-[#ebebf0] transition-all duration-200 cursor-pointer"
                  >
                    Crear Cuenta
                  </button>
                </>
              )}
            </nav>

            {/* FOOTER */}
            <div className="p-3 border-t border-[#ececec] bg-[#fbfbfd]/95 backdrop-blur-xl">
              <div className="h-1 w-12 rounded-full bg-[#d2d2d7] mx-auto"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}