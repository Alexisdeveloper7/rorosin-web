import ProductosListaClient from "../../components/ProductosLista";

// ⚡ Forzar que la página se genere dinámicamente en tiempo real
export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  try {
    // Fetch interno usando ruta relativa
    const res = await fetch("/api/productos", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Error al obtener productos");
    }

    const categorias = await res.json();

    return (
      <div className="flex-1 flex flex-col bg-white">
        <h1 className="text-4xl text-center text-[#042F80] font-bold mt-4 mb-4">
          Catálogo de Productos
        </h1>

        <div className="flex-1 px-4">
          <ProductosListaClient categorias={categorias} />
        </div>
      </div>
    );
  } catch (error) {
    // Manejo simple de errores para evitar que el build falle
    return (
      <div className="flex-1 flex flex-col bg-white items-center justify-center">
        <h1 className="text-2xl text-red-600 font-bold">
          Error cargando productos
        </h1>
        <p>{error.message}</p>
      </div>
    );
  }
}