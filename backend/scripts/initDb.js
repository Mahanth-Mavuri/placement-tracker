const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initDatabase() {
  console.log('🔄 Checking database connection and initializing schema...');
  try {
    // Read schema.sql file
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute Schema DDL
    await pool.query(schemaSql);
    console.log('✅ PostgreSQL Schema initialized successfully (Tables & Indexes verified).');

    // Check if seed argument passed or SEED_DB env variable is set
    if (process.argv.includes('--seed') || process.env.SEED_DB === 'true') {
      const seedPath = path.join(__dirname, '../../database/seed.sql');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedSql);
      console.log('🌱 Sample Seed Data inserted successfully.');
    }
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err.message);
  } finally {
    // If run directly from CLI script, release pool
    if (require.main === module) {
      await pool.end();
    }
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
