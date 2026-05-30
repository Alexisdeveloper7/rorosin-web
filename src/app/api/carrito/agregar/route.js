import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const client = await connectDB();

    const { productoId, cantidad } = await req.json();

    if (!productoId || !cantidad || cantidad <= 0) {
      return NextResponse.json(
        { success: false, message: "Datos incompletos" },
        { status: 400 }
      );
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );
    }

    const usuarioId = decoded.id;

    // 🛒 obtener o crear carrito
    const carritoResult = await client.query(
      `
      INSERT INTO carritos (id_usuario)
      VALUES ($1)
      ON CONFLICT (id_usuario)
      DO UPDATE SET id_usuario = EXCLUDED.id_usuario
      RETURNING id_carrito
      `,
      [usuarioId]
    );

    const carritoId = carritoResult.rows[0].id_carrito;

    // 💰 obtener precio actual del producto
    const productoResult = await client.query(
      `
      SELECT precio
      FROM productos
      WHERE id = $1
      `,
      [productoId]
    );

    if (productoResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const precioUnitario = productoResult.rows[0].precio;

    // 🛒 UPSERT carrito_items (SIN variaciones)
    await client.query(
      `
      INSERT INTO carrito_items (
        id_carrito,
        id_producto,
        cantidad,
        precio_unitario
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id_carrito, id_producto)
      DO UPDATE SET
        cantidad = carrito_items.cantidad + EXCLUDED.cantidad
      `,
      [carritoId, productoId, cantidad, precioUnitario]
    );

    return NextResponse.json({
      success: true,
      message: "Producto agregado correctamente",
    });

  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error);

    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}