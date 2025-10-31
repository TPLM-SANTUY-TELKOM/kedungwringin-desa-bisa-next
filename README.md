# Kedungwringin - Sistem Informasi Desa

Website sistem informasi desa untuk mengelola data penduduk dan surat-surat desa.

## Tech Stack

- **Framework**: Next.js 16 dengan App Router
- **UI**: React 19, Tailwind CSS 4, Radix UI
- **Database**: PostgreSQL (dengan Docker)
- **Language**: TypeScript

## Prerequisites

Sebelum menjalankan project, pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) (v20 atau lebih baru)
- [Docker](https://www.docker.com/get-started) dan Docker Compose
- npm, yarn, pnpm, atau bun

## Setup Development

### 1. Clone repository

```bash
git clone <repository-url>
cd TPLM-KEDUNGWRINGIN--NEXT
```

### 2. Install dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Setup database dengan Docker

Jalankan PostgreSQL database menggunakan Docker Compose:

```bash
docker-compose up -d
```

Perintah ini akan:
- Membuat container PostgreSQL dengan nama `kedungwringin-db`
- Database akan berjalan di port `5432`
- Otomatis menjalankan script inisialisasi database (`docker/init.sql`)
- Membuat schema, table, function, dan sample data

Untuk mengecek status container:

```bash
docker-compose ps
```

Untuk melihat logs database:

```bash
docker-compose logs postgres
```

Untuk menghentikan database:

```bash
docker-compose down
```

Untuk menghentikan dan menghapus semua data (termasuk volume):

```bash
docker-compose down -v
```

### 4. Environment Variables

File `.env.local` sudah dibuat dengan konfigurasi default:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=kedungwringin
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Anda bisa mengubah nilai-nilai tersebut sesuai kebutuhan. Pastikan nilai di `.env.local` sama dengan nilai di `docker-compose.yml`.

### 5. Jalankan development server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## Database Management

### Akses PostgreSQL CLI

Untuk mengakses PostgreSQL shell:

```bash
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin
```

### Sample Data

Database sudah include sample data:
- 1 Admin user
- 2 Data penduduk untuk testing

### Database Schema

Database memiliki struktur sebagai berikut:

**Tables:**
- `penduduk` - Data penduduk desa
- `surat` - Data surat-surat yang diterbitkan
- `profiles` - Profile pengguna
- `user_roles` - Role pengguna (admin/user)

**Functions:**
- `get_next_surat_number()` - Generate nomor surat otomatis
- `has_role()` - Cek role user
- `search_penduduk_by_nik()` - Cari penduduk berdasarkan NIK
- `submit_public_surat()` - Submit surat dari public

## Project Structure

```
├── docker/              # Docker configuration
│   └── init.sql        # Database initialization script
├── public/             # Static assets
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions & database clients
│       ├── client.ts  # Client-side database wrapper
│       ├── db.ts      # Server-side database connection
│       └── utils.ts   # Helper functions
├── docker-compose.yml  # Docker compose configuration
├── .env.local         # Environment variables
└── package.json       # Project dependencies
```

## Development Scripts

```bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm run start

# Linting
npm run lint
```

## Docker Commands Reference

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart database
docker-compose restart

# Remove all (including volumes)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

## Troubleshooting

### Database connection error

1. Pastikan Docker container berjalan: `docker-compose ps`
2. Cek logs: `docker-compose logs postgres`
3. Pastikan port 5432 tidak digunakan aplikasi lain
4. Verifikasi environment variables di `.env.local`

### Reset database

Jika ingin reset database ke kondisi awal:

```bash
docker-compose down -v
docker-compose up -d
```

Ini akan menghapus semua data dan membuat database baru dengan schema dan sample data.

## Production Deployment

Untuk deployment production, Anda bisa:

1. Deploy aplikasi Next.js ke [Vercel](https://vercel.com)
2. Setup PostgreSQL database di cloud provider (Railway, Neon, AWS RDS, dll)
3. Update environment variables dengan credential database production

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

This project is for educational purposes.
