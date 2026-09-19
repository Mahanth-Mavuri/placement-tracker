# College Placement Tracker 🎓

A full-stack production-ready Web Application designed for college students to manage and track job applications, upcoming tests, interviews, application deadlines, and offer statistics.

## 📌 Problem Statement
During college campus placements and off-campus drives, students apply to dozens of companies across multiple platforms (LinkedIn, Unstop, company career portals). Keeping track of application statuses, upcoming online assessments (OA), technical rounds, deadlines, and offer statistics manually in spreadsheets quickly becomes chaotic and prone to missed deadlines.

**College Placement Tracker** provides a centralized, real-time dashboard to organize application lifecycles, store interview notes, manage deadlines, and gain visual insights into placement statistics.

---

## ✨ Core Features
- **Authentication System**: Secure JWT-based User Registration, Login, and Password Hashing.
- **Dashboard**: Real-time metrics (Applications in progress, Interviews scheduled, Offers, Conversion rates).
- **Application Tracker**: Full CRUD management with filter, search, sort, and status progression (`Interested` → `Applied` → `OA` → `Interview` → `Selected`/`Rejected`).
- **Interview Tracker**: Schedule and log test rounds (OA, Coding, Technical, HR, Managerial) with notes and outcomes.
- **Company Directory**: Associated company profiles and application logs.
- **Deadline Manager**: Visual notifications and breakdown of upcoming deadlines and overdue tasks.
- **Interactive Analytics**: Visual charts for application conversion rates and monthly statistics.
- **User Profile**: Custom details (College, Degree, Skills, LinkedIn, GitHub, Portfolio).

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based UI rendering
- **Vite**: Ultra-fast build tool & development server
- **React Router (v6)**: Client-side dynamic routing
- **Vanilla CSS / Modern CSS Variables**: SaaS-inspired design system with responsive layouts

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: REST API server framework
- **JWT (JSON Web Tokens)**: Stateless user authentication
- **bcryptjs**: Password encryption

### Database
- **PostgreSQL**: Relational database management system

### Tools & Quality Assurance
- **Git & GitHub**: Source control and release workflow
- **ESLint & Prettier**: Code formatting and linting standards

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│                React.js App (Vite Server)               │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP / REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Server (Node.js)                    │
│                 Express API & Middleware                │
└───────────────────────────┬─────────────────────────────┘
                            │ SQL Queries (pg driver)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Database Engine                      │
│                  PostgreSQL Database                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
placement-tracker/
├── frontend/             # React + Vite client app
│   ├── public/           # Static assets
│   ├── src/              # Components, pages, context, & styles
│   └── package.json
├── backend/              # Node.js + Express API server
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth & validation middleware
│   ├── routes/           # API routes
│   └── server.js         # Express server entry point
├── database/             # SQL schemas & migration scripts
├── docs/                 # Architecture diagrams & documentation
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/placement-tracker.git
   cd placement-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update database credentials in backend/.env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Running Tests
```bash
# Backend unit & integration tests
cd backend
npm test
```

---

## 📷 Screenshots
*(Screenshots will be added as UI features are built)*

---

## 📝 License
This project is open-source under the MIT License.
