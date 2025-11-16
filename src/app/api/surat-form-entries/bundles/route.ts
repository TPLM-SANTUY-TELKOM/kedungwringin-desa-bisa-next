import { NextResponse } from "next/server";

import { NIKAH_BUNDLE_CODES } from "@/data/surat-form-meta";
import { query } from "@/lib/db";

const REQUIRED_SET = new Set(NIKAH_BUNDLE_CODES);

export async function GET() {
  try {
    const result = await query(
      `
        SELECT
          bundle_key,
          MIN(pemohon_nama) AS pemohon_nama,
          MIN(pemohon_nik) AS pemohon_nik,
          MAX(created_at) AS last_updated,
          ARRAY_AGG(
            json_build_object(
              'id', id,
              'jenis', jenis_surat,
              'slug', slug,
              'title', title,
              'created_at', created_at,
              'nomor_surat', nomor_surat
            )
            ORDER BY created_at DESC
          ) AS forms
        FROM surat_form_entries
        WHERE kategori = 'nikah'
          AND jenis_surat::text = ANY($1::text[])
          AND bundle_key IS NOT NULL
        GROUP BY bundle_key
        ORDER BY last_updated DESC
      `,
      [Array.from(REQUIRED_SET)],
    );

    const bundles = result.rows
      .filter((row) => row.bundle_key)
      .map((row) => {
        const formsRaw = Array.isArray(row.forms)
          ? (row.forms as Array<Record<string, unknown>>)
          : [];
        const dedupMap = new Map<string, Record<string, string | null>>();
        formsRaw.forEach((form) => {
          const jenis = String(form.jenis);
          const key = jenis.toUpperCase();
          if (!dedupMap.has(key)) {
            dedupMap.set(key, {
              id: String(form.id),
              jenis,
              slug: String(form.slug),
              title: String(form.title),
              created_at: String(form.created_at),
              nomor_surat: form.nomor_surat ? String(form.nomor_surat) : null,
            });
          }
        });

        const forms = Array.from(dedupMap.values()).sort(
          (a, b) =>
            NIKAH_BUNDLE_CODES.indexOf(a.jenis.toUpperCase()) -
            NIKAH_BUNDLE_CODES.indexOf(b.jenis.toUpperCase()),
        );

        const completedSet = new Set(forms.map((form) => form.jenis.toUpperCase()));
        const missing = Array.from(REQUIRED_SET).filter((jenis) => !completedSet.has(jenis));
        return {
          bundleKey: row.bundle_key as string,
          pemohonNama: row.pemohon_nama as string,
          pemohonNik: row.pemohon_nik as string | null,
          lastUpdated: row.last_updated as string,
          forms,
          completed: missing.length === 0,
          missing,
        };
      });

    return NextResponse.json({ bundles });
  } catch (error: unknown) {
    console.error("GET /api/surat-form-entries/bundles error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Gagal mengambil rekap nikah" } },
      { status: 500 },
    );
  }
}
