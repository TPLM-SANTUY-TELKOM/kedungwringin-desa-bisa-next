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
import { NikLookupField } from "@/components/form/NikLookupField";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";

import type { SuratKeteranganOption } from "@/data/surat-keterangan-options";
import { createDefaultSuratKeteranganUmum, type SuratKeteranganUmumData } from "@/app/surat-keterangan/types";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

export function SuratFormUmum({ surat, backUrl = "/surat-keterangan" }: { surat: SuratKeteranganOption; backUrl?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<SuratKeteranganUmumData>(() => createDefaultSuratKeteranganUmum());
  const [error, setError] = useState<string | null>(null);

  const handleApplyNikData = (data: PendudukLookupResult) => {
    setForm((prev) => ({
      ...prev,
      nama: data.nama || prev.nama,
      nik: data.nik || prev.nik,
      jenisKelamin: (data.jenis_kelamin as "Laki-laki" | "Perempuan") || prev.jenisKelamin,
      tempatLahir: data.tempat_lahir || prev.tempatLahir,
      tanggalLahir: data.tanggal_lahir || prev.tanggalLahir,
      agama: data.agama || prev.agama,
      pekerjaan: data.pekerjaan || prev.pekerjaan,
      alamat: data.alamat || prev.alamat,
      rt: data.rt || prev.rt,
      rw: data.rw || prev.rw,
    }));
  };

  const { lookupState, isLookupLoading, handleNikChange, handleNikLookup } = useNikAutofillField({
    nikValue: form.nik,
    onNikValueChange: (value) => setForm(prev => ({ ...prev, nik: value })),
    onApplyData: handleApplyNikData,
  });

  const handleInputChange =
    (field: keyof SuratKeteranganUmumData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleSelectChange = (field: keyof SuratKeteranganUmumData) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleCancel = () => {
    router.push(backUrl);
  };

  const handlePreview = () => {
    const requiredFields: Array<keyof SuratKeteranganUmumData> = [
      "nomorSurat",
      "tanggalSurat",
      "nama",
      "nik",
      "tempatLahir",
      "tanggalLahir",
      "alamat",
      "rt",
      "rw",
      "keperluan",
    ];

    const missing = requiredFields.filter((field) => {
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
    router.push(`/surat-keterangan/${surat.slug}/preview?data=${payload}`);
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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">{surat.description}</p>
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
                  <Input value={form.nomorSurat} onChange={handleInputChange("nomorSurat")} placeholder="145/ ... / ... / tahun" className={INPUT_BASE} />
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
              <NikLookupField
                label="NIK"
                value={form.nik}
                onChange={handleNikChange}
                onSearch={handleNikLookup}
                lookupState={lookupState}
                isLoading={isLookupLoading}
              />
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                <Input value={form.nama} onChange={handleInputChange("nama")} placeholder="TIAR MAULI" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <Input value={form.pekerjaan} onChange={handleInputChange("pekerjaan")} placeholder="PETANI/PEKEBUN" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir</Label>
                  <Input value={form.tempatLahir} onChange={handleInputChange("tempatLahir")} placeholder="SORKAM KANAN" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir</Label>
                  <Input type="date" value={form.tanggalLahir} onChange={handleInputChange("tanggalLahir")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.kewarganegaraan} onChange={handleInputChange("kewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Select value={form.agama} onValueChange={handleSelectChange("agama")}>
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Kristen">Kristen</SelectItem>
                      <SelectItem value="Katolik">Katolik</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Status Perkawinan</Label>
                  <Select value={form.statusPerkawinan} onValueChange={handleSelectChange("statusPerkawinan")}>
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                      <SelectItem value="Kawin">Kawin</SelectItem>
                      <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Alamat</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat Lengkap</Label>
                <Textarea value={form.alamat} onChange={handleInputChange("alamat")} placeholder="PERUM KEDUNGWRINGIN Gg 10 B1" className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RT</Label>
                  <Input value={form.rt} onChange={handleInputChange("rt")} placeholder="008" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RW</Label>
                  <Input value={form.rw} onChange={handleInputChange("rw")} placeholder="008" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kelurahan/Desa</Label>
                  <Input value={form.kelurahan} onChange={handleInputChange("kelurahan")} placeholder="KEDUNGWRINGIN" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kecamatan</Label>
                  <Input value={form.kecamatan} onChange={handleInputChange("kecamatan")} placeholder="PATIKRAJA" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kabupaten</Label>
                <Input value={form.kabupaten} onChange={handleInputChange("kabupaten")} placeholder="BANYUMAS" className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keperluan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keperluan</Label>
                <Textarea value={form.keperluan} onChange={handleInputChange("keperluan")} placeholder="fgdfgdfg" className={TEXTAREA_BASE} rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keterangan Lain (Opsional)</Label>
                <Textarea value={form.keteranganLain} onChange={handleInputChange("keteranganLain")} placeholder="dfdfgdfgdf" className={TEXTAREA_BASE} rows={3} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Penandatangan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Kepala Desa</Label>
                <Input value={form.kepalaDesa} onChange={handleInputChange("kepalaDesa")} placeholder="AHMAD KHUMASI,S.Ag" className={INPUT_BASE} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" onClick={handleCancel} variant="outline" className="h-12 rounded-full px-8">
                Batal
              </Button>
              <Button type="button" onClick={handlePreview} className="h-12 rounded-full bg-slate-900 px-8 hover:bg-slate-800">
                Preview Surat
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
