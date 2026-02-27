// src/connectDB.js
import { Client } from "@neondatabase/serverless";

export async function connectDB() {
  // Cada request crea un client nuevo (serverless-safe)
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    await client.connect();
    console.log("Database connected ✅");
    return client;
  } catch (err) {
    console.error("❌ DB connection error:", err);
    throw err;
  }
}