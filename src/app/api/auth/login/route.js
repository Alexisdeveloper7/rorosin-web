import { connectDB } from "../../../../connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  let client;

  try {
    client = await connectDB();
    const { usuario, contrasena } = await req.json();

    // Validación de datos
    if (!usuario || !contrasena) {
      return NextResponse.json(
        { success: false, message: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Buscar usuario en DB
    const result = await client.query(
      "SELECT id, usuario, contrasena FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Comparar contraseña
    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respuesta con cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        usuario: user.usuario
      }
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });

    return response;

  } catch (error) {
    console.error("❌ Error login:", error);
    return NextResponse.json(
      { success: false, message: "Error en login" },
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}