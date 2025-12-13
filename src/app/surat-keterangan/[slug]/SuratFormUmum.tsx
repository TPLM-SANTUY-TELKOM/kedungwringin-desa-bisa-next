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
import { KepalaDesaSelect } from "@/components/form/KepalaDesaSelect";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";

import type { SuratKeteranganOption } from "@/data/surat-keterangan-options";
import { createDefaultSuratKeteranganUmum, type SuratKeteranganUmumData } from "@/app/surat-keterangan/types";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormUmumProps = {
  surat: SuratKeteranganOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormUmum({ surat, entryId, initialData, from, backUrl = "/surat-keterangan" }: SuratFormUmumProps) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<SuratKeteranganUmumData>({
    createDefault: createDefaultSuratKeteranganUmum,
    entryId,
    initialData: (initialData as Partial<SuratKeteranganUmumData>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
  const [reservedNumberId, setReservedNumberId] = useState<string | null>(null);

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
    if (from === "surat-masuk") {
      router.push("/surat-masuk");
      return;
    }
    router.push(backUrl);
  };

  const handlePreview = async () => {
    const requiredFields: Array<keyof SuratKeteranganUmumData> = [
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

    try {
      setIsGeneratingNumber(true);
      setError(null);

      // Generate nomor surat
      const response = await fetch("/api/surat-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisSurat: surat.slug }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Gagal menggenerate nomor surat");
      }

      const result = await response.json();
      console.log("Generated number:", result);
      
      const { id, nomorSurat } = result;
      
      if (!id || !nomorSurat) {
        throw new Error("Invalid response from server");
      }
      
      // Save reserved number ID
      setReservedNumberId(id);

      // Auto-set tanggal surat to today
      const today = new Date().toISOString().split('T')[0];

      // Update form with generated number and date
      const updatedForm = { ...form, nomorSurat, tanggalSurat: today };
      setForm(updatedForm);

      const params = new URLSearchParams();
      params.set("data", JSON.stringify(updatedForm));
      params.set("reservedNumberId", id);
      if (entryId) {
        params.set("entryId", entryId);
      }
      if (from) {
        params.set("from", from);
      }
      router.push(`/surat-keterangan/${surat.slug}/preview?${params.toString()}`);
    } catch (err) {
      console.error("Error generating number:", err);
      setError(err instanceof Error ? err.message : "Gagal menggenerate nomor surat. Silakan coba lagi.");
    } finally {
      setIsGeneratingNumber(false);
    }
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
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></Label>
                <Input 
                  value={form.nama} 
                  onChange={handleInputChange("nama")} 
                  placeholder="Akan terisi otomatis dari NIK" 
                  className={INPUT_BASE}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Jenis Kelamin</Label>
                  <Select 
                    value={form.jenisKelamin} 
                    onValueChange={handleSelectChange("jenisKelamin")}
                  >
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Otomatis dari NIK" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input 
                    value={form.pekerjaan} 
                    onChange={handleInputChange("pekerjaan")} 
                    placeholder="Akan terisi otomatis dari NIK" 
                    className={INPUT_BASE}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.tempatLahir} 
                    onChange={handleInputChange("tempatLahir")} 
                    placeholder="Akan terisi otomatis dari NIK" 
                    className={INPUT_BASE}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir <span className="text-red-500">*</span></Label>
                  <Input 
                    type="date" 
                    value={form.tanggalLahir} 
                    onChange={handleInputChange("tanggalLahir")} 
                    className={INPUT_BASE}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input 
                    value={form.kewarganegaraan} 
                    onChange={handleInputChange("kewarganegaraan")} 
                    placeholder="Indonesia" 
                    className={INPUT_BASE} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Select 
                    value={form.agama} 
                    onValueChange={handleSelectChange("agama")}
                  >
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Otomatis dari NIK" />
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
                      <SelectValue placeholder="Pilih status perkawinan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kawin Tercatat">Kawin Tercatat</SelectItem>
                      <SelectItem value="Kawin Tidak Tercatat">Kawin Tidak Tercatat</SelectItem>
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
                <Label className="text-sm font-semibold text-slate-700">Alamat Lengkap <span className="text-red-500">*</span></Label>
                <Textarea 
                  value={form.alamat} 
                  onChange={handleInputChange("alamat")} 
                  placeholder="Akan terisi otomatis dari NIK" 
                  className={TEXTAREA_BASE}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RT <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.rt} 
                    onChange={handleInputChange("rt")} 
                    placeholder="Otomatis" 
                    className={INPUT_BASE}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RW <span className="text-red-500">*</span></Label>
                  <Input 
                    value={form.rw} 
                    onChange={handleInputChange("rw")} 
                    placeholder="Otomatis" 
                    className={INPUT_BASE}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kelurahan/Desa</Label>
                  <Input 
                    value={form.kelurahan} 
                    onChange={handleInputChange("kelurahan")} 
                    placeholder="Kedungwringin" 
                    className={INPUT_BASE} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kecamatan</Label>
                  <Input 
                    value={form.kecamatan} 
                    onChange={handleInputChange("kecamatan")} 
                    placeholder="Patikraja" 
                    className={INPUT_BASE} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</Label>
                <Input 
                  value={form.kabupaten} 
                  onChange={handleInputChange("kabupaten")} 
                  placeholder="Banyumas" 
                  className={INPUT_BASE} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keperluan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keperluan <span className="text-red-500">*</span></Label>
                <Textarea 
                  value={form.keperluan} 
                  onChange={handleInputChange("keperluan")} 
                  placeholder="Jelaskan keperluan pembuatan surat. Contoh: Untuk keperluan administrasi di kantor" 
                  className={TEXTAREA_BASE} 
                  rows={3} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keterangan Lain (Opsional)</Label>
                <Textarea 
                  value={form.keteranganLain} 
                  onChange={handleInputChange("keteranganLain")} 
                  placeholder="Informasi tambahan jika diperlukan" 
                  className={TEXTAREA_BASE} 
                  rows={3} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Penandatangan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Kepala Desa</Label>
                <KepalaDesaSelect
                  value={form.kepalaDesa}
                  onValueChange={handleSelectChange("kepalaDesa")}
                  placeholder="Pilih pejabat penandatangan"
                  triggerClassName={INPUT_BASE}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tempat Penerbitan Surat</Label>
                <Input 
                  value={form.tempatSurat} 
                  onChange={handleInputChange("tempatSurat")} 
                  placeholder="Kedungwringin" 
                  className={INPUT_BASE} 
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" onClick={handleCancel} variant="outline" className="h-12 rounded-full px-8">
                Batal
              </Button>
              <Button 
                type="button" 
                onClick={handlePreview} 
                className="h-12 rounded-full bg-slate-900 px-8 hover:bg-slate-800"
                disabled={isGeneratingNumber}
              >
                {isGeneratingNumber ? "Memproses..." : "Preview Surat"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
