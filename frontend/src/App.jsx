import React, { useState, useEffect } from 'react';

function App() {
  const [apiHealth, setApiHealth] = useState({
    status: 'loading',
    message: 'Checking connection to backend server...',
    timestamp: null
  });

  const [dbHealth, setDbHealth] = useState({
    status: 'loading',
    message: 'Checking PostgreSQL database connection...',
    database: null,
    tables: [],
    tableCount: 0
  });

  useEffect(() => {
    // 1. Fetch Backend API Health Status
    fetch('http://localhost:5000/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setApiHealth({
          status: 'connected',
          message: data.message,
          timestamp: data.timestamp
        });
      })
      .catch((err) => {
        console.error('API connection failed:', err);
        setApiHealth({
          status: 'error',
          message: 'Could not connect to Express Backend (http://localhost:5000)',
          timestamp: null
        });
      });

    // 2. Fetch PostgreSQL Database Health Status
    fetch('http://localhost:5000/api/health/db')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'connected') {
          setDbHealth({
            status: 'connected',
            message: data.message,
            database: data.database,
            tables: data.tables,
            tableCount: data.tableCount,
            latency: data.latencyMs
          });
        } else {
          setDbHealth({
            status: 'disconnected',
            message: data.message || 'Database connection failed',
            hint: data.hint,
            database: null,
            tables: [],
            tableCount: 0
          });
        }
      })
      .catch((err) => {
        setDbHealth({
          status: 'error',
          message: 'Unable to reach DB status endpoint',
          database: null,
          tables: [],
          tableCount: 0
        });
      });
  }, []);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">🎓</span>
          <span>College Placement Tracker</span>
        </div>
        <ul className="nav-links">
          <li><a href="#overview" className="nav-link active">Dashboard</a></li>
          <li><a href="#applications" className="nav-link">Applications</a></li>
          <li><a href="#interviews" className="nav-link">Interviews</a></li>
          <li><a href="#companies" className="nav-link">Companies</a></li>
          <li><a href="#schema" className="nav-link">Database Schema</a></li>
        </ul>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* System Health Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Express API Health Status Card */}
          <div className="status-card" style={{ marginBottom: 0 }}>
            <div>
              <h3>Express Server Status</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {apiHealth.message}
              </p>
              {apiHealth.timestamp && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  Server Time: {new Date(apiHealth.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div>
              {apiHealth.status === 'connected' ? (
                <span className="status-badge connected">
                  <span className="pulse-dot"></span> Port 5000 OK
                </span>
              ) : apiHealth.status === 'loading' ? (
                <span className="status-badge" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                  Checking...
                </span>
              ) : (
                <span className="status-badge disconnected">
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* PostgreSQL DB Health Status Card */}
          <div className="status-card" style={{ marginBottom: 0 }}>
            <div>
              <h3>PostgreSQL Database</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {dbHealth.message}
              </p>
              {dbHealth.status === 'connected' && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  DB: <strong>{dbHealth.database}</strong> ({dbHealth.tableCount} tables verified)
                </p>
              )}
              {dbHealth.status === 'disconnected' && dbHealth.hint && (
                <p style={{ color: 'var(--status-danger)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  💡 {dbHealth.hint}
                </p>
              )}
            </div>
            <div>
              {dbHealth.status === 'connected' ? (
                <span className="status-badge connected">
                  <span className="pulse-dot"></span> Postgres Ready
                </span>
              ) : dbHealth.status === 'loading' ? (
                <span className="status-badge" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                  Checking DB...
                </span>
              ) : (
                <span className="status-badge disconnected">
                  DB Offline / Ready to connect
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Phase 2 Hero Overview */}
        <section className="hero-card">
          <h1 className="hero-title">Phase 2: Relational Database Schema Designed! 🗄️</h1>
          <p className="hero-subtitle">
            PostgreSQL relational database schema defined with foreign keys, constraints, and indexes. Connected via backend <code>pg</code> connection pool.
          </p>
        </section>

        {/* Database Tables Blueprint */}
        <h2>Database Tables & Entity-Relationship Schema</h2>
        <div className="grid">
          <div className="card">
            <div className="card-title">👤 users</div>
            <div className="card-desc">
              Stores user profiles (Name, Email, Hashed Password, College, Graduation Year, Skills array, GitHub/LinkedIn links).
            </div>
          </div>

          <div className="card">
            <div className="card-title">🏢 companies</div>
            <div className="card-desc">
              Company profiles associated with users. Prevents duplicate entries with <code>UNIQUE(user_id, name)</code> constraint.
            </div>
          </div>

          <div className="card">
            <div className="card-title">📋 applications</div>
            <div className="card-desc">
              Core job applications with status tracking (<code>Interested</code>, <code>Applied</code>, <code>OA</code>, <code>Interview</code>, <code>Selected</code>, <code>Rejected</code>), deadlines, and salary details.
            </div>
          </div>

          <div className="card">
            <div className="card-title">🎙️ interviews</div>
            <div className="card-desc">
              Interview rounds (OA, Technical, Coding, System Design, HR) linked via Foreign Key to applications with result tracking.
            </div>
          </div>

          <div className="card">
            <div className="card-title">⏰ deadlines</div>
            <div className="card-desc">
              Upcoming test & application deadlines with completion flags and timestamp sorting.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        Placement Tracker &copy; 2026 — Designed for College Students & Portfolio Excellence
      </footer>
    </div>
  );
}

export default App;
