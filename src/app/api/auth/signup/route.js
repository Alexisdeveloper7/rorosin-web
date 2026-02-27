import { connectDB } from "../../../../connectDB.js";
import bcrypt from "bcryptjs";

export async function POST(req) {
  let client;

  try {
    client = await connectDB();
    let { usuario, contrasena } = await req.json();

    // 🔹 Validar inputs
    if (!usuario || !contrasena) {
      return new Response(
        JSON.stringify({
          success: false,
        }),
        { status: 400 }
      );
    }

    usuario = usuario.trim();
    contrasena = contrasena.trim();

    if (usuario.length > 50 || contrasena.length > 50) {
      return new Response(
        JSON.stringify({
          success: false,
        }),
        { status: 400 }
      );
    }

    // 🔹 Verificar si existe (insensible a mayúsculas)
    const existe = await client.query(
      "SELECT id FROM usuarios WHERE LOWER(usuario) = LOWER($1)",
      [usuario]
    );

    if (existe.rows.length > 0) {
      // ✅ No devolvemos mensaje, solo success: false
      return new Response(
        JSON.stringify({
          success: false,
        }),
        { status: 409 }
      );
    }

    // 🔹 Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // 🔹 Insertar usuario
    const result = await client.query(
      `INSERT INTO usuarios (usuario, contrasena)
       VALUES ($1, $2)
       RETURNING id, usuario`,
      [usuario, hash]
    );

    // 🔹 Retornar éxito y datos del usuario
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: result.rows[0].id,
          usuario: result.rows[0].usuario,
        },
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error en signup:", error);
    return new Response(
      JSON.stringify({
        success: false,
      }),
      { status: 500 }
    );
  } finally {
    if (client) await client.end();
  }
}