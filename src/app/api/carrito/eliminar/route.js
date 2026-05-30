import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const client = await connectDB();

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

    const rawBody = await req.text();
    const body = rawBody ? JSON.parse(rawBody) : {};
    const { idItem } = body;

    if (!idItem) {
      return NextResponse.json(
        { success: false, message: "ID requerido" },
        { status: 400 }
      );
    }

    // 🔒 verificar que el item pertenece al usuario
    const verify = await client.query(
      `
      SELECT ci.id_item
      FROM carrito_items ci
      JOIN carritos c ON c.id_carrito = ci.id_carrito
      WHERE ci.id_item = $1 AND c.id_usuario = $2
      `,
      [idItem, usuarioId]
    );

    if (verify.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Item no encontrado" },
        { status: 404 }
      );
    }

    // 🗑 eliminar item
    await client.query(
      `
      DELETE FROM carrito_items
      WHERE id_item = $1
      `,
      [idItem]
    );

    return NextResponse.json({
      success: true,
      message: "Item eliminado correctamente",
    });

  } catch (error) {
    console.error("❌ Error al eliminar item:", error);

    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}