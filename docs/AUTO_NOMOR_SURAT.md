# Auto-Generated Nomor Surat System

## Overview
Sistem otomatis untuk generate nomor surat dengan format yang sesuai dan mencegah race condition.

## Format Nomor Surat
- **Surat Pengantar (Umum & Kepolisian)**: `145/Nomor Urut/Bulan/Tahun`
- **SKTM**: `421/Nomor Urut/Bulan/Tahun`
- **Suket Domisili**: `470/Nomor Urut/Bulan/Tahun`
- **Suket Usaha**: `581/Nomor Urut/Bulan/Tahun`
- **Suket Umum**: `145/Nomor Urut/Bulan/Tahun`

Contoh: `145/0001/11/2024`

## Cara Kerja

### 1. Reserve Nomor (Saat Preview)
Ketika user klik tombol "Preview Surat":
- Sistem generate nomor urut berikutnya untuk jenis surat tersebut
- Nomor di-reserve di database dengan status `reserved`
- User bisa lihat preview dengan nomor yang sudah di-reserve

### 2. Confirm Nomor (Saat Cetak)
Ketika user klik tombol "Cetak":
- Sistem update status nomor dari `reserved` menjadi `confirmed`
- Nomor tersebut sudah fix dan tidak bisa digunakan lagi

### 3. Cancel Reservation (Opsional)
Jika user tidak jadi cetak:
- Reserved number bisa di-cleanup (auto delete setelah 24 jam)
- Atau user bisa kembali dan sistem akan buat reserve baru

## Database Schema

```sql
CREATE TABLE surat_numbers (
    id UUID PRIMARY KEY,
    prefix VARCHAR(10),           -- '145', '421', '470', '581'
    nomor_urut INTEGER,            -- 1, 2, 3, ...
    bulan VARCHAR(2),              -- '01', '02', ..., '12'
    tahun INTEGER,                 -- 2024, 2025, ...
    jenis_surat VARCHAR(100),      -- 'surat-keterangan-umum', dll
    status VARCHAR(20),            -- 'reserved' atau 'confirmed'
    reserved_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    UNIQUE(prefix, nomor_urut, tahun)
);
```

## API Endpoints

### POST /api/surat-number
Reserve nomor surat baru
```json
Request:
{
  "jenisSurat": "surat-keterangan-umum"
}

Response:
{
  "id": "uuid",
  "nomorSurat": "145/0001/11/2024",
  "prefix": "145",
  "nomorUrut": 1,
  "bulan": "11",
  "tahun": 2024
}
```

### PATCH /api/surat-number
Confirm reserved number
```json
Request:
{
  "id": "uuid"
}

Response:
{
  "success": true
}
```

### DELETE /api/surat-number?id=uuid
Cancel reservation (delete reserved number)

## Migration untuk Database Existing

Jalankan SQL migration:
```bash
docker exec -i kedungwringin-db psql -U postgres -d kedungwringin < docker/migrations/001_add_surat_numbers.sql
```

Atau manual:
```bash
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin
```
Lalu paste isi file `001_add_surat_numbers.sql`

## Testing

1. **Test Reserve Nomor**
   - Isi form Surat Keterangan Umum
   - Klik "Preview Surat"
   - Cek nomor surat muncul otomatis (format: 145/0001/11/2024)

2. **Test Confirm Nomor**
   - Di preview page, klik "Cetak"
   - Nomor sudah confirmed di database

3. **Test Sequential Numbers**
   - Buat beberapa surat berturut-turut
   - Nomor urut akan increment: 0001, 0002, 0003, dst

4. **Test Different Year**
   - Nomor urut reset setiap tahun baru
   - Tahun 2024: 145/0001/11/2024
   - Tahun 2025: 145/0001/01/2025

## Prevention Race Condition

Sistem menggunakan:
1. **UNIQUE constraint** di database: `UNIQUE(prefix, nomor_urut, tahun)`
2. **Transaction-based insert**: Jika 2 user generate bersamaan, hanya 1 yang sukses
3. **Status tracking**: Reserved vs Confirmed untuk menghindari konflik

## Apply ke Surat Lain

Untuk apply sistem ini ke jenis surat lain:

1. Pastikan prefix sudah ada di `SURAT_PREFIX_MAP` (file: `/api/surat-number/route.ts`)
2. Update form component (contoh: `SuratFormTidakMampu.tsx`):
   - Tambah state `isGeneratingNumber` dan `reservedNumberId`
   - Update `handlePreview` untuk call API
   - Disable input nomor surat (readonly)
3. Update preview component (contoh: `PreviewTidakMampu.tsx`):
   - Tambah prop `reservedNumberId`
   - Update `handlePrint` untuk confirm nomor
4. Update preview page routing untuk pass `reservedNumberId`

## Notes

- Nomor urut increment per tahun (reset tiap tahun baru)
- Reserved numbers auto-cleanup setelah 24 jam (opsional)
- Sistem sudah handle concurrent requests
- Format nomor bisa di-customize di API endpoint
