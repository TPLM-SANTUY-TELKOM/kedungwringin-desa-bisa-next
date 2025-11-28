"use client";

import { useCallback, useState, type ChangeEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { NikLookupField } from "@/components/form/NikLookupField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { SuratNikahOption } from "@/data/surat-nikah-options";
import {
  createDefaultWaliNikahData,
  REQUIRED_FIELDS_WALI_NIKAH,
  WALI_RELATION_OPTIONS,
  type WaliNikahData,
  type WaliRelationOption,
} from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormWaliNikahProps = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormWaliNikah({ surat, entryId, initialData, from, backUrl = "/surat-nikah" }: SuratFormWaliNikahProps) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<WaliNikahData>({
    createDefault: createDefaultWaliNikahData,
    entryId,
    initialData: (initialData as Partial<WaliNikahData>) ?? null,
  });
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waliNik, setWaliNik] = useState("");
  const [mempelaiNik, setMempelaiNik] = useState("");
  const [pasanganNik, setPasanganNik] = useState("");

  const applyWaliData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        waliNama: data.nama ?? prev.waliNama,
        waliTempatLahir: data.tempat_lahir ?? prev.waliTempatLahir,
        waliTanggalLahir: data.tanggal_lahir || prev.waliTanggalLahir,
        waliAgama: data.agama ?? prev.waliAgama,
        waliPekerjaan: data.pekerjaan ?? prev.waliPekerjaan,
        waliAlamat: data.alamat ?? prev.waliAlamat,
      }));
    },
    [setForm],
  );

  const applyMempelaiData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        mempelaiNama: data.nama ?? prev.mempelaiNama,
        mempelaiTempatLahir: data.tempat_lahir ?? prev.mempelaiTempatLahir,
        mempelaiTanggalLahir: data.tanggal_lahir || prev.mempelaiTanggalLahir,
        mempelaiAgama: data.agama ?? prev.mempelaiAgama,
        mempelaiPekerjaan: data.pekerjaan ?? prev.mempelaiPekerjaan,
        mempelaiAlamat: data.alamat ?? prev.mempelaiAlamat,
      }));
    },
    [setForm],
  );

  const applyPasanganData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
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
    lookupState: waliLookupState,
    isLookupLoading: isWaliLookupLoading,
    handleNikChange: handleWaliNikChange,
    handleNikLookup: handleWaliNikLookup,
  } = useNikAutofillField({
    nikValue: waliNik,
    onNikValueChange: setWaliNik,
    onApplyData: applyWaliData,
  });

  const {
    lookupState: mempelaiLookupState,
    isLookupLoading: isMempelaiLookupLoading,
    handleNikChange: handleMempelaiNikChange,
    handleNikLookup: handleMempelaiNikLookup,
  } = useNikAutofillField({
    nikValue: mempelaiNik,
    onNikValueChange: setMempelaiNik,
    onApplyData: applyMempelaiData,
  });

  const {
    lookupState: pasanganLookupState,
    isLookupLoading: isPasanganLookupLoading,
    handleNikChange: handlePasanganNikChange,
    handleNikLookup: handlePasanganNikLookup,
  } = useNikAutofillField({
    nikValue: pasanganNik,
    onNikValueChange: setPasanganNik,
    onApplyData: applyPasanganData,
  });

  const handleInputChange =
    (field: keyof WaliNikahData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleHubunganWaliChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      hubunganWali: value as WaliRelationOption,
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
    const missing = REQUIRED_FIELDS_WALI_NIKAH.filter((field) => {
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

  const renderIdentityFields = (
    prefix: string,
    mappings: Array<{ key: keyof WaliNikahData; label: string; placeholder?: string }>,
    options?: {
      before?: ReactNode;
      customFields?: Partial<Record<keyof WaliNikahData, ReactNode>>;
      lockedFields?: Array<keyof WaliNikahData>;
    },
  ) => (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{prefix}</p>
      {options?.before}
      <div className="grid gap-4">
        {mappings.map(({ key, label, placeholder }) => {
          const customField = options?.customFields?.[key];
          if (customField) {
            return <div key={key as string}>{customField}</div>;
          }
          return (
            <div key={key as string} className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{label}</Label>
              {key.toLowerCase().includes("alamat") ? (
                <Textarea value={form[key] ?? ""} onChange={handleInputChange(key)} placeholder={placeholder} rows={3} className={TEXTAREA_BASE} />
              ) : key.toLowerCase().includes("tanggal") ? (
                <Input type="date" value={form[key] ?? ""} onChange={handleInputChange(key)} className={INPUT_BASE} />
              ) : (
                <Input value={form[key] ?? ""} onChange={handleInputChange(key)} placeholder={placeholder} className={INPUT_BASE} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Surat keterangan wali nikah</p>
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
                  <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
                  <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            {renderIdentityFields(
              "Data Wali Nikah",
              [
                { key: "waliNama", label: "Nama lengkap", placeholder: "Nama wali" },
                { key: "waliBin", label: "Bin", placeholder: "Nama ayah wali" },
                { key: "waliTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "waliTanggalLahir", label: "Tanggal lahir" },
                { key: "waliKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "waliAgama", label: "Agama", placeholder: "Islam" },
                { key: "waliPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
                { key: "waliAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                before: (
                  <NikLookupField
                    label="NIK Wali"
                    value={waliNik}
                    onChange={handleWaliNikChange}
                    onSearch={handleWaliNikLookup}
                    lookupState={waliLookupState}
                    isLoading={isWaliLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
                lockedFields: ["waliNama", "waliTempatLahir", "waliTanggalLahir", "waliAgama", "waliPekerjaan", "waliAlamat"],
              },
            )}

            {renderIdentityFields(
              "Data Calon Mempelai Perempuan",
              [
                { key: "mempelaiNama", label: "Nama lengkap", placeholder: "Nama calon mempelai" },
                { key: "mempelaiBinti", label: "Binti", placeholder: "Nama ayah" },
                { key: "mempelaiTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "mempelaiTanggalLahir", label: "Tanggal lahir" },
                { key: "mempelaiKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "mempelaiAgama", label: "Agama", placeholder: "Islam" },
                { key: "mempelaiPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
                { key: "mempelaiAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                before: (
                  <NikLookupField
                    label="NIK Calon Istri"
                    value={mempelaiNik}
                    onChange={handleMempelaiNikChange}
                    onSearch={handleMempelaiNikLookup}
                    lookupState={mempelaiLookupState}
                    isLoading={isMempelaiLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
                lockedFields: ["mempelaiNama", "mempelaiTempatLahir", "mempelaiTanggalLahir", "mempelaiAgama", "mempelaiPekerjaan", "mempelaiAlamat"],
              },
            )}

            {renderIdentityFields(
              "Data Calon Suami",
              [
                { key: "pasanganNama", label: "Nama lengkap", placeholder: "Nama calon suami" },
                { key: "pasanganBin", label: "Bin", placeholder: "Nama ayah" },
                { key: "pasanganTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "pasanganTanggalLahir", label: "Tanggal lahir" },
                { key: "pasanganKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "pasanganAgama", label: "Agama", placeholder: "Islam" },
                { key: "pasanganPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
                { key: "pasanganAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                before: (
                  <NikLookupField
                    label="NIK Calon Suami"
                    value={pasanganNik}
                    onChange={handlePasanganNikChange}
                    onSearch={handlePasanganNikLookup}
                    lookupState={pasanganLookupState}
                    isLoading={isPasanganLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
                lockedFields: ["pasanganNama", "pasanganTempatLahir", "pasanganTanggalLahir", "pasanganAgama", "pasanganPekerjaan", "pasanganAlamat"],
              },
            )}

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rincian Pernikahan</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Hari Nikah</Label>
                  <Input value={form.hariNikah} onChange={handleInputChange("hariNikah")} placeholder="Ahad" className={INPUT_BASE} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Nikah</Label>
                  <Input type="date" value={form.tanggalNikah} onChange={handleInputChange("tanggalNikah")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tempat Nikah</Label>
                <Textarea value={form.tempatNikah} onChange={handleInputChange("tempatNikah")} className={TEXTAREA_BASE} placeholder="Lokasi akad nikah" rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Sebab</Label>
                <Input value={form.sebab} onChange={handleInputChange("sebab")} placeholder="Sebab penunjukan wali" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Hubungan Wali</Label>
                <Select value={form.hubunganWali} onValueChange={handleHubunganWaliChange}>
                  <SelectTrigger className={INPUT_BASE}>
                    <SelectValue placeholder="Pilih hubungan wali" />
                  </SelectTrigger>
                  <SelectContent>
                    {WALI_RELATION_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pejabat Penandatangan</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Kepala Desa</Label>
                  <Input value={form.kepalaDesa} onChange={handleInputChange("kepalaDesa")} placeholder="Parminah" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Kepala KUA</Label>
                  <Input value={form.kepalaKua} onChange={handleInputChange("kepalaKua")} placeholder="Kepala KUA Patikraja" className={INPUT_BASE} />
                </div>
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
