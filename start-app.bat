@echo off
title Kedungwringin - Sistem Informasi Desa
color 0A

echo ========================================
echo   KEDUNGWRINGIN - SISTEM INFORMASI DESA
echo ========================================
echo.

:: Change to script directory
cd /d "%~dp0"

:: Check if Node.js is installed
echo [1/5] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan!
    echo Silakan install Node.js dari https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo [OK] Node.js terdeteksi
echo.

:: Check if Docker is installed and running
echo [2/5] Checking Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak ditemukan!
    echo Silakan install Docker Desktop dari https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Docker tidak berjalan!
    echo Mencoba menjalankan Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Menunggu Docker Desktop dimulai...
    timeout /t 10 /nobreak >nul
    echo Silakan tunggu hingga Docker Desktop siap, lalu jalankan script ini lagi.
    pause
    exit /b 1
)
echo [OK] Docker berjalan
echo.

:: Check if node_modules exists, if not install dependencies
echo [3/5] Checking dependencies...
if not exist "node_modules" (
    echo Dependencies belum terinstall, menginstall...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal install dependencies!
        pause
        exit /b 1
    )
    echo [OK] Dependencies terinstall
) else (
    echo [OK] Dependencies sudah terinstall
)
echo.

:: Start Docker container
echo [4/5] Starting database...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menjalankan database!
    echo Pastikan Docker Desktop sudah berjalan.
    pause
    exit /b 1
)
echo Menunggu database siap...
timeout /t 5 /nobreak >nul
echo [OK] Database berjalan
echo.

:: Start development server
echo [5/5] Starting web application...
echo.
echo ========================================
echo   Web app akan berjalan di:
echo   http://localhost:3000
echo ========================================
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

:: Open browser after 3 seconds
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: Run npm dev
call npm run dev

:: If script exits, stop containers
echo.
echo Menghentikan database...
docker-compose down
echo Selesai!

