import { connectDB } from "../../../connectDB.js";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    const client = await connectDB();

    const res = await client.query(`
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url AS imagen,
        p.activo,
        p.fecha_creacion,
        p.orden,
        
        c.id AS categoria_id,
        c.nombre AS categoria

      FROM productos p

      JOIN categorias c 
      ON p.categoria_id = c.id

      ORDER BY p.orden ASC
    `);

    return new Response(JSON.stringify(res.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {

    console.error("DB Error:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
        message: "Error al obtener productos"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }

}