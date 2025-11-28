@echo off
title Kedungwringin - Sistem Informasi Desa
color 0A

echo ========================================
echo   KEDUNGWRINGIN - SISTEM INFORMASI DESA
echo ========================================
echo.

:: Change to script directory
cd /d "%~dp0"

:: Check if required files exist
echo [1/8] Checking required files...
if not exist "package.json" (
    echo [ERROR] File package.json tidak ditemukan!
    echo Pastikan berada di folder project yang benar.
    pause
    exit /b 1
)

if not exist "docker-compose.yml" (
    echo [ERROR] File docker-compose.yml tidak ditemukan!
    echo Pastikan berada di folder project yang benar.
    pause
    exit /b 1
)
echo [OK] File penting ditemukan
echo.

:: Pull latest changes from git
echo [2/8] Pulling latest changes from git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Git tidak ditemukan! Melewati git pull...
) else (
    :: Check if this is a Git repository
    if not exist ".git" (
        echo [WARNING] Repository belum di-clone atau bukan Git repository!
        echo Melewati git pull...
        echo.
        echo [INFO] Jika ini device baru, silakan clone repository dengan:
        echo git clone https://github.com/TPLM-SANTUY-TELKOM/kedungwringin-desa-bisa-next
        echo.
    ) else (
        :: Pull from main branch explicitly
        git pull origin main
        if %errorlevel% neq 0 (
            echo [WARNING] Git pull gagal atau ada konflik! Melanjutkan dengan kode lokal...
        ) else (
            echo [OK] Kode terbaru dari branch main berhasil diambil
        )
    )
)
echo.

:: Check if Node.js is installed
echo [3/8] Checking Node.js...
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
echo [4/8] Checking Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak ditemukan!
    echo Silakan install Docker Desktop dari https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

:: Check if Docker is running, retry if not
set DOCKER_RETRY_COUNT=0
set MAX_RETRIES=30

docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker berjalan
    goto DOCKER_CHECK_DONE
)

:: Docker is not running, try to start it
echo [WARNING] Docker tidak berjalan!
echo Mencoba menjalankan Docker Desktop...

:: Try to start Docker Desktop
if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    goto DOCKER_STARTED
)
if exist "C:\Program Files (x86)\Docker\Docker\Docker Desktop.exe" (
    start "" "C:\Program Files (x86)\Docker\Docker\Docker Desktop.exe"
    goto DOCKER_STARTED
)

:: Docker Desktop not found
echo [ERROR] Docker Desktop tidak ditemukan di path default!
echo Silakan jalankan Docker Desktop secara manual.
pause
exit /b 1

:DOCKER_STARTED
echo Menunggu Docker Desktop dimulai...
echo.

:: Retry loop to check if Docker is ready
:DOCKER_RETRY
timeout /t 3 /nobreak >nul
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker berhasil dimulai dan siap digunakan!
    goto DOCKER_CHECK_DONE
)

set /a DOCKER_RETRY_COUNT+=1
echo [%DOCKER_RETRY_COUNT%/%MAX_RETRIES%] Menunggu Docker Desktop siap...

if %DOCKER_RETRY_COUNT% geq %MAX_RETRIES% (
    echo.
    echo [ERROR] Docker Desktop tidak merespons setelah %MAX_RETRIES% kali percobaan!
    echo Pastikan Docker Desktop sudah berjalan dengan benar.
    echo Silakan tutup script ini dan jalankan Docker Desktop secara manual, lalu coba lagi.
    pause
    exit /b 1
)

goto DOCKER_RETRY

:DOCKER_CHECK_DONE
echo.

:: Check if node_modules exists, if not install dependencies
echo [5/8] Checking dependencies...
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
echo [6/8] Starting database...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menjalankan database!
    echo Pastikan Docker Desktop sudah berjalan.
    pause
    exit /b 1
)
echo Menunggu database siap (ini mungkin memakan waktu 10-30 detik)...
timeout /t 3 /nobreak >nul

:: Wait for database to be healthy
set DB_RETRY_COUNT=0
set MAX_DB_RETRIES=20

:DB_RETRY
docker-compose ps | findstr "healthy" >nul
if %errorlevel% equ 0 (
    echo [OK] Database siap digunakan!
    goto DB_CHECK_DONE
)
set /a DB_RETRY_COUNT+=1
if %DB_RETRY_COUNT% geq %MAX_DB_RETRIES% (
    echo [WARNING] Database belum fully ready setelah %MAX_DB_RETRIES% kali percobaan!
    echo Melanjutkan dengan asumsi database sudah siap...
    echo Jika masih ada error, tunggu beberapa detik dan refresh browser.
    goto DB_CHECK_DONE
)
timeout /t 2 /nobreak >nul
echo [%DB_RETRY_COUNT%/%MAX_DB_RETRIES%] Menunggu database siap...
goto DB_RETRY

:DB_CHECK_DONE
echo.

:: Build application for production
echo [7/8] Building application for production...
echo Ini mungkin memakan waktu beberapa menit...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build gagal!
    echo Periksa error di atas dan perbaiki sebelum melanjutkan.
    pause
    exit /b 1
)
echo [OK] Build berhasil!
echo.

:: Start production server
echo [8/8] Starting production server...
echo.
echo ========================================
echo   Web app akan berjalan di:
echo   http://localhost:3000
echo   Mode: PRODUCTION
echo ========================================
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

:: Open browser after 5 seconds (give server time to start)
timeout /t 5 /nobreak >nul
start http://localhost:3000

:: Run npm start (production mode)
call npm run start

:: If script exits, stop containers
echo.
echo Menghentikan database...
docker-compose down
echo Selesai!

