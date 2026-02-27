import { connectDB } from "@/connectDB.js";

// GET: obtener hora actual
export async function GET() {
  let client;
  try {
    client = await connectDB();
    const res = await client.query("SELECT NOW()");
    await client.end();
    return new Response(JSON.stringify({ now: res.rows[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (client) await client.end();
    console.error("Error DB GET:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST: insertar un nombre de prueba
export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Falta el campo 'name'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    client = await connectDB();

    // Tabla 'test' debe existir: CREATE TABLE test (id SERIAL PRIMARY KEY, name TEXT);
    const res = await client.query(
      "INSERT INTO test(name) VALUES($1) RETURNING *",
      [name]
    );

    await client.end();
    return new Response(JSON.stringify({ inserted: res.rows[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (client) await client.end();
    console.error("Error DB POST:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}