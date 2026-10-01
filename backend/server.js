const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, query } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON
app.use(express.json());


// =====================================================
// 1. General API Health Check
// =====================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'College Placement Tracker API is running',
    timestamp: new Date().toISOString()
  });
});


// =====================================================
// 2. Database Health Check
// =====================================================

app.get('/api/health/db', async (req, res) => {
  try {
    const startTime = Date.now();

    const dbResult = await query(
      'SELECT 1 + 1 AS test_sum, NOW() AS server_time;'
    );

    const latencyMs = Date.now() - startTime;

    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tableNames = tablesResult.rows.map(
      row => row.table_name
    );

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


// =====================================================
// 3. GET ALL APPLICATIONS
// =====================================================

app.get('/api/applications', async (req, res) => {
  try {
    const result = await query(`
      SELECT *
      FROM applications
      ORDER BY created_at DESC;
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error('Error fetching applications:', err);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch applications',
      error: err.message
    });
  }
});


// =====================================================
// 4. ADD APPLICATION
// =====================================================

app.post('/api/applications', async (req, res) => {
  try {
    const {
      company_name,
      role,
      application_date,
      status
    } = req.body;

    if (!company_name || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Company name and role are required'
      });
    }

    const result = await query(`
      INSERT INTO applications
        (company_name, role, application_date, status)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
    `, [
      company_name,
      role,
      application_date || new Date(),
      status || 'Applied'
    ]);

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Error adding application:', err);

    res.status(500).json({
      status: 'error',
      message: 'Failed to add application',
      error: err.message
    });
  }
});


// =====================================================
// 5. DELETE APPLICATION
// =====================================================

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      DELETE FROM applications
      WHERE id = $1
      RETURNING *;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Application deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting application:', err);

    res.status(500).json({
      status: 'error',
      message: 'Failed to delete application',
      error: err.message
    });
  }
});


// =====================================================
// 6. ROOT API ENDPOINT
// =====================================================

app.get('/', (req, res) => {
  res.send('Welcome to College Placement Tracker API Server');
});


// =====================================================
// 7. GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});


// =====================================================
// 8. START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`
  );
});