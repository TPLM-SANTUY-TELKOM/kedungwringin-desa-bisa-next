import { PEJABAT_DESA_OPTIONS } from "@/data/pejabat-desa";

export function getPejabatByNama(nama: string) {
  const pejabat = PEJABAT_DESA_OPTIONS.find((option) => option.nama === nama);

  return {
    nama: nama || "",
    jabatan: pejabat?.jabatan ?? "KEPALA DESA",
  };
}
