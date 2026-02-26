import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 🔥 IMPORTANTE: evita cache en Next 15

export async function GET(req) {
  let client;

  try {
    client = await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado", items: [] },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Token inválido", items: [] },
        { status: 401 }
      );
    }

    const usuarioId = decoded.id;

    // 1️⃣ Obtener carrito del usuario
    const carritoResult = await client.query(
      "SELECT id_carrito FROM carritos WHERE id_usuario = $1",
      [usuarioId]
    );

    if (carritoResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    const carritoId = carritoResult.rows[0].id_carrito;

    // 2️⃣ Obtener items
    const itemsResult = await client.query(
      `
      SELECT
        ic.id_item,
        ic.id_producto,
        ic.id_variacion,
        p.nombre AS producto_nombre,
        p.imagen_url,
        v.nombre AS variacion_nombre,
        ic.cantidad
      FROM items_carrito ic
      JOIN productos p ON p.id = ic.id_producto
      JOIN variaciones v ON v.id = ic.id_variacion
      WHERE ic.id_carrito = $1
      ORDER BY ic.fecha_agregado DESC
      `,
      [carritoId]
    );

    return NextResponse.json({
      success: true,
      items: itemsResult.rows,
    });

  } catch (error) {
    console.error("❌ Error al listar carrito:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        items: [],
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}