-- Migration: Add surat_numbers table for auto-generated surat numbers
-- Run this if you have existing database

-- Create surat_numbers table
CREATE TABLE IF NOT EXISTS surat_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prefix VARCHAR(10) NOT NULL,
    nomor_urut INTEGER NOT NULL,
    bulan VARCHAR(2) NOT NULL,
    tahun INTEGER NOT NULL,
    jenis_surat VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'reserved' NOT NULL, -- 'reserved' or 'confirmed'
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(prefix, nomor_urut, tahun)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_surat_numbers_prefix_tahun ON surat_numbers(prefix, tahun);
CREATE INDEX IF NOT EXISTS idx_surat_numbers_status ON surat_numbers(status);

-- Create cleanup function for old reserved numbers (optional, runs daily)
CREATE OR REPLACE FUNCTION cleanup_old_reserved_numbers()
RETURNS void AS $$
BEGIN
    -- Delete reserved numbers older than 24 hours
    DELETE FROM surat_numbers 
    WHERE status = 'reserved' 
    AND reserved_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

COMMIT;
