"use client";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export default function HeaderFlotante() {
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollingUp, setScrollingUp] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollingUp(currentScroll < scrollPos || currentScroll < 100);
      setScrollPos(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPos]);

  // Prevent background scroll when panels are open
  useEffect(() => {
    if (menuOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, cartOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -111;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed w-full z-50 transform transition-transform duration-500 ${
          scrollingUp ? "" : "-translate-y-full "
        }`}
      >
        <div
  className={`flex items-center justify-between bg-white/3 backdrop-blur-md rounded-3xl mx-5 transition-all duration-500 ${
    scrollingUp ? "mt-" : ""
  }`}
>

          {/* Left menu button */}
          <div
            onClick={() => {
              setMenuOpen(!menuOpen);
              if (!menuOpen) setCartOpen(false);
            }}
            className="cursor-pointer rounded-full ml-3 p-5 bg-black/35 backdrop-blur"
          >
            <FaBars className="text-white text-2xl transition-colors duration-500" />
          </div>

          {/* Logo */}
          <div>
            <img
              src="/images/logoheader.enc"
              alt="Rorosin Logo"
              className="w-20 my-1 cursor-pointer rounded-full transition-all duration-500"
              onClick={() => {
                const element = document.getElementById("inicio");
                if (element) {
                  const yOffset = -111;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
            />
          </div>

          {/* Cart button */}
          <div
            onClick={() => {
              setCartOpen(!cartOpen);
              if (!cartOpen) setMenuOpen(false);
            }}
            className="mr-3 rounded-full p-5 bg-black/23 cursor-pointer"
          >
            <FaShoppingCart className="text-white text-2xl transition-colors duration-500" />
          </div>
        </div>
      </header>

      {/* Overlay del menú */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Overlay del carrito */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Left Panel (Menu) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg p-4">Menu</h2>
          <FaTimes
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer text-xl p-4"
          />
        </div>
        <nav className="p-4">
          <ul className="space-y-3">
            <li className="cursor-pointer hover:text-blue-500 transition" onClick={() => scrollToSection("inicio")}>
              Inicio
            </li>
            <li className="cursor-pointer hover:text-blue-500 transition" onClick={() => scrollToSection("productos")}>
              Productos
            </li>
            <li className="cursor-pointer hover:text-blue-500 transition">Sobre nosotros</li>
            <li className="cursor-pointer hover:text-blue-500 transition">Contactos</li>
          </ul>
        </nav>
      </div>

      {/* Right Panel (Cart) */}
<div
  className={`fixed top-0 right-0 h-full w-62 bg-white text-black z-50 transform transition-transform duration-500 ${
    cartOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="flex justify-between items-center border-b border-gray-300 p-4">
    <h2 className="text-lg">Carrito</h2>
    <FaTimes onClick={() => setCartOpen(false)} className="cursor-pointer text-xl" />
  </div>
  <div className="p-4">
    <p>Tu carrito está vacío.</p>
    {/* Botón que va a sección de productos */}
    <button
      onClick={() => {
        const element = document.getElementById("productos");
        if (element) {
          const yOffset = -111;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        setCartOpen(false); // cierra el carrito al hacer scroll
      }}
      className="mt-3 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Ver productos
    </button>
  </div>
</div>

    </>
  );
}
