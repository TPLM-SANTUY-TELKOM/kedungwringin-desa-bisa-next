export type SuratPengantarUmumData = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  nama: string;
  nik: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  statusPerkawinan: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  keperluan: string;
  nkk: string;
  berlakuDari: string;
  berlakuSampai: string;
  keteranganLain: string;
  kepalaDesa: string;
  mengetahuiNama: string;
  mengetahuiJabatan: string;
};

export const createDefaultSuratPengantarUmum = (): SuratPengantarUmumData => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  nik: "",
  jenisKelamin: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "Indonesia",
  agama: "Islam",
  pekerjaan: "",
  statusPerkawinan: "",
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "Kedungwringin",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  keperluan: "",
  nkk: "",
  berlakuDari: "",
  berlakuSampai: "",
  keteranganLain: "",
  kepalaDesa: "Parminah",
  mengetahuiNama: "",
  mengetahuiJabatan: "Camat Patikraja",
});

export const REQUIRED_FIELDS_PENGANTAR_UMUM: Array<keyof SuratPengantarUmumData> = [
  "nomorSurat",
  "tempatSurat",
  "tanggalSurat",
  "nama",
  "nik",
  "tempatLahir",
  "tanggalLahir",
  "kewarganegaraan",
  "agama",
  "pekerjaan",
  "statusPerkawinan",
  "alamat",
  "kelurahan",
  "kecamatan",
  "kabupaten",
  "keperluan",
  "nkk",
  "kepalaDesa",
];

export type SuratPengantarKepolisianData = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  nama: string;
  nik: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  keperluan: string;
  suratKeteranganRW: string;
  suratKeteranganRWNo: string;
  suratKeteranganRWTanggal: string;
  noReg: string;
  tanggalReg: string;
  kepalaDesa: string;
  mengetahuiNama: string;
  mengetahuiJabatan: string;
};

export const createDefaultSuratPengantarKepolisian = (): SuratPengantarKepolisianData => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  nik: "",
  jenisKelamin: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "Indonesia",
  agama: "Islam",
  statusPerkawinan: "",
  pekerjaan: "",
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "Kedungwringin",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  keperluan: "",
  suratKeteranganRW: "001",
  suratKeteranganRWNo: "",
  suratKeteranganRWTanggal: "",
  noReg: "",
  tanggalReg: "",
  kepalaDesa: "Parminah",
  mengetahuiNama: "",
  mengetahuiJabatan: "Camat Patikraja",
});

export const REQUIRED_FIELDS_PENGANTAR_KEPOLISIAN: Array<keyof SuratPengantarKepolisianData> = [
  "nomorSurat",
  "tempatSurat",
  "tanggalSurat",
  "nama",
  "nik",
  "tempatLahir",
  "tanggalLahir",
  "kewarganegaraan",
  "agama",
  "statusPerkawinan",
  "pekerjaan",
  "alamat",
  "kelurahan",
  "kecamatan",
  "kabupaten",
  "keperluan",
  "kepalaDesa",
];

export type SuratPengantarIzinKeramaianData = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  nama: string;
  nik: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  maksudKeramaian: string;
  tanggalPenyelenggaraan: string;
  waktuMulai: string;
  waktuSelesai: string;
  jenisHiburan: string;
  jumlahUndangan: string;
  tempatPenyelenggaraan: string;
  suratPernyataanRT: string;
  suratPernyataanRTNo: string;
  suratPernyataanRTTanggal: string;
  noReg: string;
  tanggalReg: string;
  kepalaDesa: string;
  mengetahuiNama: string;
  mengetahuiJabatan: string;
};

export const createDefaultSuratPengantarIzinKeramaian = (): SuratPengantarIzinKeramaianData => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  nik: "",
  jenisKelamin: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "Indonesia",
  agama: "Islam",
  pekerjaan: "",
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "Kedungwringin",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  maksudKeramaian: "",
  tanggalPenyelenggaraan: "",
  waktuMulai: "",
  waktuSelesai: "",
  jenisHiburan: "",
  jumlahUndangan: "0",
  tempatPenyelenggaraan: "",
  suratPernyataanRT: "",
  suratPernyataanRTNo: "",
  suratPernyataanRTTanggal: "",
  noReg: "",
  tanggalReg: "",
  kepalaDesa: "Parminah",
  mengetahuiNama: "",
  mengetahuiJabatan: "Camat Patikraja",
});

export const REQUIRED_FIELDS_PENGANTAR_IZIN_KERAMAIAN: Array<keyof SuratPengantarIzinKeramaianData> = [
  "nomorSurat",
  "tempatSurat",
  "tanggalSurat",
  "nama",
  "nik",
  "tempatLahir",
  "tanggalLahir",
  "kewarganegaraan",
  "agama",
  "pekerjaan",
  "alamat",
  "kelurahan",
  "kecamatan",
  "kabupaten",
  "tanggalPenyelenggaraan",
  "waktuMulai",
  "waktuSelesai",
  "tempatPenyelenggaraan",
  "kepalaDesa",
];

export function formatDateIndonesian(date: string) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

