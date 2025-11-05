export type SuratKeteranganOption = {
  code?: string;
  title: string;
  description: string;
  slug: string;
};

export const SURAT_KETERANGAN_OPTIONS: SuratKeteranganOption[] = [
  {
    code: "SKU",
    title: "Surat Keterangan Umum",
    description: "Untuk keperluan administrasi umum",
    slug: "surat-keterangan-umum",
  },
  {
    code: "SKBPK",
    title: "Surat Keterangan Belum Pernah Kawin",
    description: "Untuk keperluan administrasi pernikahan",
    slug: "surat-keterangan-belum-pernah-kawin",
  },
  {
    code: "SKDTT",
    title: "Surat Keterangan Domisili Tempat Tinggal",
    description: "Untuk keperluan administrasi domisili",
    slug: "surat-keterangan-domisili-tempat-tinggal",
  },
  {
    code: "SKUs",
    title: "Surat Keterangan Usaha",
    description: "Untuk keperluan administrasi usaha/UMKM",
    slug: "surat-keterangan-usaha",
  },
  {
    code: "SKWH",
    title: "Surat Keterangan Wali Hakim",
    description: "Untuk keperluan administrasi perwalian",
    slug: "surat-keterangan-wali-hakim",
  },
  {
    code: "SKDU",
    title: "Surat Keterangan Domisili Usaha",
    description: "Untuk keperluan administrasi domisili usaha",
    slug: "surat-keterangan-domisili-usaha",
  },
  {
    code: "SKTM",
    title: "Surat Keterangan Tidak Mampu",
    description: "Untuk keperluan administrasi bantuan sosial",
    slug: "surat-keterangan-tidak-mampu",
  },
];

export const findSuratKeteranganBySlug = (slug: string) =>
  SURAT_KETERANGAN_OPTIONS.find((option) => option.slug === slug);
