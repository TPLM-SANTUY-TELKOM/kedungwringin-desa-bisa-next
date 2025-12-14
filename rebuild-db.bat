@echo off
title Kedungwringin - Rebuild Database
color 0E

echo ========================================
echo   KEDUNGWRINGIN - REBUILD DATABASE
echo ========================================
echo.
echo [PERINGATAN PENTING]
echo ========================================
echo Script ini akan melakukan:
echo   1. docker compose down -v
echo      - Menghentikan semua container
echo      - Menghapus SEMUA volume (termasuk data database)
echo      - SEMUA DATA AKAN HILANG PERMANEN!
echo.
echo   2. docker compose build
echo      - Rebuild semua container dari awal
echo.
echo ========================================
echo.
echo [PENTING] BACKUP DATA TERLEBIH DAHULU!
echo ========================================
echo Sebelum melanjutkan, pastikan Anda sudah:
echo   1. Backup database PostgreSQL
echo      Gunakan: docker exec -t kedungwringin-db pg_dump -U postgres kedungwringin ^> backup.sql
echo.
echo   2. Atau backup volume secara manual
echo      Volume name: kedungwringin-desa-bisa-next_postgres_data
echo.
echo   3. Simpan backup di lokasi yang aman
echo.
echo ========================================
echo.

:: Change to script directory
cd /d "%~dp0"

:: Check if docker-compose.yml exists
if not exist "docker-compose.yml" (
    echo [ERROR] File docker-compose.yml tidak ditemukan!
    echo Pastikan berada di folder project yang benar.
    pause
    exit /b 1
)

:: Check if Docker is installed and running
echo [CHECK] Memeriksa Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak ditemukan!
    echo Silakan install Docker Desktop dari https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak berjalan!
    echo Silakan jalankan Docker Desktop terlebih dahulu.
    pause
    exit /b 1
)
echo [OK] Docker berjalan
echo.

:: ========================================
:: KONFIRMASI PERTAMA
:: ========================================
echo ========================================
echo   KONFIRMASI 1/3
echo ========================================
echo.
echo Apakah Anda sudah melakukan BACKUP data?
echo.
set /p CONFIRM1="Ketik 'YA' jika sudah backup dan ingin melanjutkan: "
if /i not "%CONFIRM1%"=="YA" (
    echo.
    echo [BATAL] Operasi dibatalkan.
    echo Silakan backup data terlebih dahulu sebelum melanjutkan.
    pause
    exit /b 0
)
echo.

:: ========================================
:: KONFIRMASI KEDUA
:: ========================================
echo ========================================
echo   KONFIRMASI 2/3
echo ========================================
echo.
echo PERINGATAN: Semua data database akan dihapus PERMANEN!
echo.
set /p CONFIRM2="Ketik 'HAPUS' untuk mengkonfirmasi penghapusan data: "
if /i not "%CONFIRM2%"=="HAPUS" (
    echo.
    echo [BATAL] Operasi dibatalkan.
    echo Anda tidak mengkonfirmasi penghapusan data.
    pause
    exit /b 0
)
echo.

:: ========================================
:: KONFIRMASI KETIGA
:: ========================================
echo ========================================
echo   KONFIRMASI 3/3
echo ========================================
echo.
echo Konfirmasi terakhir:
echo   - Container akan dihentikan
echo   - Volume akan dihapus (SEMUA DATA HILANG)
echo   - Container akan di-rebuild
echo.
set /p CONFIRM3="Ketik 'LANJUTKAN' untuk memulai proses rebuild: "
if /i not "%CONFIRM3%"=="LANJUTKAN" (
    echo.
    echo [BATAL] Operasi dibatalkan.
    echo Anda tidak mengkonfirmasi untuk melanjutkan.
    pause
    exit /b 0
)
echo.

:: ========================================
:: PROSES REBUILD
:: ========================================
echo ========================================
echo   MEMULAI PROSES REBUILD
echo ========================================
echo.

:: Step 1: Stop containers and remove volumes
echo [1/2] Menghentikan container dan menghapus volume...
echo.
docker compose down -v
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal menjalankan docker compose down -v!
    pause
    exit /b 1
)
echo.
echo [OK] Container dihentikan dan volume dihapus
echo.

:: Step 2: Build containers
echo [2/2] Rebuild container...
echo Ini mungkin memakan waktu beberapa menit...
echo.
docker compose build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal rebuild container!
    pause
    exit /b 1
)
echo.
echo [OK] Container berhasil di-rebuild
echo.

:: ========================================
:: SELESAI
:: ========================================
echo ========================================
echo   REBUILD SELESAI
echo ========================================
echo.
echo [INFO] Langkah selanjutnya:
echo   1. Jalankan start-app.bat untuk memulai aplikasi
echo   2. Atau jalankan: docker compose up -d
echo   3. Database akan diinisialisasi ulang dengan struktur baru
echo.
echo [CATATAN] Semua data lama sudah dihapus.
echo          Jika ada data penting, restore dari backup.
echo.
pause

