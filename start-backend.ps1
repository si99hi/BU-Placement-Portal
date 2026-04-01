# Backend Services Startup Script
# Starts all backend microservices simultaneously

Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting Backend Services" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# List of services and their ports
$services = @(
    @{Name="auth-service"; Port=5001},
    @{Name="profile-service"; Port=5002},
    @{Name="job-service"; Port=5003},
    @{Name="application-service"; Port=5004},
    @{Name="notification-service"; Port=5005},
    @{Name="skills-service"; Port=5006},
    @{Name="quiz-service"; Port=5007}
)

Write-Host "The following services will be started:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "  - $($service.Name) on port $($service.Port)" -ForegroundColor Yellow
}
Write-Host ""

# Check if we're in the backend directory
if (-not (Test-Path "backend")) {
    Write-Host "ERROR: This script must be run from the root project directory" -ForegroundColor Red
    exit 1
}

# Change to backend directory
cd backend

# Run npm start which will use concurrently to start all services
Write-Host "Starting services with concurrently..." -ForegroundColor Cyan
npm start

