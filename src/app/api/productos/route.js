import { connectDB } from '../../../connectDB.js';

export const dynamic = "force-dynamic"; // 👈 evita el caché en Vercel

export async function GET() {
  let client;
  try {
    client = await connectDB();

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
    const categorias = [];
    const catMap = new Map();

    for (const row of rows) {
      if (!catMap.has(row.idcategoria)) {
        catMap.set(row.idcategoria, {
          id: row.idcategoria,
          nombre: row.nombrecategoria,
          subcategorias: []
        });
      }
      const cat = catMap.get(row.idcategoria);

      let sub = cat.subcategorias.find(sc => sc.id === row.idsubcategoria);
      if (!sub && row.idsubcategoria != null) {
        sub = { id: row.idsubcategoria, nombre: row.nombresubcategoria, productos: [] };
        cat.subcategorias.push(sub);
      }

      let prod = sub?.productos.find(p => p.id === row.idproducto);
      if (!prod && row.idproducto != null) {
        prod = { id: row.idproducto, nombre: row.nombreproducto, descripcion: row.descripcionproducto, imagen: row.imagen, variaciones: [] };
        sub.productos.push(prod);
      }

      let vari = prod?.variaciones.find(v => v.id === row.idvariacion);
      if (!vari && row.idvariacion != null) {
        vari = { id: row.idvariacion, nombre: row.nombrevariacion, medidas: {} };
        prod.variaciones.push(vari);
      }

      if (row.idmedida != null) {
        vari.medidas[row.nombremedida] = row.valor;
      }
    }

    await client.end();

    return new Response(JSON.stringify(Array.from(catMap.values())), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('DB Error:', error.message);
    if (client) await client.end();
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
