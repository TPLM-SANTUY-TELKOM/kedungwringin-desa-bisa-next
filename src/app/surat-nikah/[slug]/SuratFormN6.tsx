"use client";

import { useCallback, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { NikLookupField } from "@/components/form/NikLookupField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { createDefaultFormN6, REQUIRED_FIELDS_N6, type FormN6Data } from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormN6Props = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormN6({ surat, entryId, initialData, from, backUrl = "/surat-nikah" }: SuratFormN6Props) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<FormN6Data>({
    createDefault: createDefaultFormN6,
    entryId,
    initialData: (initialData as Partial<FormN6Data>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);

  const applyAlmarhumData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        almarhumNik: data.nik ?? prev.almarhumNik,
        almarhumNama: data.nama ?? prev.almarhumNama,
        almarhumTempatLahir: data.tempat_lahir ?? prev.almarhumTempatLahir,
        almarhumTanggalLahir: data.tanggal_lahir || prev.almarhumTanggalLahir,
        almarhumAgama: data.agama ?? prev.almarhumAgama,
        almarhumPekerjaan: data.pekerjaan ?? prev.almarhumPekerjaan,
        almarhumAlamat: data.alamat ?? prev.almarhumAlamat,
      }));
    },
    [setForm],
  );

  const applyPasanganData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        pasanganNik: data.nik ?? prev.pasanganNik,
        pasanganNama: data.nama ?? prev.pasanganNama,
        pasanganTempatLahir: data.tempat_lahir ?? prev.pasanganTempatLahir,
        pasanganTanggalLahir: data.tanggal_lahir || prev.pasanganTanggalLahir,
        pasanganAgama: data.agama ?? prev.pasanganAgama,
        pasanganPekerjaan: data.pekerjaan ?? prev.pasanganPekerjaan,
        pasanganAlamat: data.alamat ?? prev.pasanganAlamat,
      }));
    },
    [setForm],
  );

  const {
    lookupState: almarhumLookupState,
    isLookupLoading: isAlmarhumLookupLoading,
    handleNikChange: handleAlmarhumNikChange,
    handleNikLookup: handleAlmarhumNikLookup,
  } = useNikAutofillField({
    nikValue: form.almarhumNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        almarhumNik: value,
      })),
    onApplyData: applyAlmarhumData,
  });

  const {
    lookupState: pasanganLookupState,
    isLookupLoading: isPasanganLookupLoading,
    handleNikChange: handlePasanganNikChange,
    handleNikLookup: handlePasanganNikLookup,
  } = useNikAutofillField({
    nikValue: form.pasanganNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        pasanganNik: value,
      })),
    onApplyData: applyPasanganData,
  });

  const handleInputChange =
    (field: keyof FormN6Data) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
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
    const missing = REQUIRED_FIELDS_N6.filter((field) => {
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
    try {
      const response = await fetch("/api/surat-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisSurat: surat.slug }),
      });

      if (!response.ok) {
        throw new Error("Gagal generate nomor surat");
      }

      const { nomorSurat, id: reservedNumberId } = await response.json();

      const updatedForm = {
        ...form,
        nomorSurat,
      };

      const params = new URLSearchParams();
      params.set("data", JSON.stringify(updatedForm));
      params.set("reservedNumberId", reservedNumberId);
      if (entryId) {
        params.set("entryId", entryId);
      }
      if (from) {
        params.set("from", from);
      }
      router.push(`/surat-nikah/${surat.slug}/preview?${params.toString()}`);
    } catch (error) {
      console.error("Error generating number:", error);
      setError("Gagal generate nomor surat. Silakan coba lagi.");
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
                  Form - {surat.code ? `${surat.code} ${surat.title}` : surat.title}
                </p>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Surat keterangan kematian suami/istri</p>
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
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Informasi Kantor</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kantor Desa/Kelurahan</Label>
                <Input value={form.kantorDesa} onChange={handleInputChange("kantorDesa")} placeholder="Kedungwringin" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kecamatan</Label>
                <Input value={form.kecamatan} onChange={handleInputChange("kecamatan")} placeholder="Patikraja" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kabupaten</Label>
                <Input value={form.kabupaten} onChange={handleInputChange("kabupaten")} placeholder="Banyumas" className={INPUT_BASE} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
              <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
            </div>
          </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Suami/Istri Yang Wafat</p>
              <NikLookupField
                label="Nomor Induk Kependudukan"
                value={form.almarhumNik}
                onChange={handleAlmarhumNikChange}
                onSearch={handleAlmarhumNikLookup}
                lookupState={almarhumLookupState}
                isLoading={isAlmarhumLookupLoading}
                inputClassName={INPUT_BASE}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama lengkap dan alias</Label>
                  <Input value={form.almarhumNama} onChange={handleInputChange("almarhumNama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Alias (jika ada)</Label>
                  <Input value={form.almarhumAlias} onChange={handleInputChange("almarhumAlias")} placeholder="Alias" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Bin/Binti</Label>
                <Input value={form.almarhumBin} onChange={handleInputChange("almarhumBin")} placeholder="Nama orang tua" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat lahir</Label>
                  <Input value={form.almarhumTempatLahir} onChange={handleInputChange("almarhumTempatLahir")} placeholder="Kabupaten" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal lahir</Label>
                  <Input type="date" value={form.almarhumTanggalLahir} onChange={handleInputChange("almarhumTanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.almarhumKewarganegaraan} onChange={handleInputChange("almarhumKewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Input value={form.almarhumAgama} onChange={handleInputChange("almarhumAgama")} placeholder="Islam" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input value={form.almarhumPekerjaan} onChange={handleInputChange("almarhumPekerjaan")} placeholder="Pekerjaan" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat</Label>
                <Textarea value={form.almarhumAlamat} onChange={handleInputChange("almarhumAlamat")} placeholder="Alamat lengkap" rows={3} className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal meninggal</Label>
                  <Input type="date" value={form.tanggalMeninggal} onChange={handleInputChange("tanggalMeninggal")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat meninggal</Label>
                  <Input value={form.tempatMeninggal} onChange={handleInputChange("tempatMeninggal")} placeholder="Lokasi meninggal" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Pasangan Yang Hidup</p>
              <NikLookupField
                label="Nomor Induk Kependudukan"
                value={form.pasanganNik}
                onChange={handlePasanganNikChange}
                onSearch={handlePasanganNikLookup}
                lookupState={pasanganLookupState}
                isLoading={isPasanganLookupLoading}
                inputClassName={INPUT_BASE}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama lengkap dan alias</Label>
                  <Input value={form.pasanganNama} onChange={handleInputChange("pasanganNama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Alias (jika ada)</Label>
                  <Input value={form.pasanganAlias} onChange={handleInputChange("pasanganAlias")} placeholder="Alias" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Bin/Binti</Label>
                <Input value={form.pasanganBin} onChange={handleInputChange("pasanganBin")} placeholder="Nama orang tua" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat lahir</Label>
                  <Input value={form.pasanganTempatLahir} onChange={handleInputChange("pasanganTempatLahir")} placeholder="Kabupaten" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal lahir</Label>
                  <Input type="date" value={form.pasanganTanggalLahir} onChange={handleInputChange("pasanganTanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.pasanganKewarganegaraan} onChange={handleInputChange("pasanganKewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Input value={form.pasanganAgama} onChange={handleInputChange("pasanganAgama")} placeholder="Islam" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input value={form.pasanganPekerjaan} onChange={handleInputChange("pasanganPekerjaan")} placeholder="Pekerjaan" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tempat tinggal</Label>
                <Textarea value={form.pasanganAlamat} onChange={handleInputChange("pasanganAlamat")} placeholder="Alamat lengkap" rows={3} className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Penandatangan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Kepala Desa</Label>
                <Input value={form.kepalaDesa} onChange={handleInputChange("kepalaDesa")} placeholder="Parminah" className={INPUT_BASE} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={handleCancel} className="h-12 rounded-xl border border-slate-400 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Batal
              </Button>
              <Button type="button" onClick={handlePreview} disabled={isGeneratingNumber} className="h-12 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800">
                {isGeneratingNumber ? "Memproses..." : "Preview Surat"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
