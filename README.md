# AI-Powered Root Cause Analysis Agent (RCA Agent)

> *"Don't Just Fix the Error. Find Out Why It Happened."*

A full-stack AI-assisted incident investigation and Site Reliability Engineering (SRE) platform designed to identify the root causes of technical failures using structured engineering reasoning and the **Five Whys** methodology.

---

## 🌟 Key Features

1. **User Authentication & Incident Isolation**:
   - Secure registration, login, and JWT-based authentication.
   - User-isolated workspace investigations and incident history.

2. **Operations Dashboard**:
   - Real-time incident counts: Total, Open, Resolved, High/Critical severity.
   - **Interactive Charts**: Category distribution bar charts and severity breakdown pie charts (powered by Recharts).
   - Recent investigation quick-access feed.

3. **Structured Root Cause Reasoning Engine**:
   - **Problem Summary**: Technical overview of the incident.
   - **Ranked Possible Causes**: Multiple potential causes with confidence percentages, detailed descriptions, supporting evidence, and alternative/contradicting points.
   - **Five Whys Analysis**: Interactive 5-step diagnostic chain drilling down from surface symptoms to root architectural/process gaps.
   - **Three-Tier Remediation Plan**:
     - *Immediate Actions (0-2h)*: Urgent containment steps.
     - *Short-Term Fixes (1-3d)*: Bug fixes and config hardening.
     - *Long-Term Prevention*: Observability and CI/CD gates.

4. **Evidence & Log File Extraction**:
   - Multi-format file support: `.txt`, `.log`, `.csv`, `.pdf`.
   - Automated regex extraction of errors, warnings, timestamps, and stack traces.
   - Correlates uploaded evidence directly into the AI analysis.

5. **Downloadable & Printable RCA Reports**:
   - Server-side generated professional PDF report (powered by PDFKit).
   - Dedicated print-ready web report view formatted for incident reviews and post-mortems.

6. **Flexible AI Engine Options**:
   - **Embedded RCA Heuristic Engine**: Works 100% offline out-of-the-box with zero API keys required.
   - **Google Gemini API**: Integrated Gemini 1.5 Flash support.
   - **OpenAI API**: Integrated GPT-4o-mini support.
   - Configurable in user **Settings**.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**:
  - React 18 (Vite)
  - Tailwind CSS (with Dark / Light theme toggle)
  - Lucide React (Icons)
  - Recharts (Analytics & Metrics)
  - Axios
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose
  - JSON Web Tokens (JWT) & bcryptjs
  - Multer (File uploads)
  - PDFKit & pdf-parse (PDF extraction & generation)
  - CSV Parser

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### Quick Start (Windows)
Double-click `start.bat` in this folder, or run the following in terminal:

#### 1. Start Backend:
```bash
cd backend
npm install
npm start
```
*Backend runs on: [http://localhost:5000](http://localhost:5000)*

#### 2. Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: [http://localhost:5173](http://localhost:5173)*

---

## 🔑 Test Credentials

You can register a new account or use the pre-created test account:
- **Email:** `harsh@test.com`
- **Password:** `password123`

---

## 📁 Project Structure

```text
root  cause anlyser/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Auth, Analysis, Evidence, Report controllers
│   ├── middleware/      # JWT auth and Multer upload middlewares
│   ├── models/          # User, Analysis, Evidence, AnalysisResult schemas
│   ├── routes/          # REST API endpoints
│   ├── services/        # AI orchestrator, log parser, PDF generator
│   ├── server.js        # Express application entry
│   └── .env             # Environment configuration
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client
│   │   ├── components/  # Badges, Navbar, Sidebar, FiveWhys, CauseRanking
│   │   ├── context/     # Auth & Theme context providers
│   │   ├── pages/       # Landing, Login, Register, Dashboard, NewAnalysis, Result, History, Report, Settings
│   │   ├── App.jsx      # Router & layout
│   │   └── main.jsx
│   ├── index.html
│   └── tailwind.config.js
├── sample-error.log     # Sample server log for testing file upload
├── start.bat            # One-click start script
└── README.md
```
