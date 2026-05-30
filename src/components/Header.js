"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaShoppingCart } from "react-icons/fa";

import PanelLeft from "./PanelLeft";
import PanelRight from "./PanelRight";
import ModalLogin from "./ModalLogin";
import ModalSignup from "./ModalSignup";
import GlobalOverlay from "./GlobalOverlay";
import ConfirmarPedidoModal from "./ConfirmarPedidoModal";

import { useUser } from "@/context/UserContext";
import { useCarrito } from "@/context/CarritoContext";
import Toast from "@/components/Toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [activePanel, setActivePanel] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [scrollControlActive, setScrollControlActive] = useState(false);
  const [confirmarPedidoOpen, setConfirmarPedidoOpen] = useState(false);

  const lastScroll = useRef(0);

  const {
    loginModalOpen,
    signupModalOpen,
    loginMessage,
    openLoginModal,
    openSignupModal,
    closeLoginModal,
  } = useUser();

  const { confirmarPedido } = useCarrito();

  // FORCE SHOW when modals or panels are open
  useEffect(() => {
    if (
      loginModalOpen ||
      signupModalOpen ||
      activePanel ||
      confirmarPedidoOpen
    ) {
      setShowHeader(true);
    }
  }, [loginModalOpen, signupModalOpen, activePanel, confirmarPedidoOpen]);

  // OBSERVER (activates scroll logic only after trigger leaves viewport)
  useEffect(() => {
    const trigger = document.getElementById("header-trigger");
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrollControlActive(false);
          setShowHeader(true);
        } else {
          setScrollControlActive(true);
        }
      },
      { threshold: 0 }
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, []);

  // SCROLL LOGIC (only active after trigger disappears)
  useEffect(() => {
    const handleScroll = () => {
      if (
        loginModalOpen ||
        signupModalOpen ||
        activePanel ||
        confirmarPedidoOpen
      ) {
        return;
      }

      if (!scrollControlActive) {
        setShowHeader(true);
        return;
      }

      const scrollY = window.scrollY;

      if (scrollY === 0) {
        setShowHeader(true);
      } else {
        setShowHeader(scrollY <= lastScroll.current);
      }

      lastScroll.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    loginModalOpen,
    signupModalOpen,
    activePanel,
    confirmarPedidoOpen,
    scrollControlActive,
  ]);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const irAQuickCart = () => {
    setActivePanel(null);
    closeLoginModal();
    setConfirmarPedidoOpen(false);
    setShowHeader(true);

    if (pathname === "/quickcart") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    router.push("/quickcart");
  };

  const abrirLogin = (msg = "") => openLoginModal(msg);

  const abrirSignup = () => openSignupModal();

  const signupExitoso = () =>
    openLoginModal("Cuenta creada correctamente");

  const abrirConfirmarPedido = () => {
    setActivePanel(null);

    setTimeout(() => {
      setConfirmarPedidoOpen(true);
    }, 300);
  };

  const cerrarTodo = () => {
    setActivePanel(null);
    setConfirmarPedidoOpen(false);
    closeLoginModal();
  };

  const overlayVisible =
    activePanel !== null || loginModalOpen || signupModalOpen;

  return (
    <>
      {/* GLOBAL OVERLAY */}
      <GlobalOverlay
        isVisible={overlayVisible}
        onClick={cerrarTodo}
      />

      {/* HEADER */}
      <header
        id="main-header"
        className={`sticky top-0 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative flex py-2 justify-between items-center w-full bg-white border-b border-gray-100 shadow-sm">
          {/* MENU */}
          <button
            className="ml-3 p-2 cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={() => togglePanel("left")}
          >
            <FaBars className="text-2xl" />
          </button>

          {/* LOGO */}
          <img
            className="w-28 rounded-full cursor-pointer"
            src="/iconoo.png"
            alt="Logo"
            onClick={irAQuickCart}
          />

          {/* CART */}
          <button
            className="mr-3 p-2 cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={() => togglePanel("right")}
          >
            <FaShoppingCart className="text-2xl" />
          </button>

          {/* TOAST */}
          <div className="absolute top-full left-0 w-full">
            <Toast />
          </div>
        </div>
      </header>

      {/* PANELS */}
      <PanelLeft
        isOpen={activePanel === "left"}
        onClose={() => setActivePanel(null)}
        abrirLogin={abrirLogin}
        abrirSignup={abrirSignup}
      />

      <PanelRight
        isOpen={activePanel === "right"}
        onClose={() => setActivePanel(null)}
        abrirLogin={abrirLogin}
        abrirSignup={abrirSignup}
        abrirConfirmarPedido={abrirConfirmarPedido}
      />

      {/* CONFIRMAR PEDIDO MODAL */}
      <ConfirmarPedidoModal
        isOpen={confirmarPedidoOpen}
        onClose={() => setConfirmarPedidoOpen(false)}
        onConfirm={confirmarPedido}
      />

      {/* LOGIN MODAL */}
      <ModalLogin
        isOpen={loginModalOpen}
        successMessage={loginMessage}
        onClose={closeLoginModal}
        onOpenSignup={abrirSignup}
        onLoginSuccess={() => {
          openLoginModal("Sesión iniciada correctamente");

          setTimeout(() => {
            closeLoginModal();
            setActivePanel("left");
          }, 900);
        }}
      />

      {/* SIGNUP MODAL */}
      <ModalSignup
        isOpen={signupModalOpen}
        onClose={abrirSignup}
        onOpenLogin={abrirLogin}
        onSignupSuccess={signupExitoso}
      />
    </>
  );
}