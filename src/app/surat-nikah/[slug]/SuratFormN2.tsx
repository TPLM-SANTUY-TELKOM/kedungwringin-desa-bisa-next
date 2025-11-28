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
import { createDefaultFormN2, REQUIRED_FIELDS_N2, type FormN2Data } from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormN2Props = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormN2({ surat, entryId, initialData, from, backUrl = "/surat-nikah" }: SuratFormN2Props) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<FormN2Data>({
    createDefault: createDefaultFormN2,
    entryId,
    initialData: (initialData as Partial<FormN2Data>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);

  const applyCalonSuamiData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        calonSuamiNama: data.nama ?? prev.calonSuamiNama,
        calonSuamiNik: data.nik ?? prev.calonSuamiNik,
        pemohonNama: data.nama ?? prev.pemohonNama,
        pemohonNik: data.nik ?? prev.pemohonNik,
      }));
    },
    [setForm],
  );

  const applyCalonIstriData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        calonIstriNama: data.nama ?? prev.calonIstriNama,
        calonIstriNik: data.nik ?? prev.calonIstriNik,
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
        pemohonNik: value,
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
    (field: keyof FormN2Data) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "calonSuamiNama" ? { pemohonNama: value } : {}),
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
    const missing = REQUIRED_FIELDS_N2.filter((field) => {
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

  const lampiranKeys: Array<keyof FormN2Data> = [
    "lampiran1",
    "lampiran2",
    "lampiran3",
    "lampiran4",
    "lampiran5",
    "lampiran6",
    "lampiran7",
    "lampiran8",
  ];

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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  Lengkapi data permohonan kehendak perkawinan
                </p>
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
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Perihal</Label>
                <Input value={form.perihal} onChange={handleInputChange("perihal")} className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tujuan Surat</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Instansi Tujuan</Label>
                <Input value={form.tujuanInstansi} onChange={handleInputChange("tujuanInstansi")} placeholder="Kepala KUA Kecamatan Patikraja" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat Tujuan</Label>
                <Input value={form.tujuanTempat} onChange={handleInputChange("tujuanTempat")} placeholder="Tempat" className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Calon Mempelai</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <NikLookupField
                  label="NIK Calon Suami"
                  value={form.calonSuamiNik}
                  onChange={handleCalonSuamiNikChange}
                  onSearch={handleCalonSuamiNikLookup}
                  lookupState={calonSuamiLookupState}
                  isLoading={isCalonSuamiLookupLoading}
                  inputClassName={INPUT_BASE}
                />
                <NikLookupField
                  label="NIK Calon Istri"
                  value={form.calonIstriNik}
                  onChange={handleCalonIstriNikChange}
                  onSearch={handleCalonIstriNikLookup}
                  lookupState={calonIstriLookupState}
                  isLoading={isCalonIstriLookupLoading}
                  inputClassName={INPUT_BASE}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Calon Suami</Label>
                  <Input value={form.calonSuamiNama} onChange={handleInputChange("calonSuamiNama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Calon Istri</Label>
                  <Input value={form.calonIstriNama} onChange={handleInputChange("calonIstriNama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Hari Pelaksanaan</Label>
                  <Input value={form.hariAkad} onChange={handleInputChange("hariAkad")} placeholder="Kamis" className={INPUT_BASE} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Pelaksanaan</Label>
                  <Input type="date" value={form.tanggalAkad} onChange={handleInputChange("tanggalAkad")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Waktu</Label>
                  <Input value={form.waktuAkad} onChange={handleInputChange("waktuAkad")} placeholder="10.00 Pagi" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tempat Acara</Label>
                <Textarea value={form.tempatAkad} onChange={handleInputChange("tempatAkad")} className={TEXTAREA_BASE} placeholder="Alamat lengkap tempat akad" rows={3} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lampiran Persyaratan</p>
              <div className="grid gap-4">
                {lampiranKeys.map((key, index) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Lampiran {index + 1}</Label>
                    <Input value={form[key] ?? ""} onChange={handleInputChange(key)} className={INPUT_BASE} placeholder={`Lampiran ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Penerimaan</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Diterima Tanggal</Label>
                  <Input type="date" value={form.diterimaTanggal} onChange={handleInputChange("diterimaTanggal")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Pejabat Penerima</Label>
                  <Input value={form.pejabatPenerima} onChange={handleInputChange("pejabatPenerima")} placeholder="Nama pejabat" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Jabatan Pejabat</Label>
                <Input value={form.pejabatJabatan} onChange={handleInputChange("pejabatJabatan")} className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Penutup</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Pemohon</Label>
                <Input
                  value={form.pemohonNama}
                  onChange={handleInputChange("pemohonNama")}
                  placeholder="Nama pemohon"
                  className={INPUT_BASE}
                />
                <p className="text-xs text-slate-500">Mengikuti nama calon suami, namun masih bisa diedit manual.</p>
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
