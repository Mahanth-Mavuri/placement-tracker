# College Placement Tracker 🎓

A full-stack web application designed for college students to manage and track job applications, upcoming tests, interviews, application deadlines, and placement statistics in one centralized dashboard.

## 🌐 Live Demo

[🚀 View Live Demo](https://placement-tracker-two-sooty.vercel.app/)

## 💻 GitHub Repository

[📂 View Source Code](https://github.com/Mahanth-Mavuri/placement-tracker)

---

## 📌 Problem Statement

During college campus placements and off-campus drives, students apply to dozens of companies across multiple platforms such as LinkedIn, Unstop, and company career portals.

Keeping track of application statuses, upcoming online assessments (OA), technical rounds, deadlines, interviews, and offer statistics manually in spreadsheets can quickly become chaotic and lead to missed opportunities.

**College Placement Tracker** provides a centralized dashboard to organize the complete application lifecycle, manage deadlines, track interviews, and gain insights into placement progress.

---

## ✨ Core Features

- 🔐 **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Secure password hashing

- 📊 **Dashboard**
  - Applications in progress
  - Interviews scheduled
  - Offers received
  - Application conversion statistics

- 📝 **Application Tracker**
  - Create, update, and delete applications
  - Search and filter applications
  - Sort applications
  - Track application progress
  - Status flow:
    `Interested → Applied → OA → Interview → Selected / Rejected`

- 🎯 **Interview Tracker**
  - Track Online Assessments
  - Coding rounds
  - Technical interviews
  - HR interviews
  - Managerial rounds
  - Interview notes and outcomes

- 🏢 **Company Directory**
  - Store company information
  - Associate companies with applications
  - Track application history

- ⏰ **Deadline Manager**
  - Track application deadlines
  - Upcoming deadline notifications
  - Overdue task identification

- 📈 **Interactive Analytics**
  - Application statistics
  - Conversion rates
  - Monthly application trends
  - Placement progress insights

- 👤 **User Profile**
  - College details
  - Degree
  - Skills
  - LinkedIn profile
  - GitHub profile
  - Portfolio

---

## 🛠️ Tech Stack

### Frontend

- **React.js** — Component-based UI development
- **Vite** — Fast development and production build tool
- **React Router** — Client-side routing
- **CSS / Modern CSS Variables** — Responsive and modern UI design

### Backend

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **JWT** — Authentication and authorization
- **bcryptjs** — Password hashing

### Database

- **PostgreSQL** — Relational database management system

### Development Tools

- **Git**
- **GitHub**
- **ESLint**
- **Prettier**
- **Vercel**

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│                React.js + Vite Frontend                 │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ HTTP / REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Backend Server                      │
│              Node.js + Express.js API                  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Database Engine                      │
│                    PostgreSQL                           │
└─────────────────────────────────────────────────────────┘
