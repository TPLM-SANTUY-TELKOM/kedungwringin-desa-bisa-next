export type SuratNikahOption = {
  code?: string;
  title: string;
  description: string;
  slug: string;
};

export const SURAT_NIKAH_OPTIONS: SuratNikahOption[] = [
  {
    code: "N1",
    title: "Formulir Pengantar Nikah",
    description: "Model N1 - Formulir Pengantar Nikah",
    slug: "formulir-pengantar-nikah",
  },
  {
    code: "N2",
    title: "Formulir Permohonan Kehendak Perkawinan",
    description: "Model N2 - Permohonan Kehendak Perkawinan",
    slug: "formulir-permohonan-kehendak-perkawinan",
  },
  {
    code: "N3",
    title: "Formulir Surat Persetujuan Mempelai",
    description: "Model N3 - Surat Persetujuan Mempelai",
    slug: "formulir-surat-persetujuan-mempelai",
  },
  {
    code: "N5",
    title: "Formulir Surat Izin Orang Tua",
    description: "Model N5 - Surat Izin Orang Tua",
    slug: "formulir-surat-izin-orang-tua",
  },
  {
    code: "N6",
    title: "Formulir Surat Keterangan Kematian Suami/Istri",
    description: "Model N6 - Surat Keterangan Kematian Suami/Istri",
    slug: "formulir-surat-keterangan-kematian",
  },
  {
    title: "Surat Keterangan Wali Nikah",
    description: "Surat Keterangan Wali Nikah",
    slug: "surat-keterangan-wali-nikah",
  },
  {
    title: "Surat Pernyataan Belum Menikah",
    description: "Surat Pernyataan Belum Menikah",
    slug: "surat-pernyataan-belum-menikah",
  },
  {
    title: "Surat Pengantar Numpang Nikah",
    description: "Surat Pengantar Numpang Nikah",
    slug: "surat-pengantar-numpang-nikah",
  },
];

export const findSuratNikahBySlug = (slug: string) =>
  SURAT_NIKAH_OPTIONS.find((option) => option.slug === slug);
