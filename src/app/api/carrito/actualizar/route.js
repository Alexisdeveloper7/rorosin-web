import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  let client;

  try {
    client = await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.id;

    const { idItem, cantidad } = await req.json();

    // ✅ Validación correcta
    if (!idItem || cantidad === undefined) {
      return NextResponse.json(
        { success: false, message: "Datos incompletos" },
        { status: 400 }
      );
    }

    if (cantidad < 1) {
      return NextResponse.json(
        { success: false, message: "Cantidad inválida" },
        { status: 400 }
      );
    }

    const verifyResult = await client.query(
      `
      SELECT ic.id_item
      FROM items_carrito ic
      JOIN carritos c ON c.id_carrito = ic.id_carrito
      WHERE ic.id_item = $1 AND c.id_usuario = $2
      `,
      [idItem, usuarioId]
    );

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Item no encontrado" },
        { status: 404 }
      );
    }

    await client.query(
      `
      UPDATE items_carrito
      SET cantidad = $1
      WHERE id_item = $2
      `,
      [cantidad, idItem]
    );

    return NextResponse.json({
      success: true,
      message: "Cantidad actualizada correctamente",
    });

  } catch (error) {
    console.error("❌ Error al actualizar cantidad:", error);

    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}