import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const [activeSection, setActiveSection] = useState('overview');

  // Applications
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);

  const [applicationForm, setApplicationForm] = useState({
    company_name: '',
    role: '',
    application_date: '',
    status: 'Applied'
  });

  // ================= HEALTH CHECKS =================

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
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

    fetch(`${API_URL}/api/health/db`)
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
      .catch(() => {
        setDbHealth({
          status: 'error',
          message: 'Unable to reach DB status endpoint',
          database: null,
          tables: [],
          tableCount: 0
        });
      });

    loadApplications();
  }, []);

  // ================= APPLICATIONS =================

  const loadApplications = async () => {
    try {
      setLoadingApplications(true);

      const response = await fetch(`${API_URL}/api/applications`);

      if (!response.ok) {
        throw new Error('Failed to load applications');
      }

      const data = await response.json();

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleApplicationChange = (event) => {
    const { name, value } = event.target;

    setApplicationForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleAddApplication = async (event) => {
    event.preventDefault();

    if (!applicationForm.company_name.trim()) {
      alert('Please enter the company name.');
      return;
    }

    if (!applicationForm.role.trim()) {
      alert('Please enter the job role.');
      return;
    }

    try {
      setSavingApplication(true);

      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_name: applicationForm.company_name,
          role: applicationForm.role,
          application_date:
            applicationForm.application_date || null,
          status: applicationForm.status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add application');
      }

      setApplications((previous) => [data.application, ...previous]);

      setApplicationForm({
        company_name: '',
        role: '',
        application_date: '',
        status: 'Applied'
      });

      setShowApplicationForm(false);

      alert('Application added successfully!');
    } catch (error) {
      console.error('Error adding application:', error);
      alert(`Could not add application: ${error.message}`);
    } finally {
      setSavingApplication(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/applications/${id}`,
        {
          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete application');
      }

      setApplications((previous) =>
        previous.filter((application) => application.id !== id)
      );

      alert('Application deleted successfully!');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert(`Could not delete application: ${error.message}`);
    }
  };

  // ================= NAVIGATION =================

  const navigateTo = (section) => {
    setActiveSection(section);

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // ================= RENDER =================

  return (
    <div className="app-container">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">🎓</span>
          <span>College Placement Tracker</span>
        </div>

        <ul className="nav-links">

          <li>
            <button
              className={`nav-link ${
                activeSection === 'overview' ? 'active' : ''
              }`}
              onClick={() => navigateTo('overview')}
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${
                activeSection === 'applications' ? 'active' : ''
              }`}
              onClick={() => navigateTo('applications')}
            >
              Applications
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${
                activeSection === 'interviews' ? 'active' : ''
              }`}
              onClick={() => navigateTo('interviews')}
            >
              Interviews
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${
                activeSection === 'companies' ? 'active' : ''
              }`}
              onClick={() => navigateTo('companies')}
            >
              Companies
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${
                activeSection === 'schema' ? 'active' : ''
              }`}
              onClick={() => navigateTo('schema')}
            >
              Database Schema
            </button>
          </li>

        </ul>
      </header>

      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* ================= DASHBOARD ================= */}

        <section id="overview">

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >

            {/* Express */}

            <div
              className="status-card"
              style={{ marginBottom: 0 }}
            >

              <div>
                <h3>Express Server Status</h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    marginTop: '0.25rem'
                  }}
                >
                  {apiHealth.message}
                </p>

                {apiHealth.timestamp && (
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      marginTop: '0.2rem'
                    }}
                  >
                    Server Time:{' '}
                    {new Date(
                      apiHealth.timestamp
                    ).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <div>

                {apiHealth.status === 'connected' ? (
                  <span className="status-badge connected">
                    <span className="pulse-dot"></span>
                    Port 5000 OK
                  </span>
                ) : apiHealth.status === 'loading' ? (
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: '#334155',
                      color: '#94a3b8'
                    }}
                  >
                    Checking...
                  </span>
                ) : (
                  <span className="status-badge disconnected">
                    Offline
                  </span>
                )}

              </div>

            </div>

            {/* PostgreSQL */}

            <div
              className="status-card"
              style={{ marginBottom: 0 }}
            >

              <div>

                <h3>PostgreSQL Database</h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    marginTop: '0.25rem'
                  }}
                >
                  {dbHealth.message}
                </p>

                {dbHealth.status === 'connected' && (
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      marginTop: '0.2rem'
                    }}
                  >
                    DB: <strong>{dbHealth.database}</strong>{' '}
                    ({dbHealth.tableCount} tables verified)
                  </p>
                )}

              </div>

              <div>

                {dbHealth.status === 'connected' ? (
                  <span className="status-badge connected">
                    <span className="pulse-dot"></span>
                    Postgres Ready
                  </span>
                ) : dbHealth.status === 'loading' ? (
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: '#334155',
                      color: '#94a3b8'
                    }}
                  >
                    Checking DB...
                  </span>
                ) : (
                  <span className="status-badge disconnected">
                    DB Offline
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* Hero */}

          <section className="hero-card">

            <h1 className="hero-title">
              College Placement Tracker 🎓
            </h1>

            <p className="hero-subtitle">
              Track your placement applications, companies,
              interviews and deadlines in one place.
            </p>

          </section>

        </section>

        {/* ================= APPLICATIONS ================= */}

        <section
          id="applications"
          style={{ marginTop: '4rem' }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >

            <h2>📋 Applications</h2>

            <button
              className="primary-button"
              onClick={() =>
                setShowApplicationForm((previous) => !previous)
              }
            >
              {showApplicationForm
                ? '✕ Close Form'
                : '+ Add Application'}
            </button>

          </div>

          {/* Add Application Form */}

          {showApplicationForm && (
            <div
              className="card"
              style={{
                marginBottom: '1.5rem'
              }}
            >

              <div className="card-title">
                Add New Application
              </div>

              <form
                onSubmit={handleAddApplication}
                style={{
                  display: 'grid',
                  gap: '1rem',
                  marginTop: '1rem'
                }}
              >

                <div>

                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.4rem',
                      fontWeight: '600'
                    }}
                  >
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="company_name"
                    value={applicationForm.company_name}
                    onChange={handleApplicationChange}
                    placeholder="e.g. TCS"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      background: '#0f172a',
                      color: 'white'
                    }}
                  />

                </div>

                <div>

                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.4rem',
                      fontWeight: '600'
                    }}
                  >
                    Job Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={applicationForm.role}
                    onChange={handleApplicationChange}
                    placeholder="e.g. Software Engineer"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      background: '#0f172a',
                      color: 'white'
                    }}
                  />

                </div>

                <div>

                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.4rem',
                      fontWeight: '600'
                    }}
                  >
                    Application Date
                  </label>

                  <input
                    type="date"
                    name="application_date"
                    value={applicationForm.application_date}
                    onChange={handleApplicationChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      background: '#0f172a',
                      color: 'white'
                    }}
                  />

                </div>

                <div>

                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.4rem',
                      fontWeight: '600'
                    }}
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={applicationForm.status}
                    onChange={handleApplicationChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      background: '#0f172a',
                      color: 'white'
                    }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                </div>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingApplication}
                >
                  {savingApplication
                    ? 'Saving...'
                    : 'Save Application'}
                </button>

              </form>

            </div>
          )}

          {/* Applications List */}

          {loadingApplications ? (

            <div className="card">
              <div className="card-title">
                Loading applications...
              </div>
            </div>

          ) : applications.length === 0 ? (

            <div className="card">

              <div className="card-title">
                No Applications Yet
              </div>

              <div className="card-desc">
                Add your first placement application
                using the button above.
              </div>

            </div>

          ) : (

            <div
              style={{
                display: 'grid',
                gap: '1rem'
              }}
            >

              {applications.map((application) => (

                <div
                  className="card"
                  key={application.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >

                  <div>

                    <div className="card-title">
                      🏢 {application.company_name}
                    </div>

                    <div className="card-desc">
                      💼 {application.role}
                    </div>

                    <div
                      style={{
                        marginTop: '0.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem'
                      }}
                    >
                      📅{' '}
                      {application.application_date
                        ? new Date(
                            application.application_date
                          ).toLocaleDateString()
                        : 'No date'}
                    </div>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >

                    <span className="status-badge connected">
                      {application.status}
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteApplication(application.id)
                      }
                      style={{
                        padding: '0.6rem 0.8rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: '#7f1d1d',
                        color: 'white'
                      }}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ================= INTERVIEWS ================= */}

        <section
          id="interviews"
          style={{ marginTop: '4rem' }}
        >

          <h2>🎙️ Interviews</h2>

          <div className="grid">

            <div className="card">

              <div className="card-title">
                No Interviews Yet
              </div>

              <div className="card-desc">
                Your upcoming and completed interviews
                will appear here.
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  alert(
                    'Interview feature will be connected to PostgreSQL next.'
                  )
                }
              >
                + Add Interview
              </button>

            </div>

          </div>

        </section>

        {/* ================= COMPANIES ================= */}

        <section
          id="companies"
          style={{ marginTop: '4rem' }}
        >

          <h2>🏢 Companies</h2>

          <div className="grid">

            <div className="card">

              <div className="card-title">
                No Companies Yet
              </div>

              <div className="card-desc">
                Companies related to your placement
                applications will appear here.
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  alert(
                    'Company feature will be connected to PostgreSQL next.'
                  )
                }
              >
                + Add Company
              </button>

            </div>

          </div>

        </section>

        {/* ================= DATABASE SCHEMA ================= */}

        <section
          id="schema"
          style={{ marginTop: '4rem' }}
        >

          <h2>
            Database Tables & Entity-Relationship Schema
          </h2>

          <div className="grid">

            <div className="card">

              <div className="card-title">
                👤 users
              </div>

              <div className="card-desc">
                Stores user profiles including name,
                email, college, graduation year,
                skills and profile links.
              </div>

            </div>

            <div className="card">

              <div className="card-title">
                🏢 companies
              </div>

              <div className="card-desc">
                Stores companies associated with
                placement applications.
              </div>

            </div>

            <div className="card">

              <div className="card-title">
                📋 applications
              </div>

              <div className="card-desc">
                Tracks applications, company,
                role, status and application date.
              </div>

            </div>

            <div className="card">

              <div className="card-title">
                🎙️ interviews
              </div>

              <div className="card-desc">
                Stores interview rounds and
                interview results.
              </div>

            </div>

            <div className="card">

              <div className="card-title">
                ⏰ deadlines
              </div>

              <div className="card-desc">
                Stores upcoming application and
                assessment deadlines.
              </div>

            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        Placement Tracker © 2026 — Designed for
        College Students & Portfolio Excellence

      </footer>

    </div>
  );
}

export default App;