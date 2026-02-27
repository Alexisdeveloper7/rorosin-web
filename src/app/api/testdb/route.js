// src/app/api/testdb/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../connectDB.js";

export async function GET(req) {
  let client;
  try {
    client = await connectDB();
    const result = await client.query("SELECT 1 AS test"); // query simple
    return NextResponse.json({ success: true, test: result.rows[0] });
  } catch (err) {
    console.error("❌ ERROR TEST DB:", err);
    return NextResponse.json({ success: false, message: "DB error", error: err.message });
  } finally {
    if (client) await client.end();
  }
}