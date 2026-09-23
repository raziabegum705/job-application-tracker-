# 💼 Job Application Tracker

### A Personal CRM for Managing Your Job Search

> **Identifying a real job-search problem and turning it into a complete full-stack solution.**

Job Application Tracker is a full-stack web application that I developed independently after identifying a common problem every job seeker runs into.

When you're applying to 20, 50, or 100+ companies across LinkedIn, Naukri, referrals, and company career pages, it becomes almost impossible to remember who you applied to, what stage each application is at, and when your next interview is.

**Job Application Tracker turns that scattered process into one centralized dashboard.**

It combines secure authentication, application tracking with full status history, real-time dashboard analytics, instant search, and a clean, responsive UI.

---

# 💡 The Problem I Identified

In a typical job search:

* Applications get tracked (if at all) across spreadsheets, notes apps, and memory.
* It's hard to know how many applications are actually "in progress" vs. rejected vs. offers.
* Interview dates and follow-ups get missed because nothing reminds you.
* There's no single view of your pipeline — how many applied, how many moved to interview, how many converted to offers.
* Going back to check "did I already apply to this company?" wastes time.

This creates unnecessary mental overhead and makes it hard to job-search strategically.

### 🎯 My Approach

Instead of treating this as just a list of companies, I designed a complete tracking workflow:

```text
Add Application
      ↓
Track Status (Applied → OA → Interview → Offer/Rejected)
      ↓
Status Change Logged with Timestamp
      ↓
Dashboard Aggregates Every Application
      ↓
Charts + Stats Reveal the Pipeline
      ↓
Search / Filter / Sort to Find Anything Instantly
```

---

# 🚀 What Job Application Tracker Does

The application is built around one authenticated user managing their own private pipeline:

### 👤 The User

Register/log in → add applications as they apply → update status as things progress → check the Dashboard anytime to see the full picture → search or jump to any application instantly.

Every application belongs only to the user who created it — the backend enforces this on every request, not just the frontend.

---

# ✨ Key Features

## 🔐 1. Authentication System

Secure register/login built with:

* **JWT (JSON Web Tokens)** for stateless authentication
* **bcryptjs** password hashing before storage
* Auth middleware that verifies the token on every protected route

```text
Register / Login
        ↓
Password hashed (bcryptjs)
        ↓
JWT issued
        ↓
Token stored client-side
        ↓
Sent as Bearer token on every request
        ↓
Backend verifies before allowing access
```

---

## 📝 2. Application Tracking (Full CRUD)

Users can add, edit, and delete applications with:

* Company name
* Role / position
* Location (defaults to "Remote")
* Job posting URL
* Salary
* Applied date
* Interview date
* Notes
* Source: `LinkedIn`, `Naukri`, `Company Website`, `Referral`, `Other`
* Status: `Applied`, `OA`, `Interview`, `Offer`, `Rejected`

---

## 🕓 3. Status History Timeline

This isn't just a status field that overwrites itself — every status change is appended to a `statusHistory` array with its own timestamp.

```text
Applied (Day 1)
    ↓
OA (Day 5)
    ↓
Interview (Day 12)
    ↓
Offer (Day 20)
```

So the system always knows not just *where* an application is, but *when it got there*.

---

## 📊 4. Dashboard Analytics

The Dashboard is powered by MongoDB aggregation pipelines and includes:

* 5 stat cards — Total, Applied, Interview, Offer, Rejected
* A **pie chart** of status distribution
* A **funnel chart** — Applied → OA/Interview/Offer → Interview → Offer
* A **bar chart** of applications submitted over the last 6 months
* A source breakdown (LinkedIn vs. Naukri vs. Referral, etc.)
* A "recently added" applications list

```text
Job Documents (MongoDB)
        ↓
Aggregation Pipeline (by status / source / month)
        ↓
/api/jobs/stats
        ↓
Recharts (Pie / Funnel / Bar)
        ↓
Dashboard
```

