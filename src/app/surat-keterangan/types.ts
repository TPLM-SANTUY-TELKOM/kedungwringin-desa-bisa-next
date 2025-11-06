// ========== Surat Keterangan Umum ==========
export type SuratKeteranganUmumData = {
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
  keteranganLain: string;
  kepalaDesa: string;
};

export const createDefaultSuratKeteranganUmum = (): SuratKeteranganUmumData => ({
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
  statusPerkawinan: "Belum Kawin",
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "Kedungwringin",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  keperluan: "",
  keteranganLain: "",
  kepalaDesa: "Nama Kepala Desa",
});

// ========== Surat Keterangan Belum Pernah Kawin ==========
export type SuratKeteranganBelumPernahKawinData = {
  nomorSurat: string;
  tanggalSurat: string;
  namaPenandatangan: string;
  jabatanPenandatangan: string;
  nik: string;
  nama: string;
  tempatTanggalLahir: string;
  jenisKelamin: "LAKI-LAKI" | "PEREMPUAN";
  agama: string;
  kewarganegaraan: string;
  pekerjaan: string;
  alamat: string;
  desaKel: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  keperluan: string;
};

export const createDefaultSuratKeteranganBelumPernahKawin = (): SuratKeteranganBelumPernahKawinData => ({
  nomorSurat: "",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  namaPenandatangan: "PARMINAH",
  jabatanPenandatangan: "KEPALA DESA KEDUNGWRINGIN",
  nik: "",
  nama: "",
  tempatTanggalLahir: "",
  jenisKelamin: "PEREMPUAN",
  agama: "Islam",
  kewarganegaraan: "INDONESIA",
  pekerjaan: "PETANI/PEKEBUN",
  alamat: "",
  desaKel: "KEDUNGWRINGIN",
  kecamatan: "PATIKRAJA",
  kabupaten: "BANYUMAS",
  provinsi: "JAWA TENGAH",
  keperluan: "",
});

// ========== Surat Keterangan Domisili Tempat Tinggal ==========
export type SuratKeteranganDomisiliTempatTinggalData = {
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
  alamatAsal: string;
  alamatDomisili: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  keperluan: string;
  kepalaDesa: string;
};

export const createDefaultSuratKeteranganDomisiliTempatTinggal = (): SuratKeteranganDomisiliTempatTinggalData => ({
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
  statusPerkawinan: "Belum Kawin",
  alamatAsal: "",
  alamatDomisili: "",
  rt: "",
  rw: "",
  kelurahan: "Kedungwringin",
  kecamatan: "Patikraja",
  kabupaten: "Banyumas",
  keperluan: "",
  kepalaDesa: "Nama Kepala Desa",
});

// ========== Surat Keterangan Usaha ==========
export type SuratKeteranganUsahaData = {
  nomorSurat: string;
  tanggalSurat: string;
  nama: string;
  jenisKelamin: "LAKI-LAKI" | "PEREMPUAN";
  tempatTanggalLahir: string;
  kewarganegaraan: string;
  nik: string;
  pekerjaan: string;
  alamat: string;
  jenisUsaha: string;
  keperluan: string;
  kepalaDesa: string;
};

export const createDefaultSuratKeteranganUsaha = (): SuratKeteranganUsahaData => ({
  nomorSurat: "",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  jenisKelamin: "LAKI-LAKI",
  tempatTanggalLahir: "",
  kewarganegaraan: "INDONESIA",
  nik: "",
  pekerjaan: "WIRASWASTA",
  alamat: "",
  jenisUsaha: "",
  keperluan: "",
  kepalaDesa: "PARMINAH",
});

// ========== Surat Keterangan Wali Hakim ==========
export type SuratKeteranganWaliHakimData = {
  nomorSurat: string;
  tanggalSurat: string;
  tanggalPernikahan: string;
  // Data Wali (I)
  namaWali: string;
  bintiWali: string;
  umurWali: string;
  agamaWali: string;
  pekerjaanWali: string;
  tempatTinggalWali: string;
  // Data Calon Pengantin (II)
  namaCalon: string;
  bintiCalon: string;
  umurCalon: string;
  agamaCalon: string;
  pekerjaanCalon: string;
  tempatTinggalCalon: string;
  // Alasan Wali Hakim
  alasanWaliHakim: "kehabisan-wali" | "walinya";
  // Jika memilih "walinya", pilih alasan:
  alasanWalinya: string[]; // Array untuk multiple choice
  kepalaDesa: string;
};

export const createDefaultSuratKeteranganWaliHakim = (): SuratKeteranganWaliHakimData => ({
  nomorSurat: "",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  tanggalPernikahan: "",
  namaWali: "",
  bintiWali: "",
  umurWali: "10",
  agamaWali: "Islam",
  pekerjaanWali: "BELUM/TIDAK BEKERJA",
  tempatTinggalWali: "",
  namaCalon: "",
  bintiCalon: "",
  umurCalon: "11",
  agamaCalon: "Islam",
  pekerjaanCalon: "BELUM/TIDAK BEKERJA",
  tempatTinggalCalon: "",
  alasanWaliHakim: "kehabisan-wali",
  alasanWalinya: [],
  kepalaDesa: "PARMINAH",
});

// ========== Surat Keterangan Domisili Usaha ==========
export type SuratKeteranganDomisiliUsahaData = {
  nomorSurat: string;
  tanggalSurat: string;
  nama: string;
  jenisKelamin: "LAKI-LAKI" | "PEREMPUAN";
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  nik: string;
  pekerjaan: string;
  alamat: string;
  namaPerusahaan: string;
  namaPemilik: string;
  alamatPerusahaan: string;
  jenisUsaha: string;
  statusPerusahaan: string;
  jumlahKaryawan: string;
  luasTempatUsaha: string;
  waktuUsaha: string;
  keperluan: string;
  kepalaDesa: string;
};

export const createDefaultSuratKeteranganDomisiliUsaha = (): SuratKeteranganDomisiliUsahaData => ({
  nomorSurat: "",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  jenisKelamin: "LAKI-LAKI",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "INDONESIA",
  nik: "",
  pekerjaan: "WIRASWASTA",
  alamat: "",
  namaPerusahaan: "",
  namaPemilik: "",
  alamatPerusahaan: "",
  jenisUsaha: "",
  statusPerusahaan: "",
  jumlahKaryawan: "0 Orang",
  luasTempatUsaha: "",
  waktuUsaha: "",
  keperluan: "mengajukan Permohonan Surat Ijin Tempat Usaha/Ijin Undang-undang Gangguan dari Pemerintah Kabupaten Banyumas",
  kepalaDesa: "( PARMINAH )",
});

// ========== Surat Keterangan Tidak Mampu ==========
export type SuratKeteranganTidakMampuData = {
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  nama: string;
  jenisKelamin: "Laki-laki" | "Perempuan" | "LAKI-LAKI" | "PEREMPUAN";
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  nik: string;
  pekerjaan: string;
  alamat: string;
  keperluan: string;
  kepalaDesa: string;
};

export const createDefaultSuratKeteranganTidakMampu = (): SuratKeteranganTidakMampuData => ({
  nomorSurat: "",
  tempatSurat: "Kedungwringin",
  tanggalSurat: new Date().toISOString().slice(0, 10),
  nama: "",
  jenisKelamin: "LAKI-LAKI",
  tempatLahir: "",
  tanggalLahir: "",
  kewarganegaraan: "INDONESIA",
  agama: "Islam",
  nik: "",
  pekerjaan: "",
  alamat: "",
  keperluan: "fyufyifijfj",
  kepalaDesa: "( PARMINAH )",
});
