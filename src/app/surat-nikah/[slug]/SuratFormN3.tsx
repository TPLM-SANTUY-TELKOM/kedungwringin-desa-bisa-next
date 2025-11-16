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
import { createDefaultFormN3, REQUIRED_FIELDS_N3, type FormN3Data } from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormN3Props = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
};

export function SuratFormN3({ surat, entryId, initialData, from }: SuratFormN3Props) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<FormN3Data>({
    createDefault: createDefaultFormN3,
    entryId,
    initialData: (initialData as Partial<FormN3Data>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);

  const applyCalonSuamiData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        calonSuamiNik: data.nik ?? prev.calonSuamiNik,
        calonSuamiNama: data.nama ?? prev.calonSuamiNama,
        calonSuamiTempatLahir: data.tempat_lahir ?? prev.calonSuamiTempatLahir,
        calonSuamiTanggalLahir: data.tanggal_lahir || prev.calonSuamiTanggalLahir,
        calonSuamiAgama: data.agama ?? prev.calonSuamiAgama,
        calonSuamiPekerjaan: data.pekerjaan ?? prev.calonSuamiPekerjaan,
        calonSuamiAlamat: data.alamat ?? prev.calonSuamiAlamat,
      }));
    },
    [setForm],
  );

  const applyCalonIstriData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        calonIstriNik: data.nik ?? prev.calonIstriNik,
        calonIstriNama: data.nama ?? prev.calonIstriNama,
        calonIstriTempatLahir: data.tempat_lahir ?? prev.calonIstriTempatLahir,
        calonIstriTanggalLahir: data.tanggal_lahir || prev.calonIstriTanggalLahir,
        calonIstriAgama: data.agama ?? prev.calonIstriAgama,
        calonIstriPekerjaan: data.pekerjaan ?? prev.calonIstriPekerjaan,
        calonIstriAlamat: data.alamat ?? prev.calonIstriAlamat,
      }));
    },
    [setForm],
  );

  const {
    lookupState: calonSuamiLookupState,
    isLookupLoading: isCalonSuamiLookupLoading,
    handleNikChange: handleCalonSuamiNikChange,
    handleNikLookup: handleCalonSuamiNikLookup,
  } = useNikAutofillField({
    nikValue: form.calonSuamiNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        calonSuamiNik: value,
      })),
    onApplyData: applyCalonSuamiData,
  });

  const {
    lookupState: calonIstriLookupState,
    isLookupLoading: isCalonIstriLookupLoading,
    handleNikChange: handleCalonIstriNikChange,
    handleNikLookup: handleCalonIstriNikLookup,
  } = useNikAutofillField({
    nikValue: form.calonIstriNik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        calonIstriNik: value,
      })),
    onApplyData: applyCalonIstriData,
  });

  const handleInputChange =
    (field: keyof FormN3Data) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    router.back();
  };

  const handlePreview = () => {
    const missing = REQUIRED_FIELDS_N3.filter((field) => {
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
    router.push(`/surat-nikah/${surat.slug}/preview?${params.toString()}`);
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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Isikan persetujuan calon mempelai</p>
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

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Calon Suami</p>
              <NikLookupField
                label="Nomor Induk Kependudukan"
                value={form.calonSuamiNik}
                onChange={handleCalonSuamiNikChange}
                onSearch={handleCalonSuamiNikLookup}
                lookupState={calonSuamiLookupState}
                isLoading={isCalonSuamiLookupLoading}
                inputClassName={INPUT_BASE}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                  <Input value={form.calonSuamiNama} onChange={handleInputChange("calonSuamiNama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Alias</Label>
                  <Input value={form.calonSuamiAlias} onChange={handleInputChange("calonSuamiAlias")} placeholder="Alias (jika ada)" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Bin</Label>
                <Input value={form.calonSuamiBin} onChange={handleInputChange("calonSuamiBin")} placeholder="Nama ayah" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir</Label>
                  <Input value={form.calonSuamiTempatLahir} onChange={handleInputChange("calonSuamiTempatLahir")} placeholder="Kabupaten" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir</Label>
                  <Input type="date" value={form.calonSuamiTanggalLahir} onChange={handleInputChange("calonSuamiTanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.calonSuamiKewarganegaraan} onChange={handleInputChange("calonSuamiKewarganegaraan")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Input value={form.calonSuamiAgama} onChange={handleInputChange("calonSuamiAgama")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input value={form.calonSuamiPekerjaan} onChange={handleInputChange("calonSuamiPekerjaan")} placeholder="Pekerjaan" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat</Label>
                <Textarea value={form.calonSuamiAlamat} onChange={handleInputChange("calonSuamiAlamat")} className={TEXTAREA_BASE} placeholder="Alamat lengkap" rows={3} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Calon Istri</p>
              <NikLookupField
                label="Nomor Induk Kependudukan"
                value={form.calonIstriNik}
                onChange={handleCalonIstriNikChange}
                onSearch={handleCalonIstriNikLookup}
                lookupState={calonIstriLookupState}
                isLoading={isCalonIstriLookupLoading}
                inputClassName={INPUT_BASE}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                  <Input value={form.calonIstriNama} onChange={handleInputChange("calonIstriNama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Alias</Label>
                  <Input value={form.calonIstriAlias} onChange={handleInputChange("calonIstriAlias")} placeholder="Alias (jika ada)" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Binti</Label>
                <Input value={form.calonIstriBinti} onChange={handleInputChange("calonIstriBinti")} placeholder="Nama ayah" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir</Label>
                  <Input value={form.calonIstriTempatLahir} onChange={handleInputChange("calonIstriTempatLahir")} placeholder="Kabupaten" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir</Label>
                  <Input type="date" value={form.calonIstriTanggalLahir} onChange={handleInputChange("calonIstriTanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.calonIstriKewarganegaraan} onChange={handleInputChange("calonIstriKewarganegaraan")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama</Label>
                  <Input value={form.calonIstriAgama} onChange={handleInputChange("calonIstriAgama")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input value={form.calonIstriPekerjaan} onChange={handleInputChange("calonIstriPekerjaan")} placeholder="Pekerjaan" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat</Label>
                <Textarea value={form.calonIstriAlamat} onChange={handleInputChange("calonIstriAlamat")} className={TEXTAREA_BASE} placeholder="Alamat lengkap" rows={3} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={handleCancel} className="h-12 rounded-xl border border-slate-400 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Batal
              </Button>
              <Button type="button" onClick={handlePreview} className="h-12 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800">
                Preview Surat
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