---

## 🔍 5. Search, Filter, Sort & Pagination

The applications table (`/jobs`) supports:

* Search by company or role (case-insensitive, regex-escaped for safety)
* Filter by status
* Sort by company, role, status, applied date, or created date
* Server-side pagination

---

## ⚡ 6. Spotlight Command Palette (Ctrl/Cmd + K)

A keyboard-driven quick search overlay, similar to macOS Spotlight:

* Press `Ctrl+K` / `Cmd+K` anywhere in the app to open it
* Live-searches applications as you type (debounced)
* Quick actions to jump to Dashboard, All Applications, or Add New

```text
Ctrl/Cmd + K
      ↓
Search box opens
      ↓
Debounced query → /api/jobs?search=
      ↓
Matching applications shown instantly
```

---

## 🌗 7. Dark / Light Theme

* Detects the OS theme preference on first load
* User can toggle manually — the explicit choice is remembered in `localStorage`
* Automatically follows OS theme changes until the user overrides it

---

## 🏢 8. Auto-Fetched Company Logos

Rather than requiring users to upload a logo, the app guesses the company's domain from its name and fetches a favicon live from Google's favicon service. If no icon is found (or it's a blank placeholder icon), it falls back to a colored initial badge.

```text
Company Name
      ↓
Domain Guessed (e.g. "Google" → google.com)
      ↓
Favicon Fetched Live
      ↓
Fallback: Colored Initial Badge (if no favicon)
```

---

## 🛡️ 9. Backend Security

* **Helmet** for secure HTTP headers
* **express-rate-limit** on auth routes (30 requests / 15 minutes) to slow down brute-force attempts
* **Ownership checks** on every job read/update/delete — a user can never touch another user's data, enforced server-side (not just hidden in the UI)
* Request body size limits and CORS restricted to the configured client URL

---

# 🔄 Complete System Workflow

```text
                          USER
                            │
                            ▼
                    Register / Login
                            │
                            ▼
                  JWT Token Issued & Stored
                            │
                            ▼
                    Add Job Application
                            │
                            ▼
              Update Status as it Progresses
                            │
                            ▼
              statusHistory Entry Appended
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
      Dashboard Aggregates          Applications Table
      (Pie / Funnel / Bar)          (Search / Filter / Sort)
              │                           │
              └─────────────┬─────────────┘
                            ▼
                   Full Pipeline Visibility
```

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│           React + Vite Frontend             │
│                                               │
│ Landing │ Login/Register │ Dashboard │ Jobs  │
│              Spotlight Search               │
└───────────────────────┬───────────────────────┘
                        │
                  Axios / REST API
                  (Bearer JWT)
                        ▼
┌─────────────────────────────────────────────┐
│          Node.js + Express Backend           │
│                                               │
│  Auth Routes   │   Job Routes (protected)    │
│  Rate Limiting │   Ownership Checks           │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
                MongoDB Atlas + Mongoose
```

---

# 🛠️ Technology Stack

## Frontend

* **React 18**
* **Vite**
* **React Router**
* **Axios**
* **Recharts** (charts)
* **Framer Motion** (animation)
* **lucide-react** (icons)
* **React Hot Toast**
* **Tailwind CSS**

## Backend

* **Node.js**
* **Express.js**
* **Helmet**
* **express-rate-limit**
* **Morgan**
* **CORS**
* **dotenv**

## Database

* **MongoDB**
* **MongoDB Atlas**
* **Mongoose**

## Authentication & Security

* **JSON Web Token (JWT)**
* **bcryptjs**
* Protected API routes
* Server-side ownership enforcement

---

# 📁 Project Structure

```text
job-application-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompanyLogo.jsx
│   │   │   ├── JobForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SpotlightSearch.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ScrollToTop.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useCountUp.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── AddJob.jsx
│   │   │   └── EditJob.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── jobController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   │
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# 🗄️ Database Design

The application uses MongoDB with Mongoose.

### User

Stores:

* Name
* Email (unique)
* Hashed password

### Job

Stores:

* Owning user
* Company
* Role
* Location
* Status
* Job URL
* Salary
* Applied date
* Interview date
* Notes
* Source
* Status history (array of `{ status, date }`)

---

# 🔒 Security Design

### Password Protection

Passwords are hashed using **bcryptjs** before storage.

### JWT Authentication

Every protected route verifies a Bearer token before allowing access.

### Ownership Enforcement

Job read/update/delete operations check that `job.user` matches the authenticated user's ID — enforced in the controller, not just hidden in the UI.

### Rate Limiting

Auth routes are limited to 30 requests per 15 minutes per IP to slow brute-force attempts.

### Secure Headers

**Helmet** sets secure HTTP headers by default across all responses.

---

# 📸 Screenshots

## 🏠 Landing Page
<img width="1917" height="901" alt="Screenshot 2026-09-23 103543" src="https://github.com/user-attachments/assets/48ca6ccc-380a-41f4-8ef0-5f46e5f5a209" />

## 🔐 Login Page
<img width="1916" height="918" alt="Screenshot 2026-09-23 103552" src="https://github.com/user-attachments/assets/78d97969-bca9-4c15-a250-64e59c455bcd" />
## 📝 Register Page

<img width="1912" height="926" alt="Screenshot 2026-09-23 103600" src="https://github.com/user-attachments/assets/d881f752-3473-4dd0-acbe-fc75d4adca12" />

## 📊 Dashboard

<img width="1917" height="915" alt="Screenshot 2026-09-23 103151" src="https://github.com/user-attachments/assets/6c7f78cc-a0d3-486e-8e79-75f213c8cd2f" />

<img width="1917" height="907" alt="Screenshot 2026-09-23 103211" src="https://github.com/user-attachments/assets/38b60ce0-e5d3-49d6-a1ec-5cb12fc641c5" />

<img width="1917" height="932" alt="Screenshot 2026-09-23 103221" src="https://github.com/user-attachments/assets/7ff0145d-2265-40b4-8785-1bc3f45f47b4" />

## 📋 Job Applications List
<img width="1917" height="928" alt="Screenshot 2026-09-23 103236" src="https://github.com/user-attachments/assets/8927336d-bbde-4dea-9fc3-ffbf80e0bf7f" />


## ➕ Add Application
<img width="1917" height="885" alt="Screenshot 2026-09-23 103251" src="https://github.com/user-attachments/assets/192501f1-81e1-4769-b2fe-1c3c5f1ac320" />

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are available:

* Node.js
* npm
* MongoDB (local or Atlas)

---

## 1. Clone the Repository

```bash
git clone https://github.com/raziabegum705/job-application-tracker.git
cd job-application-tracker
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLIENT_URL=your_frontend_url
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=your_backend_url
```

> **Never commit `.env` files, API keys, passwords, or secret credentials to GitHub.**

---

# ▶️ Running Locally

## Start the Backend

```bash
cd server
npm run dev
```

The backend uses the configured `PORT`, with `5000` as the default.

## Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will start the frontend development server.

---

# ☁️ Deployment

The project ships with a `vercel.json` in both `client/` and `server/`, so it's structured for separate frontend and backend deployment.

### Frontend

```text
React + Vite
     ↓
Vercel
```

### Backend

```text
Node.js + Express
     ↓
Vercel (Serverless Functions)
```

### Database

```text
MongoDB
     ↓
MongoDB Atlas
```

* **Live app:** https://job-application-tracker-beryl-two.vercel.app/
* **Demo login:** `demo@gmail.com` / `Demo@123`

---

# 🧪 Example Use Case

Consider a user who just applied to a new role.

They:

1. Click **Add Application** and fill in company, role, source, and applied date.
2. The application starts with status `Applied`, logged with today's date in its history.
3. A week later, they get an online assessment — they edit the application and change status to `OA`. That change is appended to the history with its own timestamp.
4. They open the **Dashboard** and see the pie chart, funnel, and monthly bar chart update to reflect the new application.
5. Two weeks later, they can't remember which recruiter link they used — they press `Ctrl+K`, type the company name, and jump straight back to it.

The result is a single source of truth for the entire job search, instead of a scattered spreadsheet.

---

# 🧠 Challenges I Solved

Building the project independently involved solving several practical engineering problems.

### 🕓 Tracking Status Over Time, Not Just Current Status

A simple `status` field loses history the moment it's overwritten. I solved this by appending every status transition to a `statusHistory` array, including correctly handling edge cases like existing jobs created before this feature existed (backfilling their history on first update).

### 📊 Real Dashboard Analytics from Raw Documents

Rather than computing stats on the frontend, I built MongoDB aggregation pipelines on the backend to compute status breakdowns, source breakdowns, and a rolling 6-month trend efficiently at the database level.

### 🔐 Ownership Enforcement, Not Just UI Hiding

Every job-related endpoint independently verifies that the requesting user owns the resource before allowing read, update, or delete — this is enforced in the controller layer so it can't be bypassed by calling the API directly.

### 🏢 Company Logos Without Storage

Rather than requiring logo uploads or hardcoding a logo database, I built a lightweight domain-guessing + live-favicon-fetch system with a graceful fallback, avoiding the need to store or manage any image assets.

### ⚡ Instant Search Without Overloading the Backend

The Spotlight command palette debounces search input before hitting the API, so fast typing doesn't spam the backend with requests.

---

# 🎓 What This Project Demonstrates

Job Application Tracker demonstrates practical experience with:

### Full-Stack Development

Building and connecting a React frontend with a Node.js/Express backend.

### Database Design

Designing MongoDB schemas that track state changes over time, not just current state.

### Authentication

Implementing JWT authentication and bcrypt password hashing.

### API Development

Creating backend routes and controllers following an MVC pattern, including aggregation-based analytics endpoints.

### Data Visualization

Using Recharts to turn raw MongoDB aggregation output into pie, funnel, and bar charts.

### Security Thinking

Considering authentication, ownership enforcement, rate limiting, and secure HTTP headers.

### UX Details

Command-palette search, dark mode, skeleton loading states, and responsive design.

### Deployment

Preparing the application for separate frontend/backend cloud deployment.

---

# 🌟 Why I Built It

I wanted this project to represent more than just a to-do list with a database behind it.

The starting point was a simple observation from my own job search:

> **Applying to jobs generates a lot of scattered information, but nothing brings it together into one clear picture.**

I used that observation to design a complete tracking workflow connecting:

```text
Problem Identification
        ↓
System Design
        ↓
Frontend
        ↓
Backend
        ↓
Database
        ↓
Authentication
        ↓
Analytics
        ↓
Deployment
```

The result is **Job Application Tracker** — a project I built independently to apply software engineering concepts to a problem I could actually relate to as a student applying for internships and roles.

---

# 👩‍💻 Developer

## Shaik Razia Begum

**B.Tech CSE Student | Individual Developer**

I independently designed and developed Job Application Tracker, including the frontend, backend, database integration, authentication, dashboard analytics, and deployment setup.

### My Contributions

* React frontend development
* UI and dashboard development
* Node.js & Express backend
* REST API development (MVC pattern)
* MongoDB/Mongoose integration
* MongoDB aggregation pipelines for analytics
* JWT authentication
* bcrypt password hashing
* Status-history tracking design
* Search, filter, sort & pagination
* Spotlight command palette (Ctrl/Cmd+K)
* Dark/light theme system
* Error handling and debugging
* Deployment configuration

> **Built independently from problem identification to implementation.**

GitHub: https://github.com/raziabegum705
LinkedIn: https://linkedin.com/in/s-razia-570015334
