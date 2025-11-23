export type GenderOption = "Laki-laki" | "Perempuan";

export type FormN1Data = {
  nomorSurat: string;
  kantorDesa: string;
  kecamatanKantor: string;
  kabupatenKantor: string;
  tempatSurat: string;
  tanggalSurat: string;

  namaPemohon: string;
  nikPemohon: string;
  jenisKelamin: GenderOption;
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;

  alamatJalan: string;
  alamatRt: string;
  alamatRw: string;
  alamatKelurahan: string;
  alamatKecamatan: string;
  alamatKabupaten: string;

  statusPerkawinanLaki: string;
  statusPerkawinanPerempuan: string;
  statusPerkawinanBeristriKe: string;
  namaPasanganTerdahulu: string;

  ayahNama: string;
  ayahNik: string;
  ayahTempatLahir: string;
  ayahTanggalLahir: string;
  ayahKewarganegaraan: string;
  ayahAgama: string;
  ayahPekerjaan: string;
  ayahAlamat: string;

  ibuNama: string;
  ibuNik: string;
  ibuTempatLahir: string;
  ibuTanggalLahir: string;
  ibuKewarganegaraan: string;
  ibuAgama: string;
  ibuPekerjaan: string;
  ibuAlamat: string;

  kepalaDesa: string;
};

export const createDefaultFormN1 = (): FormN1Data => ({
  nomorSurat: "",
  kantorDesa: "Kedungwringin",
  kecamatanKantor: "Patikraja",
  kabupatenKantor: "Banyumas",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  namaPemohon: "",
  nikPemohon: "",
  jenisKelamin: "Perempuan",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "Indonesia",
  agama: "Islam",
  pekerjaan: "",
  alamatJalan: "",
  alamatRt: "",
  alamatRw: "",
  alamatKelurahan: "Kedungwringin",
  alamatKecamatan: "Patikraja",
  alamatKabupaten: "Banyumas",
  statusPerkawinanLaki: "",
  statusPerkawinanPerempuan: "",
  statusPerkawinanBeristriKe: "",
  namaPasanganTerdahulu: "",
  ayahNama: "",
  ayahNik: "",
  ayahTempatLahir: "",
  ayahTanggalLahir: "",
  ayahKewarganegaraan: "Indonesia",
  ayahAgama: "Islam",
  ayahPekerjaan: "",
  ayahAlamat: "",
  ibuNama: "",
  ibuNik: "",
  ibuTempatLahir: "",
  ibuTanggalLahir: "",
  ibuKewarganegaraan: "Indonesia",
  ibuAgama: "Islam",
  ibuPekerjaan: "",
  ibuAlamat: "",
  kepalaDesa: "Parminah",
});

export const REQUIRED_FIELDS_N1: Array<keyof FormN1Data> = [
  "kantorDesa",
  "kecamatanKantor",
  "kabupatenKantor",
  "tempatSurat",
  "namaPemohon",
  "nikPemohon",
  "tanggalLahir",
  "tempatLahir",
  "kewarganegaraan",
  "agama",
  "pekerjaan",
  "alamatJalan",
  "alamatKelurahan",
  "alamatKecamatan",
  "alamatKabupaten",
  "ayahNama",
  "ayahNik",
  "ayahTempatLahir",
  "ayahTanggalLahir",
  "ibuNama",
  "ibuNik",
  "ibuTempatLahir",
  "ibuTanggalLahir",
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

export function buildFullAddress({
  alamatJalan,
  alamatRt,
  alamatRw,
  alamatKelurahan,
  alamatKecamatan,
  alamatKabupaten,
}: Pick<FormN1Data, "alamatJalan" | "alamatRt" | "alamatRw" | "alamatKelurahan" | "alamatKecamatan" | "alamatKabupaten">) {
  const parts = [
    alamatJalan.trim(),
    alamatRt ? `RT ${alamatRt}` : "",
    alamatRw ? `RW ${alamatRw}` : "",
    alamatKelurahan ? alamatKelurahan : "",
  ].filter(Boolean);

  const lines = [];
  if (parts.length > 0) {
    lines.push(parts.join(" "));
  }
  const regional = [
    alamatKecamatan ? `Kecamatan ${alamatKecamatan}` : "",
    alamatKabupaten ? `Kabupaten ${alamatKabupaten}` : "",
  ].filter(Boolean);
  if (regional.length > 0) {
    lines.push(regional.join(" "));
  }

  if (lines.length === 0) {
    return "-";
  }

  return lines.join("\n");
}

export type FormN2Data = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  perihal: string;
  tujuanInstansi: string;
  tujuanTempat: string;
  calonSuamiNama: string;
  calonSuamiNik: string;
  calonIstriNama: string;
  calonIstriNik: string;
  hariAkad: string;
  tanggalAkad: string;
  waktuAkad: string;
  tempatAkad: string;
  lampiran1: string;
  lampiran2: string;
  lampiran3: string;
  lampiran4: string;
  lampiran5: string;
  lampiran6: string;
  lampiran7: string;
  lampiran8: string;
  diterimaTanggal: string;
  pejabatPenerima: string;
  pejabatJabatan: string;
  pemohonNama: string;
  pemohonNik: string;
};

