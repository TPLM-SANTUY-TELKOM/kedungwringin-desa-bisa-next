import { SURAT_KETERANGAN_OPTIONS } from "@/data/surat-keterangan-options";
import { SURAT_NIKAH_OPTIONS } from "@/data/surat-nikah-options";
import { SURAT_PENGANTAR_OPTIONS } from "@/data/surat-pengantar-options";

export type SuratFormCategory = "nikah" | "keterangan" | "pengantar";

export type SuratFormMeta = {
  slug: string;
  title: string;
  jenis: string;
  category: SuratFormCategory;
  nomorField?: string;
  tanggalField?: string;
  pemohonNameField?: string;
  pemohonNikField?: string;
  bundleField?: string;
};

const baseMeta: SuratFormMeta[] = [
  ...SURAT_NIKAH_OPTIONS.map((option) => ({
    slug: option.slug,
    title: option.title,
    jenis: option.code ?? option.slug,
    category: "nikah" as const,
    nomorField: "nomorSurat",
    tanggalField: "tanggalSurat",
    pemohonNameField: "nama",
    pemohonNikField: "nik",
  })),
  ...SURAT_KETERANGAN_OPTIONS.map((option) => ({
    slug: option.slug,
    title: option.title,
    jenis: option.code ?? option.slug,
    category: "keterangan" as const,
    nomorField: "nomorSurat",
    tanggalField: "tanggalSurat",
    pemohonNameField: "nama",
    pemohonNikField: "nik",
  })),
  ...SURAT_PENGANTAR_OPTIONS.map((option) => ({
    slug: option.slug,
    title: option.title,
    jenis: option.code ?? option.slug,
    category: "pengantar" as const,
    nomorField: "nomorSurat",
    tanggalField: "tanggalSurat",
    pemohonNameField: "nama",
    pemohonNikField: "nik",
  })),
];

const fieldOverrides: Record<string, Partial<SuratFormMeta>> = {
  "formulir-pengantar-nikah": {
    pemohonNameField: "namaPemohon",
    pemohonNikField: "nikPemohon",
    bundleField: "nikPemohon",
  },
  "formulir-permohonan-kehendak-perkawinan": {
    pemohonNameField: "pemohonNama",
    pemohonNikField: "pemohonNik",
    bundleField: "pemohonNik",
  },
  "formulir-surat-persetujuan-mempelai": {
    nomorField: undefined,
    pemohonNameField: "calonSuamiNama",
    pemohonNikField: "calonSuamiNik",
    bundleField: "calonSuamiNik",
  },
  "formulir-surat-izin-orang-tua": {
    pemohonNameField: "anakNama",
    pemohonNikField: "anakNik",
    bundleField: "anakNik",
  },
  "formulir-surat-keterangan-kematian": {
    pemohonNameField: "pasanganNama",
    pemohonNikField: "pasanganNik",
    bundleField: "pasanganNik",
  },
  "surat-keterangan-wali-nikah": {
    pemohonNameField: "mempelaiNama",
    pemohonNikField: undefined,
  },
  "surat-pernyataan-belum-menikah": {
    nomorField: undefined,
  },
  "surat-pengantar-numpang-nikah": {
    nomorField: "nomorSurat",
    tanggalField: "tanggalSurat",
    pemohonNameField: "nama",
    pemohonNikField: "nik",
    bundleField: "nik",
  },
  "surat-keterangan-belum-pernah-kawin": {
    tanggalField: "tanggalSurat",
    pemohonNameField: "nama",
    pemohonNikField: "nik",
  },
  "surat-keterangan-wali-hakim": {
    pemohonNameField: "namaCalon",
    pemohonNikField: "nik",
  },
  "surat-keterangan-domisili-usaha": {
    pemohonNameField: "nama",
    pemohonNikField: "nik",
  },
  "surat-keterangan-tidak-mampu": {
    pemohonNameField: "nama",
    pemohonNikField: "nik",
  },
};

export const SURAT_FORM_META: Record<string, SuratFormMeta> = Object.fromEntries(
  baseMeta.map((meta) => {
    const override = fieldOverrides[meta.slug] ?? {};
    return [meta.slug, { ...meta, ...override }];
  }),
);

export const NIKAH_BUNDLE_CODES = ["N1", "N2", "N3", "N5", "N6"];

export const getSuratFormMeta = (slug: string): SuratFormMeta | undefined => SURAT_FORM_META[slug];
