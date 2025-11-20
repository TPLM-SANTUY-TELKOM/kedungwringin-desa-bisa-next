import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST() {
  try {
    // Create surat_form_entries table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS surat_form_entries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        jenis_surat VARCHAR(50) NOT NULL,
        kategori VARCHAR(50) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        nomor_surat VARCHAR(255),
        tanggal_surat DATE,
        pemohon_penduduk_id UUID REFERENCES penduduk(id) ON DELETE SET NULL,
        pemohon_nama VARCHAR(255) NOT NULL,
        pemohon_nik VARCHAR(32),
        status VARCHAR(32) NOT NULL DEFAULT 'submitted',
        bundle_key VARCHAR(64),
        form_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    return NextResponse.json({ 
      success: true, 
      message: "Migration completed successfully" 
    });
  } catch (error: unknown) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Migration failed" 
      },
      { status: 500 }
    );
  }
}

