const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const isProductionDatabase = !!process.env.DATABASE_URL;

const pool = new Pool(
  isProductionDatabase
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'placement_tracker_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      }
);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

const query = async (text, params) => {
  const start = Date.now();

  try {
    const res = await pool.query(text, params);

    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', {
        text,
        duration,
        rows: res.rowCount
      });
    }

    return res;
  } catch (err) {
    console.error('Database Query Error:', err.message);
    throw err;
  }
};

module.exports = {
  pool,
  query
};