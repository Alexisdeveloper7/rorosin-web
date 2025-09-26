"use client";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export default function HeaderFlotante() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when panel open
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
      const yOffset = -94; // offset para header flotante
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMenuOpen(false); // cerrar menú al hacer scroll
  };

  return (
    <>
      <header className="fixed w-full z-50">
  <div
    className={`transition-all duration-500 flex items-center justify-between ${
      scrolled
        ? "bg-black/60 backdrop-blur-sm rounded-3xl mx-4 mt-2 shadow-lg"
        : "bg-white/20 backdrop-blur-md rounded-b-3xl"
    }`}
  >
    {/* Left menu button */}
    <div className="ml-5 text-2xl">
      <FaBars
        onClick={() => {
          setMenuOpen(!menuOpen);
          if (!menuOpen) setCartOpen(false);
        }}
        className={`cursor-pointer transition-colors duration-500 ${
          scrolled ? "text-white text-3xl ml-4" : "text-white text-4xl ml-2"
        }`}
      />
    </div>

    {/* Logo */}
    <div className="py-2">
      <img
        src="/images/logoheader.enc"
        alt="Rorosin Logo"
        className={`ml- rounded-full transition-all duration-500
          ${scrolled
            ? "w-20 sm:w-20"        // cuando haces scroll, logo pequeño
            : "w-24 sm:w-32"        // antes de scroll, logo más grande en sm/pc
          }`}
      />
    </div>

    {/* Cart button */}
    <div className="mr-5 text-2xl">
      <FaShoppingCart
        onClick={() => {
          setCartOpen(!cartOpen);
          if (!cartOpen) setMenuOpen(false);
        }}
        className={`cursor-pointer transition-colors duration-500 ${
          scrolled ? "text-white text-3xl mr-4" : "text-white text-4xl mr-2"
        }`}
      />
    </div>
  </div>
</header>


      {/* Overlay */}
      {(menuOpen || cartOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setMenuOpen(false);
            setCartOpen(false);
          }}
        />
      )}

      {/* Left Panel (Menu) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg">Menu</h2>
          <FaTimes
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer text-xl"
          />
        </div>
        <nav className="p-4">
          <ul className="space-y-3">
            <li
              className="cursor-pointer hover:text-blue-500 transition"
              onClick={() => scrollToSection("inicio")}
            >
              Inicio
            </li>
            <li
              className="cursor-pointer hover:text-blue-500 transition"
              onClick={() => scrollToSection("productos")}
            >
              Productos
            </li>
            <li className="cursor-pointer hover:text-blue-500 transition">
              Sobre nosotros
            </li>
            <li className="cursor-pointer hover:text-blue-500 transition">
              Contactos
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Panel (Cart) */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white text-black z-50 transform transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg">Carrito</h2>
          <FaTimes
            onClick={() => setCartOpen(false)}
            className="cursor-pointer text-xl"
          />
        </div>
        <div className="p-4">
          <p>Tu carrito está vacío.</p>
        </div>
      </div>
    </>
  );
}
