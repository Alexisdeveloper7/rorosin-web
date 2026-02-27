import ProductosListaClient from "../../components/ProductosLista";

// ⚡ Forzar que la página se genere dinámicamente en tiempo real
export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  try {
    // 🔹 URL absoluta para fetch en SSR
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/productos`, { cache: "no-store" });

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