const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, query } = require('./config/db');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for cross-origin requests from React Frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Express built-in middleware to parse incoming JSON payloads
app.use(express.json());

// 1. General API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'College Placement Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// 2. Database Health Check & Schema Status Endpoint
app.get('/api/health/db', async (req, res) => {
  try {
    const startTime = Date.now();
    // Test basic query execution
    const dbResult = await query('SELECT 1 + 1 AS test_sum, NOW() AS server_time;');
    const latencyMs = Date.now() - startTime;

    // Check table existence in public schema
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = tablesResult.rows.map(row => row.table_name);

    res.status(200).json({
      status: 'connected',
      message: 'PostgreSQL Database connected successfully',
      latencyMs: `${latencyMs}ms`,
      postgresTime: dbResult.rows[0].server_time,
      database: process.env.DB_NAME || 'placement_tracker_db',
      tables: tableNames,
      tableCount: tableNames.length
    });
  } catch (err) {
    res.status(503).json({
      status: 'disconnected',
      message: 'PostgreSQL Database Connection Failed',
      error: err.message,
      hint: 'Ensure PostgreSQL service is running locally on port 5432 and database credentials match backend/.env'
    });
  }
});

// Root API Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to College Placement Tracker API Server');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
