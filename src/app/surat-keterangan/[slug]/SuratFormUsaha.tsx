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
import { createDefaultSuratKeteranganUsaha, type SuratKeteranganUsahaData } from "@/app/surat-keterangan/types";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormUsahaProps = {
  surat: SuratKeteranganOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormUsaha({ surat, entryId, initialData, from, backUrl = "/surat-keterangan" }: SuratFormUsahaProps) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<SuratKeteranganUsahaData>({
    createDefault: createDefaultSuratKeteranganUsaha,
    entryId,
    initialData: (initialData as Partial<SuratKeteranganUsahaData>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleApplyNikData = (data: PendudukLookupResult) => {
    setForm((prev) => ({
      ...prev,
      nama: data.nama || prev.nama,
      nik: data.nik || prev.nik,
      jenisKelamin: (data.jenis_kelamin?.toUpperCase() as "LAKI-LAKI" | "PEREMPUAN") || prev.jenisKelamin,
      tempatTanggalLahir: data.tempat_lahir && data.tanggal_lahir
        ? `${data.tempat_lahir}, ${new Date(data.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
        : prev.tempatTanggalLahir,
      pekerjaan: data.pekerjaan || prev.pekerjaan,
      alamat: data.alamat && data.rt && data.rw
        ? `${data.alamat}, RT ${data.rt}/RW ${data.rw}`
        : data.alamat || prev.alamat,
    }));
  };

  const { lookupState, isLookupLoading, handleNikChange, handleNikLookup } = useNikAutofillField({
    nikValue: form.nik,
    onNikValueChange: (value) => setForm((prev) => ({ ...prev, nik: value })),
    onApplyData: handleApplyNikData,
  });

  const handleInputChange =
    (field: keyof SuratKeteranganUsahaData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleSelectChange = (field: keyof SuratKeteranganUsahaData) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleCancel = () => {
    if (from === "surat-masuk") {
      router.push("/surat-masuk");
      return;
    }
    router.push(backUrl);
  };

  const handlePreview = () => {
    const requiredFields: Array<keyof SuratKeteranganUsahaData> = [
      "nomorSurat",
      "tanggalSurat",
      "nama",
      "nik",
      "tempatTanggalLahir",
      "jenisUsaha",
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

    const params = new URLSearchParams();
    params.set("data", JSON.stringify(form));
    if (entryId) {
      params.set("entryId", entryId);
    }
    if (from) {
      params.set("from", from);
    }
    router.push(`/surat-keterangan/${surat.slug}/preview?${params.toString()}`);
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
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nomor Surat</Label>
                <Input value={form.nomorSurat} onChange={handleInputChange("nomorSurat")} placeholder="581 / .. / ... / ...." className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
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
                <Label className="text-sm font-semibold text-slate-700">1. Nama Lengkap</Label>
                <Input value={form.nama} onChange={handleInputChange("nama")} placeholder="HENDRA THOMAS MIKO SIBAGARIANG" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">2. Jenis Kelamin</Label>
                <Select value={form.jenisKelamin} onValueChange={handleSelectChange("jenisKelamin")}>
                  <SelectTrigger className={INPUT_BASE}>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LAKI-LAKI">LAKI-LAKI</SelectItem>
                    <SelectItem value="PEREMPUAN">PEREMPUAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">3. Tempat/Tanggal Lahir</Label>
                <Input value={form.tempatTanggalLahir} onChange={handleInputChange("tempatTanggalLahir")} placeholder="ARBAN / 02 Februari 1995" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">4. Kewarganegaraan</Label>
                <Input value={form.kewarganegaraan} onChange={handleInputChange("kewarganegaraan")} placeholder="INDONESIA" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">5. Pekerjaan</Label>
                <Input value={form.pekerjaan} onChange={handleInputChange("pekerjaan")} placeholder="WIRASWASTA" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">7. Alamat</Label>
                <Textarea value={form.alamat} onChange={handleInputChange("alamat")} placeholder="KEDUNGWRINGIN BLOK B NO 2 GANGA 10, RT.008 / RW.008" className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Informasi Usaha</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Jenis Usaha</Label>
                <Input value={form.jenisUsaha} onChange={handleInputChange("jenisUsaha")} placeholder="jkjk" className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keperluan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keperluan</Label>
                <Textarea value={form.keperluan} onChange={handleInputChange("keperluan")} placeholder="jkjk" className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Penandatangan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Kepala Desa</Label>
                <Input value={form.kepalaDesa} onChange={handleInputChange("kepalaDesa")} placeholder="PARMINAH" className={INPUT_BASE} />
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
