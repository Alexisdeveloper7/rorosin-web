"use client";

import ProductosDestacados from "../../components/ProductosDestacados";

export default function Page() {
  const scrollToProductos = () => {
    const productosSection = document.getElementById("productos");
    if (!productosSection) return;

    const headerHeight = 124;

    const topPos =
      productosSection.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: topPos - headerHeight,
      behavior: "smooth",
    });
  };

  const irATodosLosProductos = () => {
    window.location.href = "/quickcart/tienda";
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      {/* HERO */}
      <section className="max-w-6xl mx-auto text-center pt-7 pb-5 md:pt-20 md:pb-16 px-5">
        

        <h2 className="text-4xl md:text-6xl font-semibold mb-5 tracking-tight text-gray-950">
          QuickCart
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-7 leading-relaxed text-sm md:text-base">
          QuickCart es una tienda online demostrativa creada para presentar mis habilidades en desarrollo web. Los productos no están a la venta; forman parte de una simulación diseñada para mostrar una experiencia de compra moderna, intuitiva y funcional.

        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm sm:max-w-none mx-auto">

          <button
            onClick={scrollToProductos}
            className="bg-white border border-gray-200 text-gray-800 px-7 py-3 rounded-2xl font-medium hover:bg-gray-100 transition shadow-sm text-sm md:text-base"
          >
            Explorar categorías
          </button>

          <button
            onClick={irATodosLosProductos}
            className="bg-[#2f2f33] text-white px-7 py-3 rounded-2xl font-medium hover:bg-[#1f1f22] transition shadow-sm text-sm md:text-base"
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section id="productos" className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm px-4 py-8 md:px-8 md:py-12">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-2">
              Categorías destacadas
            </p>

            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-950">
              ↓ Productos destacados ↓
            </h3>
          </div>

          <div className="[&>*]:grid-cols-2">
            <ProductosDestacados />
          </div>
        </div>
      </section>
    </div>
  );
}