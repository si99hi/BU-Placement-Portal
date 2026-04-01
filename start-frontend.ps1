# Frontend Startup Script
# Starts the React frontend application

Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting Frontend Application" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "The React application will start on:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the root directory or frontend directory
if (Test-Path "frontend") {
    $frontendPath = "frontend"
} elseif ((Get-Item -Path "." -Force).Name -eq "frontend") {
    $frontendPath = "."
} else {
    Write-Host "ERROR: Could not find frontend directory" -ForegroundColor Red
    exit 1
}

# Change to frontend directory if needed
if ($frontendPath -eq "frontend") {
    cd frontend
}

Write-Host "Starting React development server..." -ForegroundColor Cyan
npm start

