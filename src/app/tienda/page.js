import ProductosListaClient from "../../components/ProductosLista";

export default async function TiendaPage() {
  const res = await fetch("http://localhost:3000/api/productos");
  const categorias = await res.json();

  return (
    <div className="flex-1 flex flex-col bg-whit">
      <h1 className="text-4xl text-center text-[#042F80] font-bold mt-4 mb-4">
        Catálogo de Productos
      </h1>

      <div className="flex-1 px-">
        <ProductosListaClient categorias={categorias} />
      </div>
    </div>
  );
}