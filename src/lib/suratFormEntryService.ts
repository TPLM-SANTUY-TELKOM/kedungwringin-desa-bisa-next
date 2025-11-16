import { getSuratFormMeta, NIKAH_BUNDLE_CODES } from "@/data/surat-form-meta";
import { query } from "@/lib/db";

type JsonRecord = Record<string, unknown>;

export type SuratFormEntryRecord = {
  id: string;
  jenis_surat: string;
  kategori: string;
  slug: string;
  title: string;
  nomor_surat: string | null;
  tanggal_surat: string | null;
  pemohon_penduduk_id: string | null;
  pemohon_nama: string;
  pemohon_nik: string | null;
  status: string;
  bundle_key: string | null;
  form_data: JsonRecord;
  created_at: string;
  updated_at: string;
};

type SaveSuratFormEntryArgs = {
  slug: string;
  title: string;
  jenis?: string;
  data: JsonRecord;
};

const normalizeDateOnly = (value?: unknown): string | null => {
  if (!value || typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }
  if (trimmed.length >= 10) {
    return trimmed.slice(0, 10);
  }
  return null;
};

const readField = (source: JsonRecord, path?: string) => {
  if (!path) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
};

export async function saveSuratFormEntryFromPreview({
  slug,
  title,
  jenis,
  data,
}: SaveSuratFormEntryArgs): Promise<SuratFormEntryRecord | null> {
  const meta = getSuratFormMeta(slug);
  if (!meta) {
    console.warn(`No surat form metadata found for slug "${slug}". Entry will not be persisted.`);
    return null;
  }

  const nomorSuratRaw = (readField(data, meta.nomorField) ??
    (meta.nomorField !== "nomorSurat" ? readField(data, "nomorSurat") : undefined)) as string | undefined;
  const nomorSurat = nomorSuratRaw?.trim() ? nomorSuratRaw.trim() : null;

  const tanggalSurat =
    normalizeDateOnly(readField(data, meta.tanggalField) ?? readField(data, "tanggalSurat")) ?? null;

  const pemohonNamaRaw =
    (readField(data, meta.pemohonNameField) ??
      readField(data, "nama") ??
      readField(data, "calonSuamiNama") ??
      readField(data, "calonIstriNama")) ??
    "";
  const pemohonNama = typeof pemohonNamaRaw === "string" && pemohonNamaRaw.trim().length > 0
    ? pemohonNamaRaw.trim()
    : "Pemohon Tidak Diketahui";

  const pemohonNikRaw =
    (readField(data, meta.pemohonNikField) ?? readField(data, "nik")) ?? null;
  const pemohonNik =
    typeof pemohonNikRaw === "string" && pemohonNikRaw.trim().length > 0
      ? pemohonNikRaw.trim()
      : null;

  const jenisSurat = (jenis ?? meta.jenis).toString();
  const jenisUpper = jenisSurat.toUpperCase();
  const shouldBundle =
    meta.category === "nikah" && NIKAH_BUNDLE_CODES.includes(jenisUpper);

  const bundleSource =
    (meta.bundleField && readField(data, meta.bundleField)) ??
    pemohonNik ??
    pemohonNama;

  const bundleKey =
    shouldBundle && typeof bundleSource === "string" && bundleSource.trim().length > 0
      ? bundleSource.replace(/\s+/g, "").toLowerCase()
      : null;

  try {
    if (bundleKey) {
      const existing = await query(
        `SELECT id FROM surat_form_entries WHERE bundle_key = $1 AND jenis_surat = $2 ORDER BY created_at DESC LIMIT 1`,
        [bundleKey, jenisSurat],
      );

      const existingId = existing.rows[0]?.id as string | undefined;
      if (existingId) {
        const updated = await query(
          `
            UPDATE surat_form_entries
            SET
              slug = $1,
              title = $2,
              nomor_surat = $3,
              tanggal_surat = $4,
              pemohon_nama = $5,
              pemohon_nik = $6,
              form_data = $7,
              updated_at = NOW()
            WHERE id = $8
            RETURNING *
          `,
          [slug, title, nomorSurat, tanggalSurat, pemohonNama, pemohonNik, data, existingId],
        );
        return updated.rows[0] as SuratFormEntryRecord;
      }
    }

    const inserted = await query(
      `
        INSERT INTO surat_form_entries (
          jenis_surat,
          kategori,
          slug,
          title,
          nomor_surat,
          tanggal_surat,
          pemohon_penduduk_id,
          pemohon_nama,
          pemohon_nik,
          status,
          bundle_key,
          form_data
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *
      `,
      [
        jenisSurat,
        meta.category,
        slug,
        title,
        nomorSurat,
        tanggalSurat,
        null,
        pemohonNama,
        pemohonNik,
        "submitted",
        bundleKey,
        data,
      ],
    );

    return inserted.rows[0] as SuratFormEntryRecord;
  } catch (error) {
    console.error("Unexpected error saving surat_form_entries:", error);
    return null;
  }
}

export async function findSuratFormEntryById(id: string): Promise<SuratFormEntryRecord | null> {
  const result = await query("SELECT * FROM surat_form_entries WHERE id = $1 LIMIT 1", [id]);
  return (result.rows[0] as SuratFormEntryRecord | undefined) ?? null;
}

export async function findSuratFormEntriesByBundle(bundleKey: string): Promise<SuratFormEntryRecord[]> {
  const result = await query(
    `
      SELECT DISTINCT ON (jenis_surat) *
      FROM surat_form_entries
      WHERE bundle_key = $1
        AND jenis_surat::text = ANY($2::text[])
      ORDER BY jenis_surat, created_at DESC
    `,
    [bundleKey, NIKAH_BUNDLE_CODES],
  );
  return result.rows as SuratFormEntryRecord[];
}
