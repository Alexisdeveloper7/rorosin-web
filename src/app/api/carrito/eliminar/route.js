import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;

  try {
    client = await connectDB();

    // 🔐 Obtener token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    // 🔓 Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.id;

    // ⚠️ Leer body de forma segura (evita error JSON vacío)
    const rawBody = await req.text();
    const body = rawBody ? JSON.parse(rawBody) : {};
    const { idItem } = body;

    if (!idItem) {
      return NextResponse.json(
        { success: false, message: "ID requerido" },
        { status: 400 }
      );
    }

    // 🔒 Verificar que el item pertenezca al usuario
    const verify = await client.query(
      `
      SELECT ic.id_item
      FROM items_carrito ic
      JOIN carritos c ON c.id_carrito = ic.id_carrito
      WHERE ic.id_item = $1 AND c.id_usuario = $2
      `,
      [idItem, usuarioId]
    );

    if (verify.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Item no encontrado" },
        { status: 404 }
      );
    }

    // 🗑 Eliminar item
    await client.query(
      `DELETE FROM items_carrito WHERE id_item = $1`,
      [idItem]
    );

    return NextResponse.json({
      success: true,
      message: "Item eliminado correctamente",
    });

  } catch (error) {
    console.error("❌ Error eliminar item:", error);

    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}