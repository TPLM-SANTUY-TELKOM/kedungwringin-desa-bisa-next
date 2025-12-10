# Deployment ke Vercel (Step-by-step)

Panduan singkat supaya app jalan di Vercel dengan Postgres hosted (Neon/Railway/Vercel Postgres).

## 1) Siapkan database hosted
- Buat instance Postgres baru (contoh: Neon). Catat `host`, `port`, `database`, `user`, `password`, dan `DATABASE_URL`.
- Pastikan SSL aktif (kebanyakan provider default aktif).

## 2) Seed schema dari repo
- Jalankan sekali dari lokal untuk apply `docker/init.sql` ke DB baru:
  ```bash
  psql "postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require" -f docker/init.sql
  ```
- Kalau provider butuh `pgcrypto` untuk UUID, jalankan:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  ```

## 3) Import project ke Vercel
- Klik **Add New Project** → pilih repo ini.
- Build Command: `npm run build`
- Output Directory: `.next`
- Node.js Version: `20`

## 4) Set environment variables di Vercel
Tambahkan variables berikut (Production + Preview):
- `DATABASE_URL` = connection string dari provider (paling praktis), atau set manual:
  - `POSTGRES_HOST`
  - `POSTGRES_PORT`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
- `PGSSLMODE=require` (wajib jika DB butuh SSL)
- `POSTGRES_SSL=true` (opsional, nyalakan SSL di pool)
- `POSTGRES_POOL_MAX=5` (opsional; lebih aman untuk limit koneksi di serverless)

## 5) Deploy pertama
- Jalankan deploy di Vercel. Pastikan log tidak error saat konek DB.
- Setelah live, akses URL untuk memastikan halaman utama render.

## 6) Opsional: cek API/migrasi
- Endpoint `POST /api/migrate` ada kalau butuh recreate tabel `surat_form_entries`. Hanya perlu jika schema itu belum ada.
- Bisa tes cepat di browser/REST client: `POST https://<your-vercel-domain>/api/migrate`.

Selesai. Next deploy otomatis ketika push ke branch yang dihubungkan ke Vercel.***
