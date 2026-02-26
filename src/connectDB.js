import { Client } from "@neondatabase/serverless";
import 'dotenv/config';

export async function connectDB() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Database connected ✅");
  return client;
}
