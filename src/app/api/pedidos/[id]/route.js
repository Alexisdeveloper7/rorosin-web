import { connectDB } from "../../../../connectDB.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  let client;

  try {
    console.log("🔥 ===== DELETE PEDIDO HIT =====");

    // 🔥 SACAR ID DIRECTO DE LA URL (EVITA BUGS DE params)
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const pedidoId = Number(segments[segments.length - 1]);

    console.log("📦 URL:", req.url);
    console.log("🧾 PEDIDO ID:", pedidoId);

    if (isNaN(pedidoId)) {
      console.log("❌ ID INVALIDO");
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    client = await connectDB();

    // 🔐 TOKEN
    const token = req.cookies.get("token")?.value;

    console.log("🍪 TOKEN:", token);

    if (!token) {
      console.log("❌ NO TOKEN");
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    // 🧠 JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🧠 DECODED:", decoded);
    } catch (err) {
      console.log("❌ JWT ERROR:", err.message);

      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );
    }

    const usuarioId = decoded.id;

    console.log("👤 USER ID:", usuarioId);
    console.log("📦 PEDIDO FINAL ID:", pedidoId);

    // 🔒 CHECK OWNER
    const check = await client.query(
      `
      SELECT id
      FROM pedidos
      WHERE id = $1 AND id_usuario = $2
      `,
      [pedidoId, usuarioId]
    );

    console.log("🔍 CHECK RESULT:", check.rows);

    if (check.rows.length === 0) {
      console.log("❌ NO AUTORIZADO O NO EXISTE");

      return NextResponse.json(
        { success: false, message: "No autorizado o no existe" },
        { status: 403 }
      );
    }

    // 🧱 TRANSACTION
    console.log("🧱 INICIANDO DELETE");

    await client.query("BEGIN");

    await client.query(
      `DELETE FROM pedido_items WHERE id_pedido = $1`,
      [pedidoId]
    );

    await client.query(
      `DELETE FROM pedidos WHERE id = $1`,
      [pedidoId]
    );

    await client.query("COMMIT");

    console.log("✅ PEDIDO ELIMINADO OK");

    return NextResponse.json({
      success: true,
      message: "Pedido cancelado correctamente",
    });

  } catch (error) {
    if (client) await client.query("ROLLBACK");

    console.log("💥 ERROR FULL:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al cancelar pedido",
      },
      { status: 500 }
    );

  } finally {
    if (client) await client.end();
    console.log("🔚 CONNECTION CLOSED");
  }
}