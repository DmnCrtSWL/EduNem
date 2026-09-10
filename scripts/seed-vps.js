import { mockGroups } from '../src/data/mockGroups.js';
import { defaultMonthlyData } from '../src/data/mockAIPlans.js';

const API_URL = process.env.API_URL || 'http://localhost:9090';
const DATABASE_URL = process.env.DATABASE_URL;

async function seedViaHttp() {
  console.log(`📡 Intentando sembrar datos vía API HTTP en ${API_URL}...`);
  try {
    const resGroups = await fetch(`${API_URL}/api/data/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: mockGroups })
    });
    if (!resGroups.ok) throw new Error(`HTTP error ${resGroups.status} en groups`);

    const resPlans = await fetch(`${API_URL}/api/data/monthlyPlans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: defaultMonthlyData })
    });
    if (!resPlans.ok) throw new Error(`HTTP error ${resPlans.status} en monthlyPlans`);

    console.log(`✅ Base de datos sembrada con éxito vía API HTTP:`);
    console.log(`   - ${mockGroups.length} asignaturas distribuidas en 6 grupos (1°A - 3°B).`);
    console.log(`   - 30 alumnos por salón con Ficha 360° inter-docente.`);
    console.log(`   - Planeaciones mensuales NEM iniciales.`);
    return true;
  } catch (err) {
    console.warn(`⚠️ No se pudo conectar a la API HTTP (${err.message}).`);
    return false;
  }
}

async function seedViaPostgres() {
  if (!DATABASE_URL) {
    console.log(`ℹ️ Variable DATABASE_URL no provista. Omitiendo conexión directa a Postgres.`);
    return false;
  }

  console.log(`🐘 Conectando directamente a PostgreSQL...`);
  try {
    const pkg = await import('pg');
    const { Client } = pkg.default;
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS app_data (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);

    await client.query(
      `INSERT INTO app_data (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      ['groups', JSON.stringify(mockGroups)]
    );

    await client.query(
      `INSERT INTO app_data (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      ['monthlyPlans', JSON.stringify(defaultMonthlyData)]
    );

    await client.end();
    console.log(`✅ Base de datos sembrada con éxito directamente en PostgreSQL.`);
    return true;
  } catch (err) {
    console.error(`❌ Error conectando a PostgreSQL:`, err.message);
    return false;
  }
}

async function main() {
  const httpSuccess = await seedViaHttp();
  if (!httpSuccess) {
    const pgSuccess = await seedViaPostgres();
    if (!pgSuccess) {
      console.log(`\n💡 Para sembrar en el VPS puedes ejecutar:`);
      console.log(`   docker compose exec backend node -e "const { Pool } = require('pg'); ..."`);
      console.log(`   o definir API_URL=http://74.208.149.57/edunem node scripts/seed-vps.js`);
    }
  }
}

main();
