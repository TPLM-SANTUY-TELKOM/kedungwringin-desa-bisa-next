import { NextResponse } from "next/server";

import { query } from "@/lib/db";

export async function GET() {
  try {
    const [totalResult, byCategoryResult, byJenisResult, monthlyResult] = await Promise.all([
      query("SELECT COUNT(*)::INT AS total FROM surat_form_entries"),
      query("SELECT kategori, COUNT(*)::INT AS count FROM surat_form_entries GROUP BY kategori"),
      query("SELECT jenis_surat, COUNT(*)::INT AS count FROM surat_form_entries GROUP BY jenis_surat"),
      query(
        `
          SELECT
            to_char(date_trunc('month', created_at), 'YYYY-MM') AS label,
            COUNT(*)::INT AS count
          FROM surat_form_entries
          WHERE created_at >= date_trunc('month', NOW() - INTERVAL '5 months')
          GROUP BY label
          ORDER BY label
        `,
      ),
    ]);

    const byCategory = byCategoryResult.rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.kategori] = Number(row.count);
      return acc;
    }, {});

    const byJenis = byJenisResult.rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.jenis_surat] = Number(row.count);
      return acc;
    }, {});

    return NextResponse.json({
      total: totalResult.rows[0]?.total ?? 0,
      byCategory,
      byJenis,
      monthly: monthlyResult.rows.map((row) => ({
        label: row.label as string,
        count: Number(row.count),
      })),
    });
  } catch (error: unknown) {
    console.error("GET /api/surat-form-entries/summary error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Gagal mengambil ringkasan surat" } },
      { status: 500 },
    );
  }
}
