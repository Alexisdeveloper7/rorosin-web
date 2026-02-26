import { connectDB } from './src/connectDB.js';

async function pingDB() {
  try {
    const client = await connectDB();
    await client.query('SELECT 1'); // ping simple
    console.log('Ping OK');
  } catch (err) {
    console.error('DB ping failed', err);
  }
}

// 4 minutos 50 segundos = 290000 ms
pingDB(); // ping inicial
setInterval(pingDB, 290000);