export const createDefaultFormN2 = (): FormN2Data => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  perihal: "Permohonan kehendak Perkawinan",
  tujuanInstansi: "Kepala KUA Kecamatan Patikraja",
  tujuanTempat: "Tempat",
  calonSuamiNama: "",
  calonSuamiNik: "",
  calonIstriNama: "",
  calonIstriNik: "",
  hariAkad: "",
  tanggalAkad: "",
  waktuAkad: "",
  tempatAkad: "",
  lampiran1: "Surat pengantar perkawinan dari desa/kelurahan",
  lampiran2: "Persetujuan calon mempelai",
  lampiran3: "Fotokopi KTP",
  lampiran4: "Fotokopi akta kelahiran",
  lampiran5: "Fotokopi kartu keluarga",
  lampiran6: "Pas foto 2x3 = 3 lembar berlatar belakang biru",
  lampiran7: "",
  lampiran8: "",
  diterimaTanggal: "",
  pejabatPenerima: "",
  pejabatJabatan: "Kepala KUA/Penghulu/PPN Luar Negeri",
  pemohonNama: "",
  pemohonNik: "",
});

export const REQUIRED_FIELDS_N2: Array<keyof FormN2Data> = [
  "nomorSurat",
  "tempatSurat",
  "tanggalSurat",
  "tujuanInstansi",
  "calonSuamiNama",
  "calonIstriNama",
  "hariAkad",
  "tanggalAkad",
  "waktuAkad",
  "tempatAkad",
  "pemohonNama",
];

export type FormN3Data = {
  tempatSurat: string;
  tanggalSurat: string;
  calonSuamiNama: string;
  calonSuamiAlias: string;
  calonSuamiBin: string;
  calonSuamiNik: string;
  calonSuamiTempatLahir: string;
  calonSuamiTanggalLahir: string;
  calonSuamiKewarganegaraan: string;
  calonSuamiAgama: string;
  calonSuamiPekerjaan: string;
  calonSuamiAlamat: string;
  calonIstriNama: string;
  calonIstriAlias: string;
  calonIstriBinti: string;
  calonIstriNik: string;
  calonIstriTempatLahir: string;
  calonIstriTanggalLahir: string;
  calonIstriKewarganegaraan: string;
  calonIstriAgama: string;
  calonIstriPekerjaan: string;
  calonIstriAlamat: string;
};

export const createDefaultFormN3 = (): FormN3Data => ({
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  calonSuamiNama: "",
  calonSuamiAlias: "",
  calonSuamiBin: "",
  calonSuamiNik: "",
  calonSuamiTempatLahir: "",
  calonSuamiTanggalLahir: "",
  calonSuamiKewarganegaraan: "Indonesia",
  calonSuamiAgama: "Islam",
  calonSuamiPekerjaan: "",
  calonSuamiAlamat: "",
  calonIstriNama: "",
  calonIstriAlias: "",
  calonIstriBinti: "",
  calonIstriNik: "",
  calonIstriTempatLahir: "",
  calonIstriTanggalLahir: "",
  calonIstriKewarganegaraan: "Indonesia",
  calonIstriAgama: "Islam",
  calonIstriPekerjaan: "",
  calonIstriAlamat: "",
});

