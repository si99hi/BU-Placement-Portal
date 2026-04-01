# 🎓 BU Placement Portal

A full-stack **Microservices-based Placement Management System** built for Bennett University. It connects Students, Recruiters, and the Training & Placement Office (TPO) in one unified platform — featuring AI-powered mock interviews, job applications, hackathons, quizzes, coding tasks, real-time messaging, and more.

---

## 🚀 Quick Start (Docker)

> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed and running.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd BU_PLAC

# 2. Set up your environment variables
cp .env.example .env
# Edit .env with your actual credentials (see Environment Variables section)

# 3. Start all services
docker compose up --build

# 4. Open in browser
http://localhost:3000
```

> The API Gateway is exposed at `http://localhost:5000`. The React frontend is at `http://localhost:3000`.

---
📸 Project Snapshots
🔐 Login Page
<p align="center"> <img src="assets/images/login page.png" width="800"/> </p>
🎓 Student Features
📝 Apply for Job
<p align="center"> <img src="assets/images/apply for job.png" width="800"/> </p>
💻 Coding Task
<p align="center"> <img src="assets/images/coding task.png" width="800"/> </p>
🤖 AI Interview
<p align="center"> <img src="assets/images/ss1 intervioew.png" width="800"/> </p>
📊 Student Dashboard
<p align="center"> <img src="assets/images/student dashboard.png" width="800"/> </p>
🧑‍💼 TPO Dashboard
<p align="center"> <img src="assets/images/tpo dashboard.png" width="800"/> </p>
🛠️ Admin Dashboard
<p align="center"> <img src="assets/images/admin dashboard.png" width="800"/> </p>


## 📁 Project Structure

```
BU_PLAC/
├── 📁 frontend/                   # React.js SPA
│   └── src/
│       ├── pages/                 # All route-level page components
│       ├── components/            # Shared UI components (Navbar, Cards, etc.)
│       ├── context/               # AuthContext (global auth state)
│       ├── services/
│       │   └── api.js             # Axios API client for all services
│       ├── assets/                # Images, logos, company icons
│       ├── App.js                 # Root router
│       └── theme.js               # MUI theme configuration
│
├── 📁 backend/
│   ├── auth-service/              # 🔐 Auth, OTP, JWT (Port 5001)
│   ├── profile-service/           # 👤 Student profiles & file uploads (Port 5002)
│   ├── job-service/               # 💼 Job listings management (Port 5003)
│   ├── application-service/       # 📋 Job applications workflow (Port 5004)
│   ├── notification-service/      # 🔔 In-app notifications (Port 5005)
│   ├── skills-service/            # 🛠️ Skills catalog & search (Port 5006)
│   ├── quiz-service/              # 📝 MCQ quizzes per job (Port 5007)
│   ├── announcement-service/      # 📢 TPO announcements (Port 5008)
│   ├── hackathon-service/         # 🏆 Hackathon events & registrations (Port 5009)
│   ├── task-service/              # 💻 Coding tasks via Judge0 (Port 5010)
│   ├── interview-service/         # 🤖 AI Mock Interviews via Gemini (Port 5011)
│   └── messaging-service/         # 💬 Real-time messaging (Port 5012)
│
├── 📁 nginx.conf                  # API Gateway routing config
├── 📄 docker-compose.yml          # Full container orchestration
├── 📄 .env                        # Environment variables (do not commit)
└── 📄 README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | SPA Framework |
| **React Router v6** | Client-side routing |
| **Material UI (MUI v5)** | Component library & theming |
| **Axios** | HTTP client |
| **React Google reCAPTCHA** | Bot protection on auth forms |

### Backend (Microservices)
| Technology | Purpose |
|---|---|
| **Node.js + Express** | API server for every microservice |
| **MongoDB + Mongoose** | Primary database (one DB per service) |
| **Redis** | OTP & session caching (auth-service) |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **Nodemailer + Gmail** | Transactional email (OTP, password reset) |
| **Bcrypt.js** | Password hashing |
| **Winston** | Structured logging |

### AI & External APIs
| Technology | Purpose |
|---|---|
| **Google Gemini 2.0 Flash** | AI mock interview questions & scoring |
| **Judge0 API (RapidAPI)** | Remote code execution for coding tasks |
| **Google reCAPTCHA v2** | Auth form bot protection |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker + Docker Compose** | Containerisation & orchestration |
| **Nginx** | API Gateway — routes `/api/*` to each microservice |
| **MongoDB (Docker)** | Persistent data volumes |
| **Redis (Docker)** | In-memory cache for OTPs |

---

## 🌐 Service Port Map

| Service | Internal Port | API Prefix |
|---|---|---|
| API Gateway (Nginx) | `5000` | `/api/*` |
| Auth Service | `5001` | `/api/auth` |
| Profile Service | `5002` | `/api/profile` |
| Job Service | `5003` | `/api/jobs` |
| Application Service | `5004` | `/api/applications` |
| Notification Service | `5005` | `/api/notifications` |
| Skills Service | `5006` | `/api/skills` |
| Quiz Service | `5007` | `/api/quiz` |
| Announcement Service | `5008` | `/api/announcements` |
| Hackathon Service | `5009` | `/api/hackathons` |
| Task Service | `5010` | `/api/tasks` |
| Interview Service | `5011` | `/api/interview` |
| Messaging Service | `5012` | `/api/messaging` |
| Frontend (React) | `3000` | — |

---

## 🔑 Environment Variables

Create a `.env` file in the root directory. Required variables:

```env
# General
NODE_ENV=production
JWT_SECRET=<your-strong-secret>
SKIP_CAPTCHA_VERIFICATION=true    # Set to false in production

# MongoDB (one per service)
MONGO_URI_AUTH=mongodb://mongo:27017/authdb
MONGO_URI_PROFILE=mongodb://mongo:27017/profiledb
MONGO_URI_JOB=mongodb://mongo:27017/jobdb
MONGO_URI_APP=mongodb://mongo:27017/applicationdb
MONGO_URI_NOTIFY=mongodb://mongo:27017/notificationdb
MONGO_URI_QUIZ=mongodb://mongo:27017/quizdb
MONGO_URI_ANNOUNCE=mongodb://mongo:27017/announcedb
MONGO_URI_TASK=mongodb://mongo:27017/taskdb
MONGO_URI_HACKATHON=mongodb://mongo:27017/hackathondb
MONGO_URI_INTERVIEW=mongodb://mongo:27017/interview-service

# Redis
REDIS_URL=redis://redis-cache:6379

# Email (Gmail App Password)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx     # 16-char Gmail App Password

# reCAPTCHA (get from console.cloud.google.com)
RECAPTCHA_SECRET_KEY=<server-key>
REACT_APP_RECAPTCHA_SITE_KEY=<client-key>

# TPO Admin
TPO_ADMIN_EMAIL=your-tpo@gmail.com

# AI & External APIs
GEMINI_API_KEY=<your-gemini-api-key>
JUDGE0_API_KEY=<your-rapidapi-key>
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# Internal Service URLs (Docker network)
AUTH_SERVICE_URL=http://auth-service:5001
PROFILE_SERVICE_URL=http://profile-service:5002
JOB_SERVICE_URL=http://job-service:5003
APPLICATION_SERVICE_URL=http://application-service:5004
NOTIFICATION_SERVICE_URL=http://notification-service:5005
```

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Student** | Browse jobs, apply, take quizzes & coding tasks, AI mock interviews, hackathons |
| **Recruiter** | Post jobs, manage applicants, create quizzes & coding tasks |
| **Placement Cell (TPO)** | Full admin — all recruiter features + announcements, hackathon management, TPO dashboard |

---

## ✨ Key Features

- 🔐 **Secure Auth** — JWT with OTP email verification & forgot-password flow
- 💼 **Job Portal** — Browse, filter, and apply to placement drives
- 📋 **Application Tracker** — Students and recruiters can track application status
- 📝 **MCQ Quizzes** — TPO/Recruiters attach quizzes to job listings
- 💻 **Coding Tasks** — Remote code execution via Judge0 with real-time results
- 🤖 **AI Mock Interviews** — Conversational interview prep powered by Google Gemini
- 🏆 **Hackathons** — Create, register for, and manage team hackathon events
- 📢 **Announcements** — TPO broadcasts to all students
- 💬 **Messaging** — Direct messaging between users
- 🔔 **Notifications** — In-app notification center

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| Email OTP not sending | Check `EMAIL_USER` and `EMAIL_PASS` in `.env`. Use a Gmail **App Password** (not your regular password). |
| Mock Interview fails | Ensure `GEMINI_API_KEY` is valid. Free tier has per-minute rate limits — wait ~30s and retry. |
| Coding task not working | Verify `JUDGE0_API_KEY` on RapidAPI dashboard is active. |
| Container failing to start | Run `docker compose down && docker compose up --build` to force a clean rebuild. |

