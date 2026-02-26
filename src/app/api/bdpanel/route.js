// src/app/api/bdpanel/route.js
import { connectDB } from '../../../connectDB.js';

export async function GET() {
  let client;

  try {
    client = await connectDB();

    // Tus tablas
    const tablas = [
      "carritos",
      "categorias",
      "items_carrito",
      "medidas",
      "productos",
      "subcategorias",
      "usuarios",
      "variaciones"
    ];

    const data = {};

    for (const tabla of tablas) {
      // Ejecuta un SELECT dinámico
      const res = await client.query(`SELECT * FROM ${tabla}`);
      data[tabla] = res.rows;
    }

    return Response.json({
      ok: true,
      message: "✅ Datos de todas las tablas obtenidos correctamente",
      data,
    });

  } catch (error) {
    console.error("❌ Error al obtener las tablas:", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  } finally {
    if (client) client.release?.();
  }
}
