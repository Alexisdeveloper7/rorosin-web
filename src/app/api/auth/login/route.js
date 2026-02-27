import { connectDB } from "../../../../connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await connectDB(); // singleton
    const { usuario, contrasena } = await req.json();

    if (!usuario || !contrasena) {
      return NextResponse.json({ success: false, message: "Datos incompletos" }, { status: 400 });
    }

    const result = await client.query(
      "SELECT id, usuario, contrasena FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(contrasena, user.contrasena);

    if (!ok) {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 });
    }

    // Crear token JWT
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Respuesta con cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, usuario: user.usuario }
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error) {
    console.error("❌ Error login:", error);
    return NextResponse.json({ success: false, message: "Error en login" }, { status: 500 });
  }
}