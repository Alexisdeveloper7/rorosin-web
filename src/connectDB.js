import { Client } from "@neondatabase/serverless";

let client;

export async function connectDB() {
  if (!client) {
    client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    console.log("Database connected ✅");
  }
  return client;
}