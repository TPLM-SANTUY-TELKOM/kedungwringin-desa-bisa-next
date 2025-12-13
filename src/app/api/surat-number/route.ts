import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Mapping jenis surat ke prefix nomor
const SURAT_PREFIX_MAP: Record<string, string> = {
  "surat-keterangan-umum": "145",
  "surat-keterangan-belum-pernah-kawin": "145",
  "surat-keterangan-tidak-mampu": "421",
  "surat-keterangan-domisili-tempat-tinggal": "470",
  "surat-keterangan-domisili-usaha": "470",
  "surat-keterangan-usaha": "581",
  "surat-keterangan-wali-hakim": "145", // Mengikuti pola surat keterangan umum
  "surat-pengantar-umum": "145",
  "surat-pengantar-kepolisian": "145",
  "surat-pengantar-izin-keramaian": "145",
  "formulir-pengantar-nikah": "472",
  "formulir-surat-izin-orang-tua": "472",
  "formulir-surat-keterangan-kematian": "474",
  "surat-keterangan-wali-nikah": "474",
  "surat-pengantar-numpang-nikah": "472",
};

// Reserve nomor surat (saat preview)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST /api/surat-number - Request body:", body);
    
    const { jenisSurat, nomorUrutManual } = body;

    if (!jenisSurat) {
      console.error("Missing jenisSurat in request");
      return NextResponse.json(
        { error: "Jenis surat harus diisi" },
        { status: 400 }
      );
    }

    const prefix = SURAT_PREFIX_MAP[jenisSurat];
    if (!prefix) {
      console.error("Invalid jenisSurat:", jenisSurat);
      return NextResponse.json(
        { error: "Jenis surat tidak valid" },
        { status: 400 }
      );
    }

    console.log("Using prefix:", prefix);

    // Get current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    let finalNomorUrut: number;
    
    // Jika nomor urut manual diisi, gunakan itu (dengan validasi dan cek duplikasi)
    if (nomorUrutManual) {
      const parsedNomorUrut = parseInt(nomorUrutManual);
      if (isNaN(parsedNomorUrut) || parsedNomorUrut <= 0) {
        return NextResponse.json(
          { error: "Nomor urut manual tidak valid. Harus berupa angka positif." },
          { status: 400 }
        );
      }
      
      // Check for duplication before attempting to insert
      const existingNumber = await query(
        `SELECT id FROM surat_numbers WHERE prefix = $1 AND nomor_urut = $2 AND tahun = $3`,
        [prefix, parsedNomorUrut, year]
      );
      
      if (existingNumber.rows.length > 0) {
        return NextResponse.json(
          { error: `Nomor urut ${String(parsedNomorUrut).padStart(4, "0")} sudah digunakan (sudah dikonfirmasi). Silakan gunakan nomor lain atau kosongkan untuk auto-generate.` },
          { status: 409 } // Conflict
        );
      }
      
      finalNomorUrut = parsedNomorUrut;
      console.log("Manual nomor urut will be:", finalNomorUrut);
    } else {
      // Auto-generate: Get the highest nomor_urut for this prefix and year
      console.log("Fetching existing numbers for:", { prefix, year });
      const maxNumberResult = await query(
        `SELECT MAX(nomor_urut) as max_nomor FROM surat_numbers WHERE prefix = $1 AND tahun = $2`,
        [prefix, year]
      );

      console.log("Max number result:", maxNumberResult.rows);

      const maxNomor = maxNumberResult.rows[0]?.max_nomor;
      finalNomorUrut = maxNomor ? maxNomor + 1 : 1;
      console.log("Auto-generated next number will be:", finalNomorUrut);
    }

    // Reserve the number (status: reserved)
    const insertResult = await query(
      `INSERT INTO surat_numbers (prefix, nomor_urut, bulan, tahun, jenis_surat, status, reserved_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [prefix, finalNomorUrut, month, year, jenisSurat, "reserved", new Date().toISOString()]
    );

    if (!insertResult.rows || insertResult.rows.length === 0) {
      console.error("No data returned from insert");
      return NextResponse.json(
        { error: "Gagal mereserve nomor surat" },
        { status: 500 }
      );
    }

    const reservedData = insertResult.rows[0];
    console.log("Reserved data:", reservedData);

    // Format nomor surat: 145/0001/11/2024
    const nomorSurat = `${prefix}/${String(finalNomorUrut).padStart(4, "0")}/${month}/${year}`;

    console.log("Generated nomor surat:", nomorSurat);

    return NextResponse.json({
      id: reservedData.id,
      nomorSurat,
      prefix,
      nomorUrut: finalNomorUrut,
      bulan: month,
      tahun: year,
      tanggalSurat: new Date().toISOString().slice(0, 10), // Ensure tanggalSurat is returned
    });
  } catch (error: any) {
    console.error("Error in POST /api/surat-number:", error);
    
    // Handle unique constraint violation (duplicate)
    if (error.code === "23505" || error.message?.includes("duplicate") || error.message?.includes("unique")) {
      return NextResponse.json(
        { error: "Nomor urut yang Anda masukkan sudah digunakan. Silakan gunakan nomor lain atau kosongkan untuk auto-generate." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Terjadi kesalahan server", details: error.message },
      { status: 500 }
    );
  }
}

// Confirm nomor surat (saat cetak)
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID nomor surat harus diisi" },
        { status: 400 }
      );
    }

    // Update status to confirmed
    const updateResult = await query(
      `UPDATE surat_numbers 
       SET status = $1, confirmed_at = $2 
       WHERE id = $3 AND status = $4
       RETURNING *`,
      ["confirmed", new Date().toISOString(), id, "reserved"]
    );

    if (updateResult.rows.length === 0) {
      console.error("No reservation found with id:", id);
      return NextResponse.json(
        { error: "Nomor surat tidak ditemukan atau sudah dikonfirmasi" },
        { status: 404 }
      );
    }

    console.log("Confirmed number:", updateResult.rows[0]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in PATCH /api/surat-number:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server", details: error.message },
      { status: 500 }
    );
  }
}

// Cancel reservation (jika user tidak jadi cetak)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID nomor surat harus diisi" },
        { status: 400 }
      );
    }

    // Delete reserved number
    const deleteResult = await query(
      `DELETE FROM surat_numbers WHERE id = $1 AND status = $2 RETURNING *`,
      [id, "reserved"]
    );

    if (deleteResult.rows.length === 0) {
      console.error("No reservation found with id:", id);
      return NextResponse.json(
        { error: "Nomor surat tidak ditemukan atau sudah dikonfirmasi" },
        { status: 404 }
      );
    }

    console.log("Deleted reservation:", deleteResult.rows[0]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/surat-number:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server", details: error.message },
      { status: 500 }
    );
  }
}
