# Script untuk membuat tabel surat_numbers
# Run dengan: .\create-surat-numbers-table.ps1

Write-Host "Creating surat_numbers table..." -ForegroundColor Green

$sql = @"
CREATE TABLE IF NOT EXISTS surat_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prefix VARCHAR(10) NOT NULL,
    nomor_urut INTEGER NOT NULL,
    bulan VARCHAR(2) NOT NULL,
    tahun INTEGER NOT NULL,
    jenis_surat VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'reserved' NOT NULL,
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(prefix, nomor_urut, tahun)
);

CREATE INDEX IF NOT EXISTS idx_surat_numbers_prefix_tahun ON surat_numbers(prefix, tahun);
CREATE INDEX IF NOT EXISTS idx_surat_numbers_status ON surat_numbers(status);
"@

docker exec -i kedungwringin-db psql -U postgres -d kedungwringin -c $sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "Table created successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to create table" -ForegroundColor Red
}
