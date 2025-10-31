# Arsitektur Database PostgreSQL Lokal

## Struktur

### 1. Server-Side Database Layer (`/src/lib/db.ts`)
File ini berisi koneksi pool PostgreSQL dan hanya digunakan di **server-side** (API routes).

**PENTING**: Jangan import file ini di client components!

### 2. Client-Side API Wrapper (`/src/lib/client.ts`)
File ini adalah wrapper yang menggunakan `fetch` untuk memanggil API routes.
Dapat digunakan di client components dengan aman.

### 3. API Routes (`/src/app/api/`)
API routes yang menerima request dari client dan berkomunikasi dengan database:

- `/api/penduduk` - CRUD untuk table penduduk
- `/api/surat` - CRUD untuk table surat  
- `/api/profiles` - CRUD untuk table profiles
- `/api/rpc` - Memanggil PostgreSQL functions
- `/api/auth/session` - Session management

## Cara Penggunaan

### Di Client Components

```typescript
import { db } from "@/lib/client";

// SELECT
const { data, error } = await db.from('penduduk').select('*');

// INSERT
const { data, error } = await db.from('penduduk').insert({
  nik: '1234567890123456',
  nama: 'John Doe',
  // ...
});

// UPDATE
const { data, error } = await db
  .from('penduduk')
  .update({ nama: 'Jane Doe' })
  .eq('id', 'some-uuid');

// DELETE
const { data, error } = await db
  .from('penduduk')
  .delete()
  .eq('id', 'some-uuid');

// RPC (call PostgreSQL function)
const { data, error } = await db.rpc('search_penduduk_by_nik', {
  p_nik: '1234'
});
```

### Di Server Components / API Routes

```typescript
import { db } from "@/lib/db";

// SELECT
const { data, error } = await db.from('penduduk').select('*');

// RPC
const { data, error } = await db.rpc('get_next_surat_number', {
  p_jenis_surat: 'SKTM'
});
```

## Database Schema

Lihat `/docker/init.sql` untuk schema lengkap.

### Tables:
- **penduduk** - Data penduduk desa
- **surat** - Data surat yang diterbitkan
- **profiles** - Profile pengguna
- **user_roles** - Role pengguna (admin/user)

### Functions:
- **get_next_surat_number(p_jenis_surat)** - Generate nomor surat
- **has_role(_role, _user_id)** - Check user role
- **search_penduduk_by_nik(p_nik)** - Search penduduk by NIK
- **submit_public_surat(...)** - Submit surat dari public

## Environment Variables

File `.env.local`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=kedungwringin
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## Arsitektur PostgreSQL Native

Aplikasi ini menggunakan PostgreSQL lokal dengan Docker, tanpa dependency eksternal seperti Supabase.

**Komponen utama:**
1. ✅ PostgreSQL 16: Database server di Docker
2. ✅ `pg` (node-postgres): Driver PostgreSQL untuk Node.js
3. ✅ Server-side layer: `/src/lib/db.ts` - Koneksi pool PostgreSQL
4. ✅ Client wrapper: `/src/lib/client.ts` - Fetch-based API wrapper
5. ✅ API routes: Endpoint untuk CRUD dan RPC functions

**Keuntungan:**
- 🚀 Full control atas database schema
- 🔒 Data tersimpan lokal (development) atau self-hosted (production)
- 🎯 Tidak tergantung pada third-party cloud service
- 💰 Gratis untuk development dan production
