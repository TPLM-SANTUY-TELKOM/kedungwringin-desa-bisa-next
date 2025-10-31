# Testing API Endpoints

## 1. Test Get All Penduduk

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/penduduk" -Method GET | ConvertTo-Json -Depth 10
```

## 2. Test Get All Surat (Without JOIN)

```powershell
# PowerShell - Simple query
Invoke-RestMethod -Uri "http://localhost:3000/api/surat" -Method GET | ConvertTo-Json -Depth 10
```

## 3. Test Get All Surat (With JOIN - Include Penduduk Data)

```powershell
# PowerShell - With JOIN to penduduk table
$uri = "http://localhost:3000/api/surat?columns=*,penduduk:penduduk_id"
Invoke-RestMethod -Uri $uri -Method GET | ConvertTo-Json -Depth 10
```

## 4. Test Get All Profiles (Admin)

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/profiles" -Method GET | ConvertTo-Json -Depth 10
```

## 5. Test RPC - Search Penduduk by NIK

```powershell
# PowerShell
$body = @{
    function = "search_penduduk_by_nik"
    params = @{
        p_nik = "3301012001010001"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/rpc" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10
```

## 6. Test RPC - Submit Surat

```powershell
# PowerShell - Get penduduk ID first
$penduduk = Invoke-RestMethod -Uri "http://localhost:3000/api/penduduk" -Method GET
$pendudukId = $penduduk[0].id

# Submit surat
$body = @{
    function = "submit_public_surat"
    params = @{
        p_jenis_surat = "SKTM"
        p_penduduk_id = $pendudukId
        p_keperluan = "Testing surat dari PowerShell"
        p_pejabat_ttd = "Kepala Desa Kedungwringin"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/rpc" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10
```

## 7. Test Direct Database Query

```powershell
# View all tables
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "\dt"

# View penduduk data
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT nik, nama, jenis_kelamin, alamat FROM penduduk;"

# View all penduduk columns
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT * FROM penduduk;"

# View surat data
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT * FROM surat;"

# View surat with JOIN to penduduk
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT s.nomor_surat, s.jenis_surat, s.keperluan, p.nama, p.nik FROM surat s LEFT JOIN penduduk p ON s.penduduk_id = p.id;"

# View profiles (admin)
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT * FROM profiles;"

# View user_roles
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT * FROM user_roles;"

# Search by NIK function
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT * FROM search_penduduk_by_nik('3301012001010001');"
```

## 8. Using Browser

Open your browser and navigate to:

- **Home Page**: http://localhost:3000
- **API Penduduk**: http://localhost:3000/api/penduduk
- **API Surat**: http://localhost:3000/api/surat
- **API Surat (with JOIN)**: http://localhost:3000/api/surat?columns=*,penduduk:penduduk_id
- **API Profiles**: http://localhost:3000/api/profiles

For POST/RPC endpoints, use browser extensions like:
- Thunder Client (VS Code Extension)
- Postman
- REST Client (VS Code Extension)

## 9. View Table Structure

```powershell
# View penduduk table structure
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "\d penduduk"

# View surat table structure
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "\d surat"

# View profiles table structure
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "\d profiles"

# View all functions
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "\df"

# View all enums
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "\dT"
```

## 10. Sample Data Summary

### Penduduk (2 records)
- NIK: 3301012001010001 - Budi Santoso (Laki-laki)
- NIK: 3301012002020002 - Siti Aminah (Perempuan)

### Admin (1 record)
- ID: 00000000-0000-0000-0000-000000000001
- Name: Admin Kedungwringin
- Role: admin

### Surat (varies)
Check current surat data:
```powershell
docker exec -it kedungwringin-db psql -U postgres -d kedungwringin -c "SELECT COUNT(*) FROM surat;"
```
