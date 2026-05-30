import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const client = await connectDB();

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

    // 🛒 obtener carrito del usuario
    const carritoResult = await client.query(
      "SELECT id_carrito FROM carritos WHERE id_usuario = $1",
      [usuarioId]
    );

    if (carritoResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
        total: 0,
      });
    }

    const carritoId = carritoResult.rows[0].id_carrito;

    // 📦 traer items con imagen consistente
    const itemsResult = await client.query(
      `
      SELECT
        ci.id_item,
        ci.id_producto,
        p.nombre AS producto_nombre,

        -- FIX IMPORTANTE: normalizamos nombre de imagen
        p.imagen_url AS imagen_url,

        ci.cantidad,
        ci.precio_unitario,
        (ci.cantidad * ci.precio_unitario) AS subtotal
      FROM carrito_items ci
      LEFT JOIN productos p ON p.id = ci.id_producto
      WHERE ci.id_carrito = $1
      ORDER BY ci.fecha_agregado DESC
      `,
      [carritoId]
    );

    // 🧮 calcular total general
    const total = itemsResult.rows.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    return NextResponse.json({
      success: true,
      items: itemsResult.rows,
      total,
    });

  } catch (error) {
    console.error("❌ Error al listar carrito:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        items: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}