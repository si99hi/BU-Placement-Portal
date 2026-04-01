# Development Environment Setup Script for BU Placement Portal
# This script installs all dependencies for frontend, backend, and individual services

Write-Host "========================================" -ForegroundColor Green
Write-Host "BU Placement Portal - Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js and npm are installed
Write-Host "Checking Node.js and npm..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($null -eq $nodeVersion -or $null -eq $npmVersion) {
    Write-Host "ERROR: Node.js or npm is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host "npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Root dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
cd frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..
Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Install backend root dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
    cd ..
    exit 1
}
Write-Host "Backend root dependencies installed!" -ForegroundColor Green
Write-Host ""

# Install individual service dependencies
$services = @(
    "auth-service",
    "profile-service",
    "job-service",
    "application-service",
    "notification-service",
    "skills-service",
    "quiz-service",
    "announcement-service"
)

foreach ($service in $services) {
    if (Test-Path $service) {
        Write-Host "Installing dependencies for $service..." -ForegroundColor Yellow
        cd $service
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "WARNING: Failed to install dependencies for $service" -ForegroundColor Yellow
        } else {
            Write-Host "$service dependencies installed successfully!" -ForegroundColor Green
        }
        cd ..
    }
}

cd ..
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the frontend:" -ForegroundColor Cyan
Write-Host "  npm run frontend" -ForegroundColor White
Write-Host ""
Write-Host "To start the backend (all services):" -ForegroundColor Cyan
Write-Host "  npm run backend" -ForegroundColor White
Write-Host ""
Write-Host "To start both frontend and backend together:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
