import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializar tabla si no existe
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_data (
        id text primary key,
        data jsonb
      );
    `);
    console.log("Database initialized");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}
initDb();

// Endpoints
app.get('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT data FROM app_data WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json({ data: result.rows[0].data });
    } else {
      res.json({ data: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    await pool.query(
      `INSERT INTO app_data (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [id, JSON.stringify(data)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
});
