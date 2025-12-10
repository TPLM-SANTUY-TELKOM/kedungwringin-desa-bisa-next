export type PejabatDesaOption = {
  id: string;
  jabatan: string;
  nama: string;
};

export const PEJABAT_DESA_OPTIONS: PejabatDesaOption[] = [
  { id: "kepala-desa", jabatan: "KEPALA DESA", nama: "PARMINAH" },
  { id: "sekretaris-desa", jabatan: "SEKRETARIS DESA", nama: "AHMAD KHUMASI" },
  { id: "kasi-pelayanan", jabatan: "KASI PELAYANAN", nama: "DIAN RIZKIANA DEWI" },
  { id: "kaur-keuangan", jabatan: "KAUR KEUANGAN", nama: "BUDI ROHMANTO" },
  { id: "kasi-kesejahteraan", jabatan: "KASI KESEJAHTERAAN", nama: "RETNO DWI WIJAYANTI" },
  { id: "kasi-pemerintahan", jabatan: "KASI PEMERINTAHAN", nama: "ABDUL KHOLIQ" },
  { id: "kaur-perencanaan", jabatan: "KAUR PERENCANAAN", nama: "TURYANTO" },
  { id: "kadus-i", jabatan: "KADUS I", nama: "SUGENG WIDODO" },
  { id: "kadus-ii", jabatan: "KADUS II", nama: "SUDARSO" },
  { id: "kadus-iii", jabatan: "KADUS III", nama: "USMAN ARIFIN" },
];

export const DEFAULT_KEPALA_DESA = PEJABAT_DESA_OPTIONS[0]?.nama ?? "";
