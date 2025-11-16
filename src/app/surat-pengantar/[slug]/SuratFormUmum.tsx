"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { SuratPengantarOption } from "@/data/surat-pengantar-options";
import { createDefaultSuratPengantarUmum, REQUIRED_FIELDS_PENGANTAR_UMUM, type SuratPengantarUmumData } from "@/app/surat-pengantar/types";
import { usePendudukLookup, type PendudukLookupResult } from "@/app/surat-pengantar/usePendudukLookup";
import { useToast } from "@/hooks/use-toast";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormPengantarUmumProps = {
  surat: SuratPengantarOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
};

export function SuratFormUmum({ surat, entryId, initialData, from }: SuratFormPengantarUmumProps) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<SuratPengantarUmumData>({
    createDefault: createDefaultSuratPengantarUmum,
    entryId,
    initialData: (initialData as Partial<SuratPengantarUmumData>) ?? null,
  });
  const lastSuccessfulNikRef = useRef<string | null>(null);
  const { toast } = useToast();

  const applyPendudukData = useCallback(
    (data: PendudukLookupResult) => {
      lastSuccessfulNikRef.current = data.nik;
      setForm((prev) => ({
        ...prev,
        nama: data.nama ?? prev.nama,
        jenisKelamin: (data.jenis_kelamin as SuratPengantarUmumData["jenisKelamin"]) ?? prev.jenisKelamin,
        tempatLahir: data.tempat_lahir ?? prev.tempatLahir,
        tanggalLahir: data.tanggal_lahir || prev.tanggalLahir,
        kewarganegaraan: prev.kewarganegaraan || "Indonesia",
        agama: data.agama ?? prev.agama,
        pekerjaan: data.pekerjaan ?? prev.pekerjaan,
        statusPerkawinan: data.status_perkawinan ?? prev.statusPerkawinan,
        alamat: data.alamat ?? prev.alamat,
        rt: data.rt ?? prev.rt,
        rw: data.rw ?? prev.rw,
        nkk: data.no_kk ?? prev.nkk,
      }));
    },
    [],
  );

  const { lookupState, lookupByNik, resetLookupState } = usePendudukLookup(applyPendudukData);

  const handleInputChange =
    (field: keyof SuratPengantarUmumData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const isLookupLoading = lookupState.status === "loading";

  const handleNikChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");
    setForm((prev) => ({
      ...prev,
      nik: value,
    }));
    if (lastSuccessfulNikRef.current && lastSuccessfulNikRef.current !== value) {
      lastSuccessfulNikRef.current = null;
    }
    resetLookupState();
  };

  const handleNikLookup = () => {
    const nik = form.nik.trim();
    if (!nik || nik === lastSuccessfulNikRef.current) {
      return;
    }
    void lookupByNik(nik);
  };

  const handleSelectChange = (field: keyof SuratPengantarUmumData) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (from === "surat-masuk") {
      router.push("/surat-masuk");
      return;
    }
    router.back();
  };

  const handlePreview = () => {
    const missing = REQUIRED_FIELDS_PENGANTAR_UMUM.filter((field) => {
      const value = form[field];
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return !value;
    });

    if (missing.length > 0) {
      toast({
        variant: "destructive",
        title: "Lengkapi data wajib",
        description: "Lengkapi semua bidang wajib terlebih dahulu sebelum melakukan preview surat.",
      });
      return;
    }

    const params = new URLSearchParams();
    params.set("data", JSON.stringify(form));
    if (entryId) {
      params.set("entryId", entryId);
    }
    if (from) {
      params.set("from", from);
    }
    router.push(`/surat-pengantar/${surat.slug}/preview?${params.toString()}`);
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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Untuk keperluan administrasi umum</p>
              </div>
            </div>
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
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">NIK</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.nik}
                    onChange={handleNikChange}
                    placeholder="Nomor Induk Kependudukan"
                    inputMode="numeric"
                    maxLength={16}
                    className={INPUT_BASE}
                  />
                  <Button
                    type="button"
                    onClick={handleNikLookup}
                    disabled={isLookupLoading}
                    className="rounded-xl bg-[#0f0f0f] px-6 text-white hover:bg-[#1f1f1f]"
                  >
                    {isLookupLoading ? "Mencari..." : "Cari"}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Pastikan sesuai KTP elektronik.</p>
                {lookupState.status !== "idle" && lookupState.message && (
                  <p
                    className={`text-xs ${
                      lookupState.status === "error"
                        ? "text-red-600"
                        : lookupState.status === "success"
                          ? "text-emerald-600"
                          : "text-slate-500"
                    }`}
                  >
                    {lookupState.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                <Input value={form.nama} onChange={handleInputChange("nama")} placeholder="Nama lengkap sesuai KTP" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
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
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Status Perkawinan</Label>
                  <Input value={form.statusPerkawinan} onChange={handleInputChange("statusPerkawinan")} placeholder="Kawin/Belum Kawin/Duda/Janda" className={INPUT_BASE} />
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
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.kewarganegaraan} onChange={handleInputChange("kewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nomor KK</Label>
                  <Input value={form.nkk} onChange={handleInputChange("nkk")} placeholder="Nomor Kartu Keluarga" className={INPUT_BASE} />
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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keperluan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keperluan Surat</Label>
                <Textarea value={form.keperluan} onChange={handleInputChange("keperluan")} placeholder="Jelaskan keperluan surat pengantar ini" className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Berlaku Mulai</Label>
                  <Input type="date" value={form.berlakuDari} onChange={handleInputChange("berlakuDari")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Berlaku Sampai</Label>
                  <Input type="date" value={form.berlakuSampai} onChange={handleInputChange("berlakuSampai")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keterangan Lain</Label>
                <Textarea value={form.keteranganLain} onChange={handleInputChange("keteranganLain")} placeholder="Opsional" className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pejabat Penandatangan</p>
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
