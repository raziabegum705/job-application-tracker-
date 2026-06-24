# 🌐 Job Application Tracker (SaaS Style)

> A full-stack Job Application Management SaaS that helps users track applications, interviews, and hiring pipelines in one centralized dashboard with real-time analytics.

---

## 🚀 Live Demo

🌍 Live App: https://your-deployed-link.vercel.app

🧪 Demo Login:
Email: demo@gmail.com
Password: Demo@123

---

## 💼 Problem Statement

Job seekers apply to multiple companies across platforms like LinkedIn, Naukri, and company websites. But they often lose track of:

- Application status updates
- Interview schedules
- Follow-ups and responses
- Offer tracking

This leads to missed opportunities and poor job search organization.

👉 This project solves this by acting as a **personal CRM for job applications**.

---

## ✨ Key Features

### 🔐 Authentication System
- JWT-based secure login & registration
- Password hashing using bcryptjs
- Protected routes for user sessions

### 📊 Smart Dashboard Analytics
- Total applications overview
- Status breakdown:
  - Applied
  - Interview
  - Offer
  - Rejected
- Visual funnel chart for job pipeline tracking

### 🔍 Job Tracking System
- Add, edit, delete job applications
- Search by company or role
- Filter by application status
- Track application source (LinkedIn, Referral, Naukri, etc.)

### 🧠 Notes & Interview Management
- Add personal notes for each job
- Track interview dates
- Follow-up reminders
- Keep company-specific insights

### 📱 Responsive UI
- Fully mobile-friendly design
- Clean and modern dashboard
- Smooth UX using React + Tailwind CSS

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| API | Axios |
| UI | react-hot-toast |

---

## 🏗️ System Architecture

```txt
Frontend (React + Tailwind)
        ↓ Axios API Calls
Backend (Node + Express - MVC Pattern)
        ↓ Mongoose ODM
MongoDB Database
```

---

## 📁 Project Structure

```
job-application-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get user profile |


### Job Routes
| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/jobs`       | Get all jobs    |
| GET    | `/api/jobs/:id`   | Get single job  |
| POST   | `/api/jobs`       | Add job         |
| PUT    | `/api/jobs/:id`   | Update job      |
| DELETE | `/api/jobs/:id`   | Delete job      |
| GET    | `/api/jobs/stats` | Dashboard stats |


---

## ⚙️ How to Run Locally

### Requirements
- Node.js
- MongoDB (local or Atlas)

### Steps

```bash
git clone https://github.com/YOUR_USERNAME/job-application-tracker.git
cd job-application-tracker
```

**Backend Setup**
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**.env Example**
```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

**Frontend Setup**
```bash
cd client
npm install
npm run dev
```

---

## 🚀 Deployment

- Frontend → Vercel / Netlify
- Backend → Render / Railway
- Database → MongoDB Atlas

---

## 📸 Screenshots

- Dashboard view
- Job list with filters
- Add/Edit job form
- Login/Register UI

---

## 🧠 Learning Outcomes

- Full-stack MERN development
- JWT authentication flow
- REST API (MVC architecture)
- React Context API state management
- MongoDB schema design
- Responsive UI with Tailwind CSS
- Dashboard analytics

---

## 👩‍💻 Author

**Razia Begum**
🎓 B.Tech CSE — Gates Institute of Technology
GitHub: https://github.com/raziabegum705
LinkedIn: https://linkedin.com/in/s-razia-570015334




