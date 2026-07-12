import { NextResponse } from "next/server";
import { connectDB } from "@/connectDB";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PROYECTOS_VALIDOS = [
  "Hamburguesas Fátima",
  "Bi Ne Bianni",
];

/*
 * Funciona si connectDB devuelve:
 * - Un Client normal de PostgreSQL.
 * - Un cliente obtenido desde Pool.
 * - Un Pool compartido.
 *
 * No cierra un Pool completo, porque eso puede causar:
 * "Connection terminated unexpectedly".
 */
async function liberarConexion(client) {
  if (!client) return;

  if (typeof client.release === "function") {
    client.release();
    return;
  }

  const nombreConstructor = String(
    client?.constructor?.name || "",
  ).toLowerCase();

  const esPool = nombreConstructor.includes("pool");

  if (!esPool && typeof client.end === "function") {
    await client.end();
  }
}

function respuestaSinCache(data, options = {}) {
  return NextResponse.json(data, {
    ...options,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      ...(options.headers || {}),
    },
  });
}

/* ======================================== */
/* OBTENER TODOS LOS COMENTARIOS VISIBLES   */
/* ======================================== */

export async function GET() {
  let client;

  try {
    client = await connectDB();

    const { rows } = await client.query(`
      SELECT
        id,
        id_usuario,
        nombre,
        empresa,
        proyecto,
        comentario,
        orden,
        visible,
        fecha_creacion
      FROM resenas
      WHERE visible = TRUE
      ORDER BY
        orden ASC NULLS LAST,
        fecha_creacion DESC,
        id DESC
    `);

    return respuestaSinCache(rows);
  } catch (error) {
    console.error("Error completo al obtener comentarios:", {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      constraint: error?.constraint,
      column: error?.column,
      table: error?.table,
      stack: error?.stack,
    });

    return respuestaSinCache(
      {
        error: "No se pudieron cargar los comentarios.",
      },
      { status: 500 },
    );
  } finally {
    try {
      await liberarConexion(client);
    } catch (error) {
      console.error("Error al liberar la conexión:", error);
    }
  }
}

/* ======================================== */
/* PUBLICAR UN COMENTARIO                   */
/* ======================================== */

export async function POST(request) {
  let client;

  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return respuestaSinCache(
        {
          error: "Los datos enviados no son válidos.",
        },
        { status: 400 },
      );
    }

    const idUsuarioRecibido = body?.id_usuario;

    let idUsuario = null;

    if (
      idUsuarioRecibido !== null &&
      idUsuarioRecibido !== undefined &&
      idUsuarioRecibido !== ""
    ) {
      idUsuario = Number(idUsuarioRecibido);
    }

    const nombre = String(body?.nombre || "").trim();
    const empresa = String(body?.empresa || "").trim();
    const proyecto = String(body?.proyecto || "").trim();
    const comentario = String(body?.comentario || "").trim();

    /* Validación del usuario */

    if (
      !idUsuario ||
      !Number.isInteger(idUsuario) ||
      idUsuario <= 0
    ) {
      return respuestaSinCache(
        {
          error:
            "No se pudo identificar tu cuenta. Cierra sesión e inicia nuevamente.",
        },
        { status: 401 },
      );
    }

    /* Validación del nombre */

    if (!nombre) {
      return respuestaSinCache(
        {
          error: "No se pudo obtener el nombre de tu cuenta.",
        },
        { status: 400 },
      );
    }

    if (nombre.length > 100) {
      return respuestaSinCache(
        {
          error: "El nombre no puede superar los 100 caracteres.",
        },
        { status: 400 },
      );
    }

    /* Validación obligatoria del proyecto */

    if (!proyecto) {
      return respuestaSinCache(
        {
          error: "Debes elegir el proyecto que quieres comentar.",
        },
        { status: 400 },
      );
    }

    if (!PROYECTOS_VALIDOS.includes(proyecto)) {
      return respuestaSinCache(
        {
          error: "El proyecto seleccionado no es válido.",
        },
        { status: 400 },
      );
    }

    /* Validación del comentario */

    if (comentario.length < 10) {
      return respuestaSinCache(
        {
          error: "El comentario debe tener al menos 10 caracteres.",
        },
        { status: 400 },
      );
    }

    if (comentario.length > 2000) {
      return respuestaSinCache(
        {
          error: "El comentario no puede superar los 2000 caracteres.",
        },
        { status: 400 },
      );
    }

    if (empresa.length > 100) {
      return respuestaSinCache(
        {
          error: "El nombre de la empresa es demasiado largo.",
        },
        { status: 400 },
      );
    }

    client = await connectDB();

    /*
     * No se busca un comentario anterior.
     * No existe ON CONFLICT.
     * Cada envío crea un comentario nuevo aunque sea:
     * - Del mismo usuario.
     * - Del mismo proyecto.
     * - El mismo día.
     */

    const { rows } = await client.query(
      `
        INSERT INTO resenas (
          id_usuario,
          nombre,
          empresa,
          proyecto,
          comentario,
          orden,
          visible
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          0,
          TRUE
        )
        RETURNING
          id,
          id_usuario,
          nombre,
          empresa,
          proyecto,
          comentario,
          orden,
          visible,
          fecha_creacion
      `,
      [
        idUsuario,
        nombre,
        empresa || null,
        proyecto,
        comentario,
      ],
    );

    return respuestaSinCache(rows[0], {
      status: 201,
    });
  } catch (error) {
    console.error("Error completo al guardar comentario:", {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      constraint: error?.constraint,
      column: error?.column,
      table: error?.table,
      stack: error?.stack,
    });

    /*
     * 23503:
     * El id_usuario enviado no existe en usuarios.
     */
    if (error?.code === "23503") {
      return respuestaSinCache(
        {
          error:
            "Tu usuario ya no existe o la sesión contiene un identificador incorrecto. Inicia sesión nuevamente.",
        },
        { status: 400 },
      );
    }

    /*
     * 23502:
     * Falta un campo NOT NULL.
     */
    if (error?.code === "23502") {
      return respuestaSinCache(
        {
          error: error?.column
            ? `Falta el campo obligatorio: ${error.column}.`
            : "Falta un dato obligatorio.",
        },
        { status: 400 },
      );
    }

    /*
     * 22001:
     * Texto demasiado largo para varchar(100).
     */
    if (error?.code === "22001") {
      return respuestaSinCache(
        {
          error:
            "Uno de los datos enviados supera el tamaño permitido.",
        },
        { status: 400 },
      );
    }

    return respuestaSinCache(
      {
        error: "No se pudo publicar el comentario.",
      },
      { status: 500 },
    );
  } finally {
    try {
      await liberarConexion(client);
    } catch (error) {
      console.error("Error al liberar la conexión:", error);
    }
  }
}