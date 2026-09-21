const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a PostgreSQL connection pool
// Configuration reads from .env or uses local fallback defaults
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'placement_tracker_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10, // Maximum number of clients in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 5000 // Return error after 5s if connection cannot be established
});

// Event listener for idle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

/**
 * Helper query wrapper with error handling and logging
 * @param {string} text - SQL query string
 * @param {Array} params - Parameterized query arguments
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('Database Query Error:', err.message, { text });
    throw err;
  }
};

module.exports = {
  pool,
  query
};
