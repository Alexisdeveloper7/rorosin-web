import { connectDB } from "../../../../connectDB.js";
import { NextResponse } from "next/server";

// GET pedidos de un usuario
export async function GET(req) {
  let client;

  try {
    client = await connectDB();

    // Obtener usuarioId desde query params
    const { searchParams } = new URL(req.url);
    const usuarioId = searchParams.get("usuarioId");

    if (!usuarioId || isNaN(usuarioId)) {
      return NextResponse.json(
        { success: false, message: "Usuario no identificado o inválido" },
        { status: 400 }
      );
    }

    // 🔹 Traer pedidos del usuario ordenados por fecha descendente
    const resPedidos = await client.query(
      `SELECT id, fecha, total, estado
       FROM pedidos
       WHERE id_usuario = $1
       ORDER BY fecha DESC`,
      [parseInt(usuarioId)]
    );

    const pedidos = resPedidos.rows;

    if (pedidos.length === 0) {
      return NextResponse.json({ success: true, pedidos: [] });
    }

    // 🔹 Traer items de todos los pedidos en una sola query
    const pedidoIds = pedidos.map(p => p.id);
    const resItems = await client.query(
      `SELECT id_pedido, id_producto, nombre_producto, cantidad, precio
       FROM pedido_items
       WHERE id_pedido = ANY($1::int[])`,
      [pedidoIds]
    );

    // Agrupar items por pedido
    const itemsPorPedido = {};
    for (let item of resItems.rows) {
      if (!itemsPorPedido[item.id_pedido]) itemsPorPedido[item.id_pedido] = [];
      itemsPorPedido[item.id_pedido].push({
        id_producto: item.id_producto,
        nombre_producto: item.nombre_producto,
        cantidad: item.cantidad,
        precio: item.precio,
      });
    }

    // Asignar items a cada pedido
    for (let pedido of pedidos) {
      pedido.items = itemsPorPedido[pedido.id] || [];
    }

    return NextResponse.json({ success: true, pedidos });

  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error al obtener pedidos" },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}