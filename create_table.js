import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:PamMartin1!2026@db.hkoeqoulboeglrxytpte.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_data (
        id text primary key,
        data jsonb
      );
    `);
    
    console.log('Table app_data created successfully!');
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    await client.end();
  }
}

run();
