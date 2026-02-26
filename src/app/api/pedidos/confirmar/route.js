import { connectDB } from "../../../../connectDB.js";
import { NextResponse } from "next/server";

// Función para obtener la fecha/hora exacta en CDT (Guadalajara)
function getFechaCDT() {
  const fecha = new Date();
  const fechaLocal = new Date(fecha.toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
  return fechaLocal;
}

export async function POST(req) {
  let client;

  try {
    client = await connectDB();
    const { items, usuarioId } = await req.json();

    if (!usuarioId) {
      return NextResponse.json({ success: false, message: "Usuario no identificado" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Carrito vacío" });
    }

    await client.query("BEGIN");

    // Calcular total
    let total = 0;
    for (const [index, item] of items.entries()) {
      if (!item.id_producto || !item.nombre_producto || !item.cantidad || item.precio === undefined) {
        throw new Error(`Item inválido en posición ${index}`);
      }
      const cantidad = parseInt(item.cantidad);
      const precio = parseFloat(item.precio);
      if (isNaN(cantidad) || isNaN(precio)) throw new Error(`Cantidad o precio inválido en posición ${index}`);
      total += cantidad * precio;
    }

    const fechaActual = getFechaCDT();

    // Insertar pedido
    const resPedido = await client.query(
      "INSERT INTO pedidos(id_usuario, total, fecha) VALUES ($1, $2, $3) RETURNING id",
      [usuarioId, total, fechaActual]
    );
    const pedidoId = resPedido.rows[0].id;

    // Insertar items del pedido
    const insertItemText = `
      INSERT INTO pedido_items(id_pedido, id_producto, nombre_producto, cantidad, precio)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const item of items) {
      await client.query(insertItemText, [
        pedidoId,
        item.id_producto,
        item.nombre_producto,
        parseInt(item.cantidad),
        parseFloat(item.precio),
      ]);
    }

    // Vaciar carrito
    await client.query("DELETE FROM carritos WHERE id_usuario = $1", [usuarioId]);

    await client.query("COMMIT");

    // ✅ Devuelve siempre success: true
    return NextResponse.json({
      success: true,
      message: "✅ Pedido realizado correctamente",
      pedido: {
        id: pedidoId,
        fecha: fechaActual.toISOString(),
        items,
      },
    });

  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("❌ Error al confirmar pedido:", error);

    // Devuelve siempre success: false sin depender de res.ok
    return NextResponse.json({
      success: false,
      message: error.message || "❌ Error al confirmar pedido",
    });
  } finally {
    if (client) await client.end();
  }
}