export const REQUIRED_FIELDS_N3: Array<keyof FormN3Data> = [
  "tempatSurat",
  "tanggalSurat",
  "calonSuamiNama",
  "calonSuamiNik",
  "calonSuamiTempatLahir",
  "calonSuamiTanggalLahir",
  "calonSuamiAlamat",
  "calonIstriNama",
  "calonIstriNik",
  "calonIstriTempatLahir",
  "calonIstriTanggalLahir",
  "calonIstriAlamat",
];

export type FormN4Data = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  ayahNama: string;
  ayahAlias: string;
  ayahBin: string;
  ayahNik: string;
  ayahTempatLahir: string;
  ayahTanggalLahir: string;
  ayahKewarganegaraan: string;
  ayahAgama: string;
  ayahPekerjaan: string;
  ayahAlamat: string;
  ibuNama: string;
  ibuAlias: string;
  ibuBinti: string;
  ibuNik: string;
  ibuTempatLahir: string;
  ibuTanggalLahir: string;
  ibuKewarganegaraan: string;
  ibuAgama: string;
  ibuPekerjaan: string;
  ibuAlamat: string;
  anakNama: string;
  anakAlias: string;
  anakBinti: string;
  anakNik: string;
  anakTempatLahir: string;
  anakTanggalLahir: string;
  anakKewarganegaraan: string;
  anakAgama: string;
  anakPekerjaan: string;
  anakAlamat: string;
  calonPasanganNama: string;
  calonPasanganAlias: string;
  calonPasanganBin: string;
  calonPasanganNik: string;
  calonPasanganTempatLahir: string;
  calonPasanganTanggalLahir: string;
  calonPasanganKewarganegaraan: string;
  calonPasanganAgama: string;
  calonPasanganPekerjaan: string;
  calonPasanganAlamat: string;
};

export const createDefaultFormN4 = (): FormN4Data => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  ayahNama: "",
  ayahAlias: "",
  ayahBin: "",
  ayahNik: "",
  ayahTempatLahir: "",
  ayahTanggalLahir: "",
  ayahKewarganegaraan: "Indonesia",
  ayahAgama: "Islam",
  ayahPekerjaan: "",
  ayahAlamat: "",
  ibuNama: "",
  ibuAlias: "",
  ibuBinti: "",
  ibuNik: "",
  ibuTempatLahir: "",
  ibuTanggalLahir: "",
  ibuKewarganegaraan: "Indonesia",
  ibuAgama: "Islam",
  ibuPekerjaan: "",
  ibuAlamat: "",
  anakNama: "",
  anakAlias: "",
  anakBinti: "",
  anakNik: "",
  anakTempatLahir: "",
  anakTanggalLahir: "",
  anakKewarganegaraan: "Indonesia",
  anakAgama: "Islam",
  anakPekerjaan: "",
  anakAlamat: "",
  calonPasanganNama: "",
  calonPasanganAlias: "",
  calonPasanganBin: "",
  calonPasanganNik: "",
  calonPasanganTempatLahir: "",
  calonPasanganTanggalLahir: "",
  calonPasanganKewarganegaraan: "Indonesia",
  calonPasanganAgama: "Islam",
  calonPasanganPekerjaan: "",
  calonPasanganAlamat: "",
});

export const REQUIRED_FIELDS_N4: Array<keyof FormN4Data> = [
  "tempatSurat",
  "ayahNama",
  "ayahNik",
  "ayahTempatLahir",
  "ayahTanggalLahir",
  "ayahAlamat",
  "anakNama",
  "anakNik",
  "anakTempatLahir",
  "anakTanggalLahir",
  "anakAlamat",
  "calonPasanganNama",
];

export type FormN6Data = {
  nomorSurat: string;
  kantorDesa: string;
  kecamatan: string;
  kabupaten: string;
  tempatSurat: string;
  tanggalSurat: string;
  almarhumNama: string;
  almarhumAlias: string;
  almarhumBin: string;
  almarhumNik: string;
  almarhumTempatLahir: string;
  almarhumTanggalLahir: string;
  almarhumKewarganegaraan: string;
  almarhumAgama: string;
  almarhumPekerjaan: string;
  almarhumAlamat: string;
  tanggalMeninggal: string;
  tempatMeninggal: string;
  pasanganNama: string;
  pasanganAlias: string;
  pasanganBin: string;
  pasanganNik: string;
  pasanganTempatLahir: string;
  pasanganTanggalLahir: string;
  pasanganKewarganegaraan: string;
  pasanganAgama: string;
  pasanganPekerjaan: string;
  pasanganAlamat: string;
  kepalaDesa: string;
};

export const createDefaultFormN6 = (): FormN6Data => ({
  nomorSurat: "",
  kantorDesa: "Kedungwringin",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  almarhumNama: "",
  almarhumAlias: "",
  almarhumBin: "",
  almarhumNik: "",
  almarhumTempatLahir: "",
  almarhumTanggalLahir: "",
  almarhumKewarganegaraan: "Indonesia",
  almarhumAgama: "Islam",
  almarhumPekerjaan: "",
  almarhumAlamat: "",
  tanggalMeninggal: "",
  tempatMeninggal: "",
  pasanganNama: "",
  pasanganAlias: "",
  pasanganBin: "",
  pasanganNik: "",
  pasanganTempatLahir: "",
  pasanganTanggalLahir: "",
  pasanganKewarganegaraan: "Indonesia",
  pasanganAgama: "Islam",
  pasanganPekerjaan: "",
  pasanganAlamat: "",
  kepalaDesa: "Parminah",
});

export const REQUIRED_FIELDS_N6: Array<keyof FormN6Data> = [
  "kantorDesa",
  "kecamatan",
  "kabupaten",
  "tempatSurat",
  "almarhumNama",
  "almarhumTempatLahir",
  "almarhumTanggalLahir",
  "almarhumAlamat",
  "tanggalMeninggal",
  "tempatMeninggal",
  "pasanganNama",
  "kepalaDesa",
];

export const WALI_RELATION_OPTIONS = [
  "Ayah kandung",
  "Kakek kandung",
  "Kakek buyut kandung",
  "Saudara laki-laki kandung seayah seibu",
  "Saudara laki-laki kandung seayah",
  "Anak laki2 saudara laki-laki kandung seayah ibu",
  "Anak laki2 saudara laki-laki kandung seayah",
  "Paman /Pak De sekandung",
  "Paman seayah",
  "Anak laki-laki Paman sekandung",
  "Anak laki-laki Paman seayah",
  "Cucu laki2 Paman sekandung",
  "Cucu laki2 Paman seayah",
  "Saudara laki2 Kakek sekandung",
  "Saudara laki2 Kakek seayah",
  "Anak laki2 saudara laki2 kakek sekandung",
  "Anak laki2 saudara laki2 kakek seayah",
  "Saudara laki2 kakek buyut sekandung",
  "Saudara laki2 kakek buyut seayah",
  "Anak laki2 saudara laki2 kakek buyut sekandung",
  "Anak laki2 saudara laki2 kakek buyut seayah",
] as const;

export type WaliRelationOption = (typeof WALI_RELATION_OPTIONS)[number];

export type WaliNikahData = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  waliNama: string;
  waliBin: string;
  waliTempatLahir: string;
  waliTanggalLahir: string;
  waliKewarganegaraan: string;
  waliAgama: string;
  waliPekerjaan: string;
  waliAlamat: string;
  mempelaiNama: string;
  mempelaiBinti: string;
  mempelaiTempatLahir: string;
  mempelaiTanggalLahir: string;
  mempelaiKewarganegaraan: string;
  mempelaiAgama: string;
  mempelaiPekerjaan: string;
  mempelaiAlamat: string;
  pasanganNama: string;
  pasanganBin: string;
  pasanganTempatLahir: string;
  pasanganTanggalLahir: string;
  pasanganKewarganegaraan: string;
  pasanganAgama: string;
  pasanganPekerjaan: string;
  pasanganAlamat: string;
  tempatNikah: string;
  hariNikah: string;
  tanggalNikah: string;
  sebab: string;
  hubunganWali: WaliRelationOption;
  kepalaDesa: string;
  kepalaKua: string;
};

export const createDefaultWaliNikahData = (): WaliNikahData => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  waliNama: "",
  waliBin: "",
  waliTempatLahir: "",
  waliTanggalLahir: "",
  waliKewarganegaraan: "Indonesia",
  waliAgama: "Islam",
  waliPekerjaan: "",
  waliAlamat: "",
  mempelaiNama: "",
  mempelaiBinti: "",
  mempelaiTempatLahir: "",
  mempelaiTanggalLahir: "",
  mempelaiKewarganegaraan: "Indonesia",
  mempelaiAgama: "Islam",
  mempelaiPekerjaan: "",
  mempelaiAlamat: "",
  pasanganNama: "",
  pasanganBin: "",
  pasanganTempatLahir: "",
  pasanganTanggalLahir: "",
  pasanganKewarganegaraan: "Indonesia",
  pasanganAgama: "Islam",
  pasanganPekerjaan: "",
  pasanganAlamat: "",
  tempatNikah: "",
  hariNikah: "",
  tanggalNikah: "",
  sebab: "-",
  hubunganWali: "Ayah kandung",
  kepalaDesa: "Parminah",
  kepalaKua: "",
});

export const REQUIRED_FIELDS_WALI_NIKAH: Array<keyof WaliNikahData> = [
  "tempatSurat",
  "waliNama",
  "waliTempatLahir",
  "waliTanggalLahir",
  "waliAlamat",
  "mempelaiNama",
  "mempelaiTempatLahir",
  "mempelaiTanggalLahir",
  "mempelaiAlamat",
  "pasanganNama",
  "tempatNikah",
  "hariNikah",
  "tanggalNikah",
  "kepalaDesa",
];

export type PernyataanBelumMenikahData = {
  tempatSurat: string;
  tanggalSurat: string;
  jenisKelamin: GenderOption;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  pekerjaan: string;
  nik: string;
  agama: string;
  alamat: string;
  kepalaDesa: string;
};

export const createDefaultPernyataanBelumMenikah = (): PernyataanBelumMenikahData => ({
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  jenisKelamin: "Laki-laki",
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  pekerjaan: "",
  nik: "",
  agama: "Islam",
  alamat: "",
  kepalaDesa: "Parminah",
});

export const REQUIRED_FIELDS_PERNYATAAN: Array<keyof PernyataanBelumMenikahData> = [
  "tempatSurat",
  "tanggalSurat",
  "jenisKelamin",
  "nama",
  "tempatLahir",
  "tanggalLahir",
  "pekerjaan",
  "nik",
  "alamat",
  "kepalaDesa",
];

export type PengantarNumpangNikahData = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  nama: string;
  jenisKelamin: GenderOption;
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  alamat: string;
  rt: string;
  rw: string;
  kecamatan: string;
  kabupaten: string;
  nik: string;
  nkk: string;
  keperluan: string;
  berlakuSampai: string;
  keteranganLain: string;
  namaPasangan: string;
  kepalaDesa: string;
};

export const createDefaultPengantarNumpangData = (): PengantarNumpangNikahData => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  jenisKelamin: "Perempuan",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "Indonesia",
  agama: "Islam",
  pekerjaan: "",
  alamat: "",
  rt: "",
  rw: "",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  nik: "",
  nkk: "",
  keperluan: "",
  berlakuSampai: "",
  keteranganLain: "",
  namaPasangan: "",
  kepalaDesa: "Parminah",
});

export const REQUIRED_FIELDS_PENGANTAR_NUMPANG: Array<keyof PengantarNumpangNikahData> = [
  "tempatSurat",
  "nama",
  "tempatLahir",
  "tanggalLahir",
  "alamat",
  "kecamatan",
  "kabupaten",
  "nik",
  "keperluan",
  "kepalaDesa",
];
