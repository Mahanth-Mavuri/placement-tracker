import React, { useState, useEffect } from 'react';

function App() {
  const [apiHealth, setApiHealth] = useState({
    status: 'loading',
    message: 'Checking connection to backend server...',
    timestamp: null
  });

  useEffect(() => {
    // Fetch backend healthcheck API endpoint on mount
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
          <li><a href="#docs" className="nav-link">Docs</a></li>
        </ul>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Backend API Connection Health Status Card */}
        <section className="status-card">
          <div>
            <h3>Backend Server Status</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {apiHealth.message}
            </p>
            {apiHealth.timestamp && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Server Time: {new Date(apiHealth.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div>
            {apiHealth.status === 'connected' ? (
              <span className="status-badge connected">
                <span className="pulse-dot"></span> Backend Connected (Port 5000)
              </span>
            ) : apiHealth.status === 'loading' ? (
              <span className="status-badge" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                Connecting...
              </span>
            ) : (
              <span className="status-badge disconnected">
                Offline / Failed
              </span>
            )}
          </div>
        </section>

        {/* Phase 1 Overview Hero Section */}
        <section className="hero-card">
          <h1 className="hero-title">Phase 1 Setup Complete! 🚀</h1>
          <p className="hero-subtitle">
            The frontend React application and backend Express REST API server are initialized and successfully communicating.
          </p>
        </section>

        {/* System Features Preview */}
        <h2>System Architecture Modules</h2>
        <div className="grid">
          <div className="card">
            <div className="card-title">🔐 User Authentication</div>
            <div className="card-desc">JWT authentication, password hashing with bcryptjs, protected routes, and session validation.</div>
          </div>
          <div className="card">
            <div className="card-title">📊 Application Tracker</div>
            <div className="card-desc">Full CRUD operations for tracking job status (Applied, OA, Technical Round, Offer, Rejection).</div>
          </div>
          <div className="card">
            <div className="card-title">📅 Interview & OA Logger</div>
            <div className="card-desc">Log interview rounds (Coding, HR, System Design) with scheduled dates and notes.</div>
          </div>
          <div className="card">
            <div className="card-title">📈 Analytics & Statistics</div>
            <div className="card-desc">Real-time metrics on application-to-interview conversion rates and monthly statistics.</div>
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
