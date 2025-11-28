# PowerShell script untuk menjalankan Kedungwringin Web App
# Lebih advanced dengan error handling yang lebih baik

Write-Host "========================================" -ForegroundColor Green
Write-Host "  KEDUNGWRINGIN - SISTEM INFORMASI DESA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Function to check if command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
if (-not (Test-Command "node")) {
    Write-Host "[ERROR] Node.js tidak ditemukan!" -ForegroundColor Red
    Write-Host "Silakan install Node.js dari https://nodejs.org/" -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}
$nodeVersion = node --version
Write-Host "[OK] Node.js terdeteksi: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check Docker
Write-Host "[2/5] Checking Docker..." -ForegroundColor Yellow
if (-not (Test-Command "docker")) {
    Write-Host "[ERROR] Docker tidak ditemukan!" -ForegroundColor Red
    Write-Host "Silakan install Docker Desktop dari https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

try {
    docker ps | Out-Null
    Write-Host "[OK] Docker berjalan" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Docker tidak berjalan!" -ForegroundColor Yellow
    Write-Host "Mencoba menjalankan Docker Desktop..." -ForegroundColor Yellow
    
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
        Write-Host "Menunggu Docker Desktop dimulai..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    } else {
        Write-Host "[ERROR] Docker Desktop tidak ditemukan di path default!" -ForegroundColor Red
        Read-Host "Tekan Enter untuk keluar"
        exit 1
    }
}
Write-Host ""

# Check and install dependencies
Write-Host "[3/5] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies belum terinstall, menginstall..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Gagal install dependencies!" -ForegroundColor Red
        Read-Host "Tekan Enter untuk keluar"
        exit 1
    }
    Write-Host "[OK] Dependencies terinstall" -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies sudah terinstall" -ForegroundColor Green
}
Write-Host ""

# Start Docker container
Write-Host "[4/5] Starting database..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Gagal menjalankan database!" -ForegroundColor Red
    Write-Host "Pastikan Docker Desktop sudah berjalan." -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}
Write-Host "Menunggu database siap..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "[OK] Database berjalan" -ForegroundColor Green
Write-Host ""

# Start development server
Write-Host "[5/5] Starting web application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Web app akan berjalan di:" -ForegroundColor Green
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Yellow
Write-Host ""

# Open browser after 3 seconds
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
} | Out-Null

# Run npm dev
npm run dev

# Cleanup on exit
Write-Host ""
Write-Host "Menghentikan database..." -ForegroundColor Yellow
docker-compose down
Write-Host "Selesai!" -ForegroundColor Green

