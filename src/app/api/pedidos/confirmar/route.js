import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let client;

  try {
    client = await connectDB();

    // 🔐 TOKEN
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.id;

    // 📦 BODY
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Carrito vacío",
      });
    }

    await client.query("BEGIN");

    // 💰 TOTAL
    let total = 0;

    for (const [index, item] of items.entries()) {
      if (!item.id_producto || !item.nombre_producto || !item.cantidad) {
        throw new Error(`Item inválido en posición ${index}`);
      }

      const cantidad = Number(item.cantidad);
      const precio = Number(item.precio || 0);

      if (isNaN(cantidad) || isNaN(precio)) {
        throw new Error(`Datos inválidos en posición ${index}`);
      }

      total += cantidad * precio;
    }

    // ⏰ FECHA CORRECTA (FIX)
    const fechaActual = new Date();

    // 🧾 INSERT PEDIDO
    const pedidoRes = await client.query(
      `
      INSERT INTO pedidos (
        id_usuario,
        total,
        fecha
      )
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [usuarioId, total, fechaActual]
    );

    const pedidoId = pedidoRes.rows[0].id;

    // 📦 INSERT ITEMS
    for (const item of items) {
      await client.query(
        `
        INSERT INTO pedido_items (
          id_pedido,
          id_producto,
          nombre_producto,
          cantidad,
          precio,
          imagen
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          pedidoId,
          item.id_producto,
          item.nombre_producto,
          Number(item.cantidad),
          Number(item.precio || 0),
          item.imagen || item.imagen_url || null,
        ]
      );
    }

    // 🧹 LIMPIAR CARRITO
    const carritoRes = await client.query(
      `
      SELECT id_carrito
      FROM carritos
      WHERE id_usuario = $1
      `,
      [usuarioId]
    );

    if (carritoRes.rows.length > 0) {
      await client.query(
        `
        DELETE FROM carrito_items
        WHERE id_carrito = $1
        `,
        [carritoRes.rows[0].id_carrito]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Pedido realizado correctamente",
      pedido: {
        id: pedidoId,
        fecha: fechaActual,
      },
    });

  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error("❌ Error al confirmar pedido:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al confirmar pedido",
      },
      { status: 500 }
    );

  } finally {
    if (client) {
      await client.end();
    }
  }
}