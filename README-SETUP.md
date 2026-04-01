# BU Placement Portal - Development Setup Guide

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

Verify installation:
```powershell
node --version
npm --version
```

---

## Initial Setup

### Option 1: Automated Setup (Recommended)

Run the setup script from the root directory:

```powershell
.\setup-dev.ps1
```

This script will:
1. Install root dependencies
2. Install frontend dependencies
3. Install backend dependencies
4. Install dependencies for all microservices

### Option 2: Manual Setup

```powershell
# Navigate to root directory
cd path\to\BU_PLAC

# Install dependencies
npm install
npm run frontend:install
npm run backend:install
```

---

## Running the Application

### Option A: Start Everything (Frontend + Backend)

From the root directory:

```powershell
npm run dev
```

Or use the provided script:

```powershell
.\start-all.ps1
```

This will start:
- **Frontend** on http://localhost:3000
- **Backend Services** on ports 5001-5007

### Option B: Start Only Frontend

From the root directory:

```powershell
npm run frontend
```

Or use the provided script:

```powershell
.\start-frontend.ps1
```

Frontend will be accessible at: http://localhost:3000

### Option C: Start Only Backend Services

From the root directory:

```powershell
npm run backend
```

Or use the provided script:

```powershell
.\start-backend.ps1
```

This starts all microservices:
- **Auth Service** → http://localhost:5001
- **Profile Service** → http://localhost:5002
- **Job Service** → http://localhost:5003
- **Application Service** → http://localhost:5004
- **Notification Service** → http://localhost:5005
- **Skills Service** → http://localhost:5006
- **Quiz Service** → http://localhost:5007
- **Announcement Service** → (auto-assigned port)

---

## Available npm Scripts

### Root Level Scripts
```json
{
  "frontend": "Start React frontend only",
  "backend": "Start all backend services",
  "dev": "Start frontend and backend together",
  "frontend:install": "Install frontend dependencies",
  "backend:install": "Install backend dependencies",
  "install:all": "Install all dependencies (frontend + backend + services)"
}
```

### Backend Scripts (from backend directory)
```json
{
  "start": "Start all backend services concurrently",
  "dev": "Start all backend services (development mode)",
  "auth": "Start auth-service only",
  "profile": "Start profile-service only",
  "job": "Start job-service only",
  "application": "Start application-service only",
  "notification": "Start notification-service only",
  "skills": "Start skills-service only",
  "quiz": "Start quiz-service only",
  "announcement": "Start announcement-service only"
}
```

---

## PowerShell Scripts

### setup-dev.ps1
Automated setup script that installs all dependencies.
```powershell
.\setup-dev.ps1
```

### start-all.ps1
Starts both frontend and backend services together.
```powershell
.\start-all.ps1
```

### start-frontend.ps1
Starts only the React frontend.
```powershell
.\start-frontend.ps1
```

### start-backend.ps1
Starts only the backend microservices.
```powershell
.\start-backend.ps1
```

---

## Troubleshooting

### Frontend won't start (npm start fails)

1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```powershell
   cd frontend
   rm -r node_modules -Force
   npm install
   npm start
   ```

3. **Check for port conflicts:**
   ```powershell
   netstat -ano | findstr :3000
   ```
   If port 3000 is in use, kill the process:
   ```powershell
   taskkill /PID <PID> /F
   ```

### Backend services won't start

1. **Install concurrently if missing:**
   ```powershell
   npm install concurrently --save-dev
   ```

2. **Ensure all service dependencies are installed:**
   ```powershell
   cd backend
   for /d %G in ("*-service") do (cd %G && npm install && cd ..)
   ```

3. **Check MongoDB connection:** Ensure MongoDB is running (if required by services)

### Port already in use

Find and kill the process using the port:
```powershell
# Find process using port (e.g., 3000)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

---

## Development Workflow

1. **Setup:** Run `.\setup-dev.ps1` once
2. **Development:** Use `npm run dev` or `.\start-all.ps1` to start everything
3. **Watching Changes:** Both frontend and backend will automatically reload on file changes
4. **API Testing:** Use http://localhost:5001-5007 for API endpoints

---

## Docker Deployment (Production)

For deployment using Docker Compose:
```powershell
docker-compose up -d
```

Refer to `docker-compose.yml` for configuration details.

---

## Project Structure

```
BU_PLAC/
├── frontend/              # React application
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/               # Backend microservices
│   ├── auth-service/
│   ├── profile-service/
│   ├── job-service/
│   ├── application-service/
│   ├── notification-service/
│   ├── skills-service/
│   ├── quiz-service/
│   ├── announcement-service/
│   └── package.json
├── scripts/               # Utility scripts
├── docker-compose.yml     # Docker configuration
├── package.json           # Root package.json
└── README-SETUP.md        # This file
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify Node.js and npm are correctly installed
3. Ensure all dependencies are installed with `npm install`
4. Check service logs in the console output

