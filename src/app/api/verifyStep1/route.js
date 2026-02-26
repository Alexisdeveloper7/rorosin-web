// /app/api/verifyStep1/route.js
import { connectDB } from "../../../connectDB.js"; // Ajusta la ruta si hace falta

export async function POST(req) {
  let client;
  try {
    client = await connectDB();
    const { correo, usuario } = await req.json();

    // Validación básica en el servidor
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usuario && !correo) {
      return new Response(JSON.stringify({
        ok: false,
        status: "infoIncompleta",
        message: "Faltan campos obligatorios"
      }), { status: 400 });
    }

    // Validar formato email si viene
    if (correo && !emailRegex.test(correo)) {
      return new Response(JSON.stringify({
        ok: false,
        status: "correoInvalido",
        message: "Formato de correo inválido"
      }), { status: 200 });
    }

    // Validar longitud mínima de usuario si viene
    if (usuario && usuario.length < 4) {
      return new Response(JSON.stringify({
        ok: false,
        status: "usuarioInvalido",
        message: "El usuario debe tener mínimo 4 caracteres"
      }), { status: 200 });
    }

    // Si se envían ambos o uno: verificar en BD
    // Verificar usuario duplicado
    if (usuario) {
      const resUser = await client.query(
        "SELECT id_usuario FROM usuarios WHERE nombre_usuario = $1 LIMIT 1",
        [usuario]
      );
      if (resUser.rows.length > 0) {
        return new Response(JSON.stringify({
          ok: false,
          status: "usuarioExiste",
          message: "Este usuario ya está en uso"
        }), { status: 200 });
      }
    }

    // Verificar correo duplicado
    if (correo) {
      const resEmail = await client.query(
        "SELECT id_usuario FROM usuarios WHERE correo_electronico = $1 LIMIT 1",
        [correo]
      );
      if (resEmail.rows.length > 0) {
        return new Response(JSON.stringify({
          ok: false,
          status: "correoExiste",
          message: "Este correo ya está enlazado a otra cuenta"
        }), { status: 200 });
      }
    }

    // Verificar si hay código activo para ese correo (no generar nada aquí)
    if (correo) {
      const resCodigo = await client.query(
        "SELECT id_codigo FROM codigos_verificacion WHERE correo = $1 AND expiracion > NOW() LIMIT 1",
        [correo]
      );

      if (resCodigo.rows.length > 0) {
        // Si hay un código activo, devolvemos ok:true para que el frontend sepa que existe
        return new Response(JSON.stringify({
          ok: true,
          status: "codigoActivo",
          message: "Ya hay un código activo para este correo"
        }), { status: 200 });
      }
    }

    // Si llega hasta aquí, todo está bien (usuario y correo disponibles, sin código activo)
    return new Response(JSON.stringify({
      ok: true,
      status: "todoCorrecto",
      message: "Correo y usuario disponibles"
    }), { status: 200 });

  } catch (err) {
    console.error("Error verifyStep1:", err);
    return new Response(JSON.stringify({
      ok: false,
      status: "errorInterno",
      message: "Error del servidor"
    }), { status: 500 });
  } finally {
    if (client) {
      try { await client.end(); } catch (e) { /* noop */ }
    }
  }
}
