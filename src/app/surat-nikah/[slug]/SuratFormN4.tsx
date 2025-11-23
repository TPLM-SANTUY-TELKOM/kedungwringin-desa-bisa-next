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

import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { createDefaultFormN4, REQUIRED_FIELDS_N4, type FormN4Data } from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormN4Props = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormN4({ surat, entryId, initialData, from, backUrl = "/surat-nikah" }: SuratFormN4Props) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<FormN4Data>({
    createDefault: createDefaultFormN4,
    entryId,
    initialData: (initialData as Partial<FormN4Data>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);

  const applyAyahData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        ayahNik: data.nik ?? prev.ayahNik,
        ayahNama: data.nama ?? prev.ayahNama,
        ayahTempatLahir: data.tempat_lahir ?? prev.ayahTempatLahir,
        ayahTanggalLahir: data.tanggal_lahir || prev.ayahTanggalLahir,
        ayahAgama: data.agama ?? prev.ayahAgama,
        ayahPekerjaan: data.pekerjaan ?? prev.ayahPekerjaan,
        ayahAlamat: data.alamat ?? prev.ayahAlamat,
      }));
    },
    [setForm],
  );

  const applyIbuData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        ibuNik: data.nik ?? prev.ibuNik,
        ibuNama: data.nama ?? prev.ibuNama,
        ibuTempatLahir: data.tempat_lahir ?? prev.ibuTempatLahir,
        ibuTanggalLahir: data.tanggal_lahir || prev.ibuTanggalLahir,
        ibuAgama: data.agama ?? prev.ibuAgama,
        ibuPekerjaan: data.pekerjaan ?? prev.ibuPekerjaan,
        ibuAlamat: data.alamat ?? prev.ibuAlamat,
      }));
    },
    [setForm],
  );

  const applyAnakData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        anakNik: data.nik ?? prev.anakNik,
        anakNama: data.nama ?? prev.anakNama,
        anakTempatLahir: data.tempat_lahir ?? prev.anakTempatLahir,
        anakTanggalLahir: data.tanggal_lahir || prev.anakTanggalLahir,
        anakAgama: data.agama ?? prev.anakAgama,
        anakPekerjaan: data.pekerjaan ?? prev.anakPekerjaan,
        anakAlamat: data.alamat ?? prev.anakAlamat,
      }));
    },
    [setForm],
  );

  const applyCalonPasanganData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        calonPasanganNik: data.nik ?? prev.calonPasanganNik,
        calonPasanganNama: data.nama ?? prev.calonPasanganNama,
        calonPasanganTempatLahir: data.tempat_lahir ?? prev.calonPasanganTempatLahir,
        calonPasanganTanggalLahir: data.tanggal_lahir || prev.calonPasanganTanggalLahir,
        calonPasanganAgama: data.agama ?? prev.calonPasanganAgama,
        calonPasanganPekerjaan: data.pekerjaan ?? prev.calonPasanganPekerjaan,
        calonPasanganAlamat: data.alamat ?? prev.calonPasanganAlamat,
      }));
    },
    [setForm],
  );

  const {
    lookupState: ayahLookupState,
    isLookupLoading: isAyahLookupLoading,
    handleNikChange: handleAyahNikChange,
    handleNikLookup: handleAyahNikLookup,
  } = useNikAutofillField({
    nikValue: form.ayahNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        ayahNik: value,
      })),
    onApplyData: applyAyahData,
  });

  const {
    lookupState: ibuLookupState,
    isLookupLoading: isIbuLookupLoading,
    handleNikChange: handleIbuNikChange,
    handleNikLookup: handleIbuNikLookup,
  } = useNikAutofillField({
    nikValue: form.ibuNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        ibuNik: value,
      })),
    onApplyData: applyIbuData,
  });

  const {
    lookupState: anakLookupState,
    isLookupLoading: isAnakLookupLoading,
    handleNikChange: handleAnakNikChange,
    handleNikLookup: handleAnakNikLookup,
  } = useNikAutofillField({
    nikValue: form.anakNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        anakNik: value,
      })),
    onApplyData: applyAnakData,
  });

  const {
    lookupState: calonPasanganLookupState,
    isLookupLoading: isCalonPasanganLookupLoading,
    handleNikChange: handleCalonPasanganNikChange,
    handleNikLookup: handleCalonPasanganNikLookup,
  } = useNikAutofillField({
    nikValue: form.calonPasanganNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        calonPasanganNik: value,
      })),
    onApplyData: applyCalonPasanganData,
  });

  const handleInputChange =
    (field: keyof FormN4Data) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const missing = REQUIRED_FIELDS_N4.filter((field) => {
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

      const { nomorSurat, tanggalSurat, id: reservedNumberId } = await response.json();

      const updatedForm = {
        ...form,
        nomorSurat,
        tanggalSurat,
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

  const renderIdentitySection = (
    title: string,
    fields: Array<{ key: keyof FormN4Data; label: string; placeholder?: string }>,
    options?: {
      customFields?: Partial<Record<keyof FormN4Data, ReactNode>>;
      beforeContent?: ReactNode;
      lockedFields?: Array<keyof FormN4Data>;
    },
  ) => (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {options?.beforeContent}
      <div className="grid gap-4">
        {fields.map(({ key, label, placeholder }) => {
          const customField = options?.customFields?.[key];
          if (customField) {
            return <div key={key as string}>{customField}</div>;
          }
          const isLocked = options?.lockedFields?.includes(key);
          return (
            <div key={key as string} className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{label}</Label>
              {key.toLowerCase().includes("alamat") ? (
                <Textarea value={form[key] ?? ""} onChange={handleInputChange(key)} placeholder={placeholder} rows={3} readOnly={isLocked} className={isLocked ? "bg-slate-50 cursor-not-allowed" : TEXTAREA_BASE} />
              ) : key.toLowerCase().includes("tanggal") ? (
                <Input type="date" value={form[key] ?? ""} onChange={handleInputChange(key)} readOnly={isLocked} className={isLocked ? "bg-slate-50 cursor-not-allowed" : INPUT_BASE} />
              ) : (
                <Input value={form[key] ?? ""} onChange={handleInputChange(key)} placeholder={placeholder} readOnly={isLocked} className={isLocked ? "bg-slate-50 cursor-not-allowed" : INPUT_BASE} />
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
                  Form - {surat.code ? `${surat.code} ${surat.title}` : surat.title}
                </p>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Surat izin orang tua</p>
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
                  <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
                  <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                  <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
                </div>
              </div>
            </div>

            {renderIdentitySection(
              "Data Ayah/Wali/Pengampu",
              [
                { key: "ayahNama", label: "Nama lengkap dan alias", placeholder: "Nama ayah" },
                { key: "ayahAlias", label: "Alias", placeholder: "Alias (jika ada)" },
                { key: "ayahBin", label: "Bin", placeholder: "Nama kakek (jika diperlukan)" },
                { key: "ayahTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "ayahTanggalLahir", label: "Tanggal lahir" },
                { key: "ayahKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "ayahAgama", label: "Agama", placeholder: "Islam" },
                { key: "ayahPekerjaan", label: "Pekerjaan", placeholder: "Wiraswasta" },
                { key: "ayahAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                beforeContent: (
                  <NikLookupField
                    label="Nomor Induk Kependudukan"
                    value={form.ayahNik}
                    onChange={handleAyahNikChange}
                    onSearch={handleAyahNikLookup}
                    lookupState={ayahLookupState}
                    isLoading={isAyahLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
                lockedFields: ["ayahNama", "ayahTempatLahir", "ayahTanggalLahir", "ayahAgama", "ayahPekerjaan", "ayahAlamat"],
              },
            )}

            {renderIdentitySection(
              "Data Ibu/Wali/Pengampu",
              [
                { key: "ibuNama", label: "Nama lengkap dan alias", placeholder: "Nama ibu" },
                { key: "ibuAlias", label: "Alias", placeholder: "Alias (jika ada)" },
                { key: "ibuBinti", label: "Binti", placeholder: "Nama kakek (jika diperlukan)" },
                { key: "ibuTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "ibuTanggalLahir", label: "Tanggal lahir" },
                { key: "ibuKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "ibuAgama", label: "Agama", placeholder: "Islam" },
                { key: "ibuPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
                { key: "ibuAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                beforeContent: (
                  <NikLookupField
                    label="Nomor Induk Kependudukan"
                    value={form.ibuNik}
                    onChange={handleIbuNikChange}
                    onSearch={handleIbuNikLookup}
                    lookupState={ibuLookupState}
                    isLoading={isIbuLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
                lockedFields: ["ibuNama", "ibuTempatLahir", "ibuTanggalLahir", "ibuAgama", "ibuPekerjaan", "ibuAlamat"],
              },
            )}

            {renderIdentitySection(
              "Identitas Anak Yang Diberi Izin",
              [
                { key: "anakNama", label: "Nama lengkap dan alias", placeholder: "Nama anak" },
                { key: "anakAlias", label: "Alias", placeholder: "Alias (jika ada)" },
                { key: "anakBinti", label: "Bin/Binti", placeholder: "Nama ayah" },
                { key: "anakTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "anakTanggalLahir", label: "Tanggal lahir" },
                { key: "anakKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "anakAgama", label: "Agama", placeholder: "Islam" },
                { key: "anakPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
                { key: "anakAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                beforeContent: (
                  <NikLookupField
                    label="Nomor Induk Kependudukan"
                    value={form.anakNik}
                    onChange={handleAnakNikChange}
                    onSearch={handleAnakNikLookup}
                    lookupState={anakLookupState}
                    isLoading={isAnakLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
                lockedFields: ["anakNama", "anakTempatLahir", "anakTanggalLahir", "anakAgama", "anakPekerjaan", "anakAlamat"],
              },
            )}

            {renderIdentitySection(
              "Calon Pasangan",
              [
                { key: "calonPasanganNama", label: "Nama lengkap dan alias", placeholder: "Nama calon pasangan" },
                { key: "calonPasanganAlias", label: "Alias", placeholder: "Alias (jika ada)" },
                { key: "calonPasanganBin", label: "Bin/Binti", placeholder: "Nama orang tua" },
                { key: "calonPasanganTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
                { key: "calonPasanganTanggalLahir", label: "Tanggal lahir" },
                { key: "calonPasanganKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
                { key: "calonPasanganAgama", label: "Agama", placeholder: "Islam" },
                { key: "calonPasanganPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
                { key: "calonPasanganAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
              ],
              {
                lockedFields: ["calonPasanganNama", "calonPasanganTempatLahir", "calonPasanganTanggalLahir", "calonPasanganAgama", "calonPasanganPekerjaan", "calonPasanganAlamat"],
                beforeContent: (
                  <NikLookupField
                    label="Nomor Induk Kependudukan"
                    value={form.calonPasanganNik}
                    onChange={handleCalonPasanganNikChange}
                    onSearch={handleCalonPasanganNikLookup}
                    lookupState={calonPasanganLookupState}
                    isLoading={isCalonPasanganLookupLoading}
                    inputClassName={INPUT_BASE}
                  />
                ),
              },
            )}

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
