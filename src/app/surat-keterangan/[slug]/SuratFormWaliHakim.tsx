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
import { createDefaultSuratKeteranganWaliHakim, type SuratKeteranganWaliHakimData } from "@/app/surat-keterangan/types";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormWaliHakimProps = {
  surat: SuratKeteranganOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormWaliHakim({ surat, entryId, initialData, from, backUrl = "/surat-keterangan" }: SuratFormWaliHakimProps) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<SuratKeteranganWaliHakimData>({
    createDefault: createDefaultSuratKeteranganWaliHakim,
    entryId,
    initialData: (initialData as Partial<SuratKeteranganWaliHakimData>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const [nikWali, setNikWali] = useState("");
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
  const [reservedNumberId, setReservedNumberId] = useState<string | null>(null);

  const handleApplyNikData = (data: PendudukLookupResult) => {
    setForm((prev) => ({
      ...prev,
      namaWali: data.nama || prev.namaWali,
      umurWali: data.tanggal_lahir
        ? String(new Date().getFullYear() - new Date(data.tanggal_lahir).getFullYear())
        : prev.umurWali,
      pekerjaanWali: data.pekerjaan || prev.pekerjaanWali,
      tempatTinggalWali: data.alamat && data.rt && data.rw
        ? `${data.alamat}, RT ${data.rt}/RW ${data.rw}`
        : data.alamat || prev.tempatTinggalWali,
    }));
  };

  const { lookupState, isLookupLoading, handleNikChange, handleNikLookup } = useNikAutofillField({
    nikValue: nikWali,
    onNikValueChange: setNikWali,
    onApplyData: handleApplyNikData,
  });

  const handleInputChange =
    (field: keyof SuratKeteranganWaliHakimData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleSelectChange = (field: keyof SuratKeteranganWaliHakimData) => (value: string) => {
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

  const handleCheckboxChange = (value: string) => {
    const currentValues = form.alasanWalinya || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    setForm((prev) => ({
      ...prev,
      alasanWalinya: newValues,
    }));
    if (error) setError(null);
  };

  const handlePreview = async () => {
    const requiredFields: Array<keyof SuratKeteranganWaliHakimData> = [
      "tanggalSurat",
      "tanggalPernikahan",
      "namaWali",
      "bintiWali",
      "umurWali",
      "namaCalon",
      "bintiCalon",
      "umurCalon",
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

    setIsGeneratingNumber(true);
    setError(null);

    try {
      const res = await fetch("/api/surat-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisSurat: surat.slug }),
      });

      if (!res.ok) {
        throw new Error("Gagal menggenerate nomor surat");
      }

      const { nomorSurat, id } = await res.json();
      setReservedNumberId(id);

      const today = new Date().toISOString().split('T')[0];
      const updatedForm = { ...form, nomorSurat, tanggalSurat: today };

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
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menggenerate nomor surat");
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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Informasi Surat</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                  <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Pernikahan</Label>
                  <Input type="date" value={form.tanggalPernikahan} onChange={handleInputChange("tanggalPernikahan")} className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">I. Data Wali</p>
              <NikLookupField
                label="NIK Wali"
                value={nikWali}
                onChange={handleNikChange}
                onSearch={handleNikLookup}
                lookupState={lookupState}
                isLoading={isLookupLoading}
              />
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">1. Nama Lengkap dan Aliasnya</Label>
                <Input value={form.namaWali} onChange={handleInputChange("namaWali")} placeholder="Akan terisi otomatis dari NIK" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">2. Binti (Nama Ayah)</Label>
                <Input value={form.bintiWali} onChange={handleInputChange("bintiWali")} placeholder="AKHMAD NUR SAFEI" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">3. Umur</Label>
                <Input value={form.umurWali} onChange={handleInputChange("umurWali")} placeholder="Akan terisi otomatis dari NIK" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">4. Agama</Label>
                <Select value={form.agamaWali} onValueChange={handleSelectChange("agamaWali")}>
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
                <Label className="text-sm font-semibold text-slate-700">5. Pekerjaan</Label>
                <Input value={form.pekerjaanWali} onChange={handleInputChange("pekerjaanWali")} placeholder="Akan terisi otomatis dari NIK" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">6. Tempat Tinggal</Label>
                <Textarea value={form.tempatTinggalWali} onChange={handleInputChange("tempatTinggalWali")} placeholder="Akan terisi otomatis dari NIK" className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">II. Data Calon Pengantin (Laki-laki)</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">1. Nama Lengkap dan Aliasnya</Label>
                <Input value={form.namaCalon} onChange={handleInputChange("namaCalon")} placeholder="ABDILLAH RAMADHANA YAHYA" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">2. Binti (Nama Ayah)</Label>
                <Input value={form.bintiCalon} onChange={handleInputChange("bintiCalon")} placeholder="ABDULAH MUKIN" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">3. Umur</Label>
                <Input value={form.umurCalon} onChange={handleInputChange("umurCalon")} placeholder="11" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">4. Agama</Label>
                <Select value={form.agamaCalon} onValueChange={handleSelectChange("agamaCalon")}>
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
                <Label className="text-sm font-semibold text-slate-700">5. Pekerjaan</Label>
                <Input value={form.pekerjaanCalon} onChange={handleInputChange("pekerjaanCalon")} placeholder="BELUM/TIDAK BEKERJA" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">6. Tempat Tinggal</Label>
                <Textarea value={form.tempatTinggalCalon} onChange={handleInputChange("tempatTinggalCalon")} placeholder="JL.RAYA KEDUNGWRINGIN, RT.001 / RW.002" className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Alasan Wali Hakim</p>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">Dengan wali hakim dikarenakan/disebabkan:</Label>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="alasanWaliHakim" 
                      value="kehabisan-wali"
                      checked={form.alasanWaliHakim === "kehabisan-wali"}
                      onChange={() => setForm(prev => ({ ...prev, alasanWaliHakim: "kehabisan-wali", alasanWalinya: [] }))}
                      className="mt-1"
                    />
                    <Label className="text-sm">I. Kehabisan wali/tidak mempunyai wali sama sekali.</Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="alasanWaliHakim" 
                      value="walinya"
                      checked={form.alasanWaliHakim === "walinya"}
                      onChange={() => setForm(prev => ({ ...prev, alasanWaliHakim: "walinya" }))}
                      className="mt-1"
                    />
                    <Label className="text-sm">II. Walinya:</Label>
                  </div>
                </div>
                
                {form.alasanWaliHakim === "walinya" && (
                  <div className="ml-8 space-y-2 border-l-2 border-slate-300 pl-4">
                    {[
                      { value: "tidak-memenuhi-syarat", label: "1. Tidak/belum memenuhi syarat." },
                      { value: "tidak-diketahui-alamat", label: "2. Tidak diketahui alamatnya (mafkud)." },
                      { value: "jauh", label: "3. Berada di tempat yang jauh (masafatul qosri)." },
                      { value: "dipenjara", label: "4. Dipenjara yang tidak dapat ditemui (Hijr)." },
                      { value: "menikah-sendiri", label: "5. Dia sendiri yang akan menikahnya, sedang yang sederajat" },
                      { value: "haji-umroh", label: "6. Sedang melaksanakan haji/umroh." },
                      { value: "enggan", label: "7. Enggan/tidak mau menjadi wali (Adhol)." }
                    ].map((option) => (
                      <div key={option.value} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form.alasanWalinya?.includes(option.value) || false}
                          onChange={() => handleCheckboxChange(option.value)}
                          className="mt-1"
                        />
                        <Label className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                )}
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" onClick={handleCancel} variant="outline" className="h-12 rounded-full px-8">
                Batal
              </Button>
              <Button 
                type="button" 
                onClick={handlePreview} 
                disabled={isGeneratingNumber}
                className="h-12 rounded-full bg-slate-900 px-8 hover:bg-slate-800"
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
