-- Create ENUM types
CREATE TYPE agama AS ENUM ('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu');
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE jenis_kelamin AS ENUM ('Laki-laki', 'Perempuan');
CREATE TYPE jenis_surat AS ENUM ('SKTM', 'Domisili', 'Usaha', 'SKCK', 'N1', 'N2', 'N3', 'N4', 'N5');
CREATE TYPE status_kawin AS ENUM ('Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati');
CREATE TYPE status_penduduk AS ENUM ('Aktif', 'Pindah', 'Meninggal');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    role app_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create penduduk table
CREATE TABLE IF NOT EXISTS penduduk (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nik VARCHAR(16) NOT NULL UNIQUE,
    no_kk VARCHAR(16) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    tempat_lahir VARCHAR(255) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin jenis_kelamin NOT NULL,
    agama agama NOT NULL,
    status_kawin status_kawin NOT NULL,
    pekerjaan VARCHAR(255),
    pendidikan VARCHAR(255),
    alamat TEXT NOT NULL,
    dusun VARCHAR(255) NOT NULL,
    rt VARCHAR(10) NOT NULL,
    rw VARCHAR(10) NOT NULL,
    status status_penduduk DEFAULT 'Aktif' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create surat table
CREATE TABLE IF NOT EXISTS surat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nomor_surat VARCHAR(255) NOT NULL UNIQUE,
    jenis_surat jenis_surat NOT NULL,
    penduduk_id UUID NOT NULL REFERENCES penduduk(id) ON DELETE CASCADE,
    keperluan TEXT NOT NULL,
    pejabat_ttd VARCHAR(255) NOT NULL,
    tanggal_surat DATE DEFAULT CURRENT_DATE NOT NULL,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create function to generate next surat number
CREATE OR REPLACE FUNCTION get_next_surat_number(p_jenis_surat jenis_surat)
RETURNS VARCHAR AS $$
DECLARE
    v_count INTEGER;
    v_year VARCHAR(4);
    v_month VARCHAR(2);
    v_next_number VARCHAR(255);
BEGIN
    v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    v_month := TO_CHAR(CURRENT_DATE, 'MM');
    
    SELECT COUNT(*) + 1 INTO v_count
    FROM surat
    WHERE jenis_surat = p_jenis_surat
    AND EXTRACT(YEAR FROM tanggal_surat) = EXTRACT(YEAR FROM CURRENT_DATE);
    
    v_next_number := LPAD(v_count::TEXT, 4, '0') || '/' || p_jenis_surat || '/' || v_month || '/' || v_year;
    
    RETURN v_next_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to check user role
CREATE OR REPLACE FUNCTION has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = _user_id 
        AND role = _role
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to search penduduk by NIK
CREATE OR REPLACE FUNCTION search_penduduk_by_nik(p_nik VARCHAR)
RETURNS TABLE (
    id UUID,
    nik VARCHAR,
    nama VARCHAR,
    tempat_lahir VARCHAR,
    tanggal_lahir DATE,
    jenis_kelamin jenis_kelamin,
    alamat TEXT,
    dusun VARCHAR,
    rt VARCHAR,
    rw VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nik,
        p.nama,
        p.tempat_lahir,
        p.tanggal_lahir,
        p.jenis_kelamin,
        p.alamat,
        p.dusun,
        p.rt,
        p.rw
    FROM penduduk p
    WHERE p.nik LIKE '%' || p_nik || '%';
END;
$$ LANGUAGE plpgsql;

-- Create function to submit public surat
CREATE OR REPLACE FUNCTION submit_public_surat(
    p_jenis_surat jenis_surat,
    p_keperluan TEXT,
    p_pejabat_ttd VARCHAR,
    p_penduduk_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_nomor_surat VARCHAR(255);
    v_surat_id UUID;
BEGIN
    v_nomor_surat := get_next_surat_number(p_jenis_surat);
    
    INSERT INTO surat (nomor_surat, jenis_surat, penduduk_id, keperluan, pejabat_ttd)
    VALUES (v_nomor_surat, p_jenis_surat, p_penduduk_id, p_keperluan, p_pejabat_ttd)
    RETURNING id INTO v_surat_id;
    
    RETURN json_build_object(
        'success', true,
        'surat_id', v_surat_id,
        'nomor_surat', v_nomor_surat
    );
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_penduduk_updated_at
    BEFORE UPDATE ON penduduk
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_penduduk_nik ON penduduk(nik);
CREATE INDEX idx_penduduk_no_kk ON penduduk(no_kk);
CREATE INDEX idx_surat_penduduk_id ON surat(penduduk_id);
CREATE INDEX idx_surat_jenis_surat ON surat(jenis_surat);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Insert sample admin user
INSERT INTO profiles (id, full_name, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Admin Kedungwringin', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample data penduduk (optional)
INSERT INTO penduduk (nik, no_kk, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_kawin, pekerjaan, pendidikan, alamat, dusun, rt, rw)
VALUES 
    ('3301012001010001', '3301010101010001', 'Budi Santoso', 'Jakarta', '2001-01-01', 'Laki-laki', 'Islam', 'Belum Kawin', 'Pelajar/Mahasiswa', 'SMA', 'Jl. Raya Desa No. 1', 'Kedungwringin', '001', '001'),
    ('3301012002020002', '3301010202020002', 'Siti Aminah', 'Bandung', '2002-02-02', 'Perempuan', 'Islam', 'Belum Kawin', 'Pelajar/Mahasiswa', 'SMA', 'Jl. Raya Desa No. 2', 'Kedungwringin', '002', '001')
ON CONFLICT (nik) DO NOTHING;

COMMIT;
