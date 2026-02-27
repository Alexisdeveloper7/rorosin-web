"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import PanelLeft from "./PanelLeft";
import PanelRight from "./PanelRight";
import ModalLogin from "./ModalLogin";
import ModalSignup from "./ModalSignup";
import GlobalOverlay from "./GlobalOverlay";

export default function HeaderBare() {
  const router = useRouter();
  const pathname = usePathname();

  const [activePanel, setActivePanel] = useState(null);
  const [showHeader, setShowHeader] = useState(true); // Siempre visible al cargar

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  const lastScroll = useRef(0);

  // 🔥 Fuerza header visible si hay modal o panel
  useEffect(() => {
    if (loginOpen || signupOpen || activePanel) {
      setShowHeader(true);
    }
  }, [loginOpen, signupOpen, activePanel]);

  useEffect(() => {
    const handleScroll = () => {
      if (loginOpen || signupOpen || activePanel) return;

      const scrollY = window.scrollY;
      const isHome = pathname === "/";
      const heroEl = document.getElementById("inicio");
      const heroHeight = heroEl?.offsetHeight || 0;

      if (isHome && scrollY <= heroHeight) {
        setShowHeader(true);
      } else if (!isHome) {
        setShowHeader(scrollY < 88 || scrollY <= lastScroll.current);
      } else {
        setShowHeader(scrollY <= lastScroll.current);
      }

      lastScroll.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, loginOpen, signupOpen, activePanel]);

  const togglePanel = panel => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const abrirLogin = () => {
    setSignupOpen(false);
    setLoginMsg("");
    setLoginOpen(true);
  };

  const abrirSignup = () => {
    setLoginOpen(false);
    setLoginMsg("");
    setSignupOpen(true);
  };

  const signupExitoso = () => {
    setSignupOpen(false);
    setLoginMsg("Cuenta creada correctamente");
    setLoginOpen(true);
  };

  const overlayVisible = activePanel !== null || loginOpen || signupOpen;

  return (
    <>
      {/* GLOBAL OVERLAY */}
      <GlobalOverlay
        isVisible={overlayVisible}
        onClick={() => {
          setActivePanel(null);
          setLoginOpen(false);
          setSignupOpen(false);
          setLoginMsg("");
        }}
      />

      {/* HEADER */}
      <header
        className={`text-white sticky top-0 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex py-1 pb-2 backdrop-blur justify-between items-center w-full bg-black/52 rounded-b-4xl">
          <button
            className="ml-3 p-2 cursor-pointer"
            onClick={() => togglePanel("left")}
          >
            <FaBars className="text-3xl" />
          </button>

          <img
            className="w-28 rounded-full cursor-pointer"
            src="/images/logoheader.enc"
            alt="Logo"
            onClick={() => router.push("/")}
          />

          <button
            className="mr-3 p-2 cursor-pointer"
            onClick={() => togglePanel("right")}
          >
            <FaShoppingCart className="text-3xl" />
          </button>
        </div>
      </header>

      {/* PANELES */}
      <PanelLeft
        isOpen={activePanel === "left"}
        onClose={() => setActivePanel(null)}
        abrirLogin={abrirLogin}
        abrirSignup={abrirSignup}
      />

      <PanelRight
        isOpen={activePanel === "right"}
        onClose={() => setActivePanel(null)}
        abrirLogin={abrirLogin}     // ✅ Agregado
        abrirSignup={abrirSignup}   // ✅ Agregado si lo usas
      />

      {/* MODAL LOGIN */}
      <ModalLogin
        isOpen={loginOpen}
        successMessage={loginMsg}
        onClose={() => {
          setLoginOpen(false);
          setLoginMsg("");
        }}
        onOpenSignup={abrirSignup}
        onLoginSuccess={() => {
          setLoginMsg("Sesión iniciada correctamente");
          setTimeout(() => {
            setLoginOpen(false);
            setLoginMsg("");
            setActivePanel("left");
          }, 900);
        }}
      />

      {/* MODAL SIGNUP */}
      <ModalSignup
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onOpenLogin={abrirLogin}
        onSignupSuccess={signupExitoso}
      />
    </>
  );
}