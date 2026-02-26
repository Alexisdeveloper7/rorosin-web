import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  let client;

  try {
    client = await connectDB();

    const { productoId, variacionId, cantidad } = await req.json();

    if (!productoId || !variacionId || !cantidad) {
      return NextResponse.json(
        { success: false, message: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Obtener token desde cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.id;

    // 1️⃣ Crear carrito si no existe
    const carritoResult = await client.query(
      `INSERT INTO carritos (id_usuario)
       VALUES ($1)
       ON CONFLICT (id_usuario) DO NOTHING
       RETURNING id_carrito`,
      [usuarioId]
    );

    let carritoId;

    if (carritoResult.rows.length > 0) {
      carritoId = carritoResult.rows[0].id_carrito;
    } else {
      const existingCarrito = await client.query(
        "SELECT id_carrito FROM carritos WHERE id_usuario = $1",
        [usuarioId]
      );
      carritoId = existingCarrito.rows[0].id_carrito;
    }

    // 2️⃣ Insertar o sumar producto automáticamente
    await client.query(
      `INSERT INTO items_carrito
       (id_carrito, id_producto, id_variacion, cantidad)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id_carrito, id_producto, id_variacion)
       DO UPDATE
       SET cantidad = items_carrito.cantidad + EXCLUDED.cantidad`,
      [carritoId, productoId, variacionId, cantidad]
    );

    // ✅ Retornamos JSON limpio, sin alert
    return NextResponse.json({
      success: true,
      message: "Producto agregado correctamente"
    });

  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}