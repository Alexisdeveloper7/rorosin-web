import { connectDB } from '../../../connectDB.js';

export const dynamic = "force-dynamic"; // evita caché en Vercel

export async function GET() {
  try {
    const client = await connectDB(); // singleton, no cerrar en serverless

    const res = await client.query(`
      SELECT 
        c.id AS idcategoria, c.nombre AS nombrecategoria,
        s.id AS idsubcategoria, s.nombre AS nombresubcategoria,
        p.id AS idproducto, p.nombre AS nombreproducto, p.descripcion AS descripcionproducto, p.imagen_url AS imagen,
        v.id AS idvariacion, v.nombre AS nombrevariacion,
        m.id AS idmedida, m.nombre AS nombremedida, m.valor AS valor
      FROM categorias c
      LEFT JOIN subcategorias s ON s.categoria_id = c.id
      LEFT JOIN productos p ON p.subcategoria_id = s.id
      LEFT JOIN variaciones v ON v.producto_id = p.id
      LEFT JOIN medidas m ON m.variacion_id = v.id
      ORDER BY c.id, s.id, p.id, v.id, m.id
    `);

    const rows = res.rows;
    const catMap = new Map();

    for (const row of rows) {
      // Categoría
      if (!catMap.has(row.idcategoria)) {
        catMap.set(row.idcategoria, {
          id: row.idcategoria,
          nombre: row.nombrecategoria,
          subcategorias: []
        });
      }
      const cat = catMap.get(row.idcategoria);

      // Subcategoría
      let sub;
      if (row.idsubcategoria != null) {
        sub = cat.subcategorias.find(sc => sc.id === row.idsubcategoria);
        if (!sub) {
          sub = { id: row.idsubcategoria, nombre: row.nombresubcategoria, productos: [] };
          cat.subcategorias.push(sub);
        }
      }

      // Producto
      let prod;
      if (sub && row.idproducto != null) {
        prod = sub.productos.find(p => p.id === row.idproducto);
        if (!prod) {
          prod = {
            id: row.idproducto,
            nombre: row.nombreproducto,
            descripcion: row.descripcionproducto,
            imagen: row.imagen,
            variaciones: []
          };
          sub.productos.push(prod);
        }
      }

      // Variación
      let vari;
      if (prod && row.idvariacion != null) {
        vari = prod.variaciones.find(v => v.id === row.idvariacion);
        if (!vari) {
          vari = { id: row.idvariacion, nombre: row.nombrevariacion, medidas: {} };
          prod.variaciones.push(vari);
        }
      }

      // Medida
      if (vari && row.idmedida != null) {
        vari.medidas[row.nombremedida] = row.valor;
      }
    }

    // ✅ Devuelve resultado
    return new Response(JSON.stringify(Array.from(catMap.values())), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('DB Error:', error.message);
    return new Response(JSON.stringify({ error: error.message, message: "Error al obtener productos" }), { status: 500 });
  }
};