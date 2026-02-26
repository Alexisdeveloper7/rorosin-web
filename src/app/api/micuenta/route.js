import { NextResponse } from "next/server";
import { connectDB } from "../../../connectDB.js";

// --- GET ---
export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID requerido" }, { status: 400 });
    }

    const db = await connectDB();

    const result = await db.query(
      `SELECT 
        id,
        usuario,
        ciudad,
        estado,
        rol,
        fecha_creacion
      FROM usuarios
      WHERE id = $1`,
      [id]
    );

    await db.end();

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, usuario: result.rows[0] });

  } catch (error) {
    console.error("Error API micuenta:", error);
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}

// --- PUT corregido para usuario, estado y ciudad ---
export async function PUT(req) {
  try {
    const { id, usuario, estado, ciudad } = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID requerido" }, { status: 400 });
    }

    // Si no hay campos para actualizar
    if (!usuario && !estado && !ciudad) {
      return NextResponse.json({ ok: false, message: "No hay campos para actualizar" }, { status: 400 });
    }

    const db = await connectDB();

    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let index = 1;

    if (usuario) {
      campos.push(`usuario = $${index}`);
      valores.push(usuario);
      index++;
    }
    if (estado) {
      campos.push(`estado = $${index}`);
      valores.push(estado);
      index++;
    }
    if (ciudad) {
      campos.push(`ciudad = $${index}`);
      valores.push(ciudad);
      index++;
    }

    // Agregar id al final
    valores.push(id);

    const query = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = $${index}`;
    await db.query(query, valores);

    await db.end();

    return NextResponse.json({ ok: true, message: "Usuario actualizado" });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}