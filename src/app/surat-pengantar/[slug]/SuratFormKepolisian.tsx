"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

import type { SuratPengantarOption } from "@/data/surat-pengantar-options";
import { createDefaultSuratPengantarKepolisian, REQUIRED_FIELDS_PENGANTAR_KEPOLISIAN, type SuratPengantarKepolisianData } from "@/app/surat-pengantar/types";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

export function SuratFormKepolisian({ surat }: { surat: SuratPengantarOption }) {
  const router = useRouter();
  const [form, setForm] = useState<SuratPengantarKepolisianData>(() => createDefaultSuratPengantarKepolisian());
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof SuratPengantarKepolisianData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleSelectChange = (field: keyof SuratPengantarKepolisianData) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePreview = () => {
    const missing = REQUIRED_FIELDS_PENGANTAR_KEPOLISIAN.filter((field) => {
      const value = form[field];
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return !value;
    });

    if (missing.length > 0) {
      setError("Lengkapi semua bidang wajib terlebih dahulu sebelum melakukan preview surat.");
      return;
    }

    const payload = encodeURIComponent(JSON.stringify(form));
    router.push(`/surat-pengantar/${surat.slug}/preview?data=${payload}`);
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-4xl">
      <div className="mb-4 flex justify-start">
        <Button
          type="button"
          onClick={handleCancel}
          variant="outline"
          className="rounded-full border-slate-300 px-6"
        >
          Kembali
        </Button>
      </div>
      <Card className="rounded-[36px] border border-slate-200 bg-white shadow-[10px_10px_30px_rgba(186,194,204,0.35)]">
        <CardContent className="space-y-10 p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <span className="text-2xl font-semibold">F</span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Form - {surat.title}
                </p>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Untuk keperluan kepolisian</p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
          </div>

          <form className="space-y-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Informasi Surat</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nomor Surat</Label>
                  <Input value={form.nomorSurat} onChange={handleInputChange("nomorSurat")} placeholder="472.21/08/05/II/2025" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                  <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
                <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Pemohon</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                <Input value={form.nama} onChange={handleInputChange("nama")} placeholder="Nama lengkap sesuai KTP" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">NIK</Label>
                  <Input value={form.nik} onChange={handleInputChange("nik")} placeholder="Nomor Induk Kependudukan" className={INPUT_BASE} />
                  <p className="text-xs text-slate-500">Pastikan sesuai KTP elektronik.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Jenis Kelamin</Label>
                  <Select value={form.jenisKelamin} onValueChange={handleSelectChange("jenisKelamin")}>
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input value={form.pekerjaan} onChange={handleInputChange("pekerjaan")} placeholder="Wiraswasta" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir</Label>
                  <Input value={form.tempatLahir} onChange={handleInputChange("tempatLahir")} placeholder="Banyumas" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir</Label>
                  <Input type="date" value={form.tanggalLahir} onChange={handleInputChange("tanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Input value={form.agama} onChange={handleInputChange("agama")} placeholder="Islam" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Warga Negara</Label>
                  <Input value={form.kewarganegaraan} onChange={handleInputChange("kewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Status Perkawinan</Label>
                  <Input value={form.statusPerkawinan} onChange={handleInputChange("statusPerkawinan")} placeholder="Kawin/Belum Kawin/Duda/Janda" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Alamat Pemohon</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat Jalan/Dusun</Label>
                <Textarea value={form.alamat} onChange={handleInputChange("alamat")} placeholder="Contoh: Kedungwringin" className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RT</Label>
                  <Input value={form.rt} onChange={handleInputChange("rt")} placeholder="02" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RW</Label>
                  <Input value={form.rw} onChange={handleInputChange("rw")} placeholder="05" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kelurahan/Desa</Label>
                  <Input value={form.kelurahan} onChange={handleInputChange("kelurahan")} placeholder="Kedungwringin" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kecamatan</Label>
                  <Input value={form.kecamatan} onChange={handleInputChange("kecamatan")} placeholder="Patikraja" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</Label>
                  <Input value={form.kabupaten} onChange={handleInputChange("kabupaten")} placeholder="Banyumas" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keperluan & Surat Keterangan RW</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keperluan Surat untuk Kepolisian</Label>
                <Textarea value={form.keperluan} onChange={handleInputChange("keperluan")} placeholder="Jelaskan keperluan surat pengantar ini untuk kepolisian" className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RW</Label>
                  <Input value={form.suratKeteranganRW} onChange={handleInputChange("suratKeteranganRW")} placeholder="001" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nomor Surat Keterangan RW</Label>
                  <Input value={form.suratKeteranganRWNo} onChange={handleInputChange("suratKeteranganRWNo")} placeholder="Nomor surat keterangan" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Surat Keterangan RW</Label>
                  <Input type="date" value={form.suratKeteranganRWTanggal} onChange={handleInputChange("suratKeteranganRWTanggal")} className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pejabat Penandatangan & Registrasi</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">No. Reg</Label>
                  <Input value={form.noReg} onChange={handleInputChange("noReg")} placeholder="Nomor Registrasi" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Reg</Label>
                  <Input type="date" value={form.tanggalReg} onChange={handleInputChange("tanggalReg")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kepala Desa</Label>
                <Input value={form.kepalaDesa} onChange={handleInputChange("kepalaDesa")} placeholder="Parminah" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mengetahui (Nama)</Label>
                  <Input value={form.mengetahuiNama} onChange={handleInputChange("mengetahuiNama")} placeholder="Nama Pejabat" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mengetahui (Jabatan)</Label>
                  <Input value={form.mengetahuiJabatan} onChange={handleInputChange("mengetahuiJabatan")} placeholder="Camat Patikraja" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 rounded-xl border-slate-300 bg-white px-6 py-6 text-base font-semibold text-slate-700 hover:bg-slate-50 sm:flex-initial"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handlePreview}
                className="flex-1 rounded-xl bg-[#ff6435] px-6 py-6 text-base font-semibold text-white hover:bg-[#e5552b] sm:flex-initial"
              >
                Preview Surat
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

