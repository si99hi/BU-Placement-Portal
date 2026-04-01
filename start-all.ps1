# Full Stack Startup Script
# Starts both frontend and backend services

Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting BU Placement Portal (Full Stack)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "This will start:" -ForegroundColor Yellow
Write-Host "  - React Frontend (port 3000)" -ForegroundColor Yellow
Write-Host "  - Backend Microservices (ports 5001-5007)" -ForegroundColor Yellow
Write-Host ""

# Check if we're in the root directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERROR: This script must be run from the root project directory" -ForegroundColor Red
    exit 1
}

# Run npm dev which uses concurrently to start both frontend and backend
Write-Host "Starting full stack with concurrently..." -ForegroundColor Cyan
npm run dev

