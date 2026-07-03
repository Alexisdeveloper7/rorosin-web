import { NextResponse } from "next/server";
import { connectDB } from "@/connectDB";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let client;

  try {
    client = await connectDB();

    const { rows } = await client.query(`
      SELECT
        id,
        nombre,
        empresa,
        proyecto,
        comentario,
        fecha_creacion
      FROM resenas
      WHERE visible = TRUE
      ORDER BY orden ASC, fecha_creacion DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);

    return NextResponse.json(
      { error: "Error al obtener reseñas" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function POST(request) {
  let client;

  try {
    const body = await request.json();

    const idUsuario = body.id_usuario ? Number(body.id_usuario) : null;
    const nombre = String(body.nombre || "").trim();
    const empresa = String(body.empresa || "").trim();
    const proyecto = String(body.proyecto || "").trim();
    const comentario = String(body.comentario || "").trim();

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (comentario.length < 10) {
      return NextResponse.json(
        { error: "La reseña debe tener al menos 10 caracteres" },
        { status: 400 }
      );
    }

    client = await connectDB();

    const { rows } = await client.query(
      `
      INSERT INTO resenas (
        id_usuario,
        nombre,
        empresa,
        proyecto,
        comentario,
        visible
      )
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING
        id,
        nombre,
        empresa,
        proyecto,
        comentario,
        fecha_creacion
      `,
      [
        idUsuario,
        nombre,
        empresa || null,
        proyecto || null,
        comentario,
      ]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error al guardar reseña:", error);

    return NextResponse.json(
      { error: "Error al guardar reseña" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}