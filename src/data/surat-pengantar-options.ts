export type SuratPengantarOption = {
  code?: string;
  title: string;
  description: string;
  slug: string;
};

export const SURAT_PENGANTAR_OPTIONS: SuratPengantarOption[] = [
  {
    title: "Surat pengantar umum",
    description: "Untuk keperluan administasi umum",
    slug: "surat-pengantar-umum",
  },
  {
    title: "Surat pengantar kepolisian",
    description: "Untuk keperluan administasi umum",
    slug: "surat-pengantar-kepolisian",
  },
  {
    title: "Surat pengantar izin keramaian",
    description: "Untuk keperluan administasi umum",
    slug: "surat-pengantar-izin-keramaian",
  },
];

export const findSuratPengantarBySlug = (slug: string) =>
  SURAT_PENGANTAR_OPTIONS.find((option) => option.slug === slug);

