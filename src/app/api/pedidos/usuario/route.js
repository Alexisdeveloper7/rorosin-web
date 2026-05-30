import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
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

    // 📦 PEDIDOS
    const pedidosResult = await client.query(
      `
      SELECT id, fecha, total
      FROM pedidos
      WHERE id_usuario = $1
      ORDER BY fecha DESC
      `,
      [usuarioId]
    );

    const pedidos = pedidosResult.rows || [];

    if (pedidos.length === 0) {
      return NextResponse.json({
        success: true,
        pedidos: [],
      });
    }

    // ⏰ FECHA SIN FORMATEAR (FIX CLAVE)
    const pedidosFormateados = pedidos.map((p) => ({
      id: p.id,

      // 🔥 IMPORTANTE: dejar RAW para frontend
      fecha: p.fecha ? new Date(p.fecha).toISOString() : null,

      total: Number(p.total || 0),
      items: [],
    }));

    const pedidoIds = pedidos.map((p) => p.id);

    let itemsResult = { rows: [] };

    // 📦 ITEMS
    if (pedidoIds.length > 0) {
      itemsResult = await client.query(
        `
        SELECT
          id,
          id_pedido,
          id_producto,
          nombre_producto,
          cantidad,
          precio,
          imagen
        FROM pedido_items
        WHERE id_pedido = ANY($1::int[])
        ORDER BY id ASC
        `,
        [pedidoIds]
      );
    }

    // 🧠 AGRUPAR ITEMS
    const itemsPorPedido = {};

    for (const item of itemsResult.rows) {
      if (!itemsPorPedido[item.id_pedido]) {
        itemsPorPedido[item.id_pedido] = [];
      }

      itemsPorPedido[item.id_pedido].push({
        id: item.id,
        id_producto: item.id_producto,
        nombre_producto: item.nombre_producto,
        cantidad: Number(item.cantidad || 0),
        precio: Number(item.precio || 0),
        imagen: item.imagen || null,
      });
    }

    // 🔗 ASIGNAR ITEMS
    for (const pedido of pedidosFormateados) {
      pedido.items = itemsPorPedido[pedido.id] || [];
    }

    return NextResponse.json({
      success: true,
      pedidos: pedidosFormateados,
    });

  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener pedidos",
      },
      { status: 500 }
    );

  } finally {
    if (client) await client.end();
  }
}