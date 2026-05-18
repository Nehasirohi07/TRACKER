# OP ASCEND Development Script
# Run this script to start both backend and frontend locally

Write-Host "========================================" -ForegroundColor Green
Write-Host "  OP ASCEND - Development Mode" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
$hasPython = $null -ne (Get-Command python -ErrorAction SilentlyContinue)
$hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)

if (-not $hasPython) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not $hasNode) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path "backend/.env")) {
    Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
    @"
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/op_ascend
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-super-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
"@ | Out-File -FilePath "backend/.env" -Encoding utf8
    Write-Host "Please update GEMINI_API_KEY in backend/.env" -ForegroundColor Yellow
}

Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Start backend
Write-Host "[Backend] Installing dependencies (using venv)..." -ForegroundColor Cyan
Push-Location (Join-Path $ProjectRoot "backend")

# Use virtual environment if it exists
$venvPip = Join-Path $ProjectRoot "backend" "venv" "Scripts" "pip.exe"
$venvUvicorn = Join-Path $ProjectRoot "backend" "venv" "Scripts" "uvicorn.exe"

if (Test-Path $venvPip) {
    Write-Host "[Backend] Using virtual environment at backend/venv" -ForegroundColor Cyan
    & $venvPip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install Python dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "[Backend] Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
    $backendJob = Start-Job -ScriptBlock {
        param($dir, $uvicornExe)
        Set-Location $dir
        & $uvicornExe app.main:app --host 0.0.0.0 --port 8000 --reload
    } -ArgumentList (Join-Path $ProjectRoot "backend"), $venvUvicorn
} else {
    & pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install Python dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "[Backend] Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
    $backendJob = Start-Job -ScriptBlock {
        param($dir)
        Set-Location $dir
        uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    } -ArgumentList (Join-Path $ProjectRoot "backend")
}
Pop-Location

# Start frontend
Write-Host "[Frontend] Installing dependencies..." -ForegroundColor Cyan
Push-Location (Join-Path $ProjectRoot "frontend")
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install Node.js dependencies" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "[Frontend] Starting Vite dev server on http://localhost:5173" -ForegroundColor Green
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList (Join-Path $ProjectRoot "frontend")
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Services Running:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "  API Docs: http://localhost:8000/v1/docs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Wait for either job to complete (or user to press Ctrl+C)
try {
    while ($true) {
        $backendRunning = $backendJob.State -eq 'Running'
        $frontendRunning = $frontendJob.State -eq 'Running'
        
        if (-not $backendRunning) {
            Write-Host "[Backend] Process exited unexpectedly!" -ForegroundColor Red
            Receive-Job $backendJob
            break
        }
        if (-not $frontendRunning) {
            Write-Host "[Frontend] Process exited unexpectedly!" -ForegroundColor Red
            Receive-Job $frontendJob
            break
        }
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "All services stopped." -ForegroundColor Green
}
