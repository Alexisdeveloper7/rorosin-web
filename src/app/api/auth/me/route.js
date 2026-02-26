import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../connectDB.js";

const SECRET = process.env.JWT_SECRET || "clave_super_segura";

export async function GET(req) {
  let client;

  try {
    // Leer cookie manualmente (App Router)
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar JWT
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );
    }

    client = await connectDB();

    const result = await client.query(
      `SELECT id, usuario
       FROM usuarios
       WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuario no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error("❌ ERROR AUTH ME:", err);
    return NextResponse.json(
      { success: false, message: "Error del servidor" },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}
