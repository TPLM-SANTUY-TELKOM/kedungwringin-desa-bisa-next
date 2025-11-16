import { NextRequest, NextResponse } from "next/server";

import { saveSuratFormEntryFromPreview } from "@/lib/suratFormEntryService";
import { query } from "@/lib/db";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

const clampLimit = (value: number) => {
  if (!Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.min(Math.max(value, 1), MAX_LIMIT);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const kategori = searchParams.get("kategori");
    const jenis = searchParams.get("jenis");
    const status = searchParams.get("status");
    const limit = clampLimit(Number(searchParams.get("limit") ?? DEFAULT_LIMIT));
    const rawOffset = Number(searchParams.get("offset") ?? 0);
    const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;

    const filters: string[] = [];
    const values: unknown[] = [];

    if (kategori) {
      values.push(kategori);
      filters.push(`kategori = $${values.length}`);
    }

    if (jenis) {
      values.push(jenis);
      filters.push(`jenis_surat = $${values.length}`);
    }

    if (status) {
      values.push(status);
      filters.push(`status = $${values.length}`);
    }

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      const idx = values.length;
      filters.push(
        `(LOWER(pemohon_nama) LIKE $${idx} OR LOWER(title) LIKE $${idx} OR LOWER(slug) LIKE $${idx} OR pemohon_nik ILIKE $${idx} OR nomor_surat ILIKE $${idx})`,
      );
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const listParams = [...values, limit, offset];
    const limitIndex = values.length + 1;
    const offsetIndex = values.length + 2;

    const entriesQuery = `
      SELECT id, jenis_surat, kategori, slug, title, nomor_surat, tanggal_surat, pemohon_nama, pemohon_nik, status, bundle_key, created_at
      FROM surat_form_entries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitIndex}
      OFFSET $${offsetIndex}
    `;

    const totalQuery = `
      SELECT COUNT(*)::INT AS count
      FROM surat_form_entries
      ${whereClause}
    `;

    const [entriesResult, countResult] = await Promise.all([
      query(entriesQuery, listParams),
      query(totalQuery, values),
    ]);

    return NextResponse.json({
      entries: entriesResult.rows,
      totalCount: countResult.rows[0]?.count ?? 0,
    });
  } catch (error: unknown) {
    console.error("GET /api/surat-form-entries error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Gagal mengambil daftar surat" } },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, jenis, data } = body ?? {};

    if (!slug || !title || !data || typeof data !== "object") {
      return NextResponse.json(
        { error: { message: "Payload tidak lengkap. Sertakan slug, title, dan data." } },
        { status: 400 },
      );
    }

    const entry = await saveSuratFormEntryFromPreview({
      slug,
      title,
      jenis,
      data,
    });

    if (!entry) {
      return NextResponse.json(
        { error: { message: "Gagal menyimpan surat." } },
        { status: 500 },
      );
    }

    return NextResponse.json(entry);
  } catch (error: unknown) {
    console.error("POST /api/surat-form-entries error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Gagal menyimpan surat" } },
      { status: 500 },
    );
  }
}
