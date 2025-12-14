"use client";

import { useCallback, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { NikLookupField } from "@/components/form/NikLookupField";
import { KepalaDesaSelect } from "@/components/form/KepalaDesaSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { SuratNikahOption } from "@/data/surat-nikah-options";
import {
  createDefaultPengantarNumpangData,
  REQUIRED_FIELDS_PENGANTAR_NUMPANG,
  type GenderOption,
  type PengantarNumpangNikahData,
} from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";
import { useSuratNumbering } from "@/hooks/useSuratNumbering";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

type SuratFormPengantarNumpangProps = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormPengantarNumpang({ surat, entryId, initialData, from, backUrl = "/surat-nikah" }: SuratFormPengantarNumpangProps) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<PengantarNumpangNikahData>({
    createDefault: createDefaultPengantarNumpangData,
    entryId,
    initialData: (initialData as Partial<PengantarNumpangNikahData>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const { generateNumber, isGenerating } = useSuratNumbering();

  const applyPendudukData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => ({
        ...prev,
        nik: data.nik ?? prev.nik,
        nama: data.nama ?? prev.nama,
        jenisKelamin: (data.jenis_kelamin as GenderOption) ?? prev.jenisKelamin,
        tempatLahir: data.tempat_lahir ?? prev.tempatLahir,
        tanggalLahir: data.tanggal_lahir || prev.tanggalLahir,
        agama: data.agama ?? prev.agama,
        pekerjaan: data.pekerjaan ?? prev.pekerjaan,
        alamat: data.alamat ?? prev.alamat,
        rt: data.rt ?? prev.rt,
        rw: data.rw ?? prev.rw,
        nkk: data.no_kk ?? prev.nkk,
      }));
    },
    [setForm],
  );

  const {
    lookupState: pendudukLookupState,
    isLookupLoading: isPendudukLookupLoading,
    handleNikChange: handleNikChange,
    handleNikLookup: handleNikLookup,
  } = useNikAutofillField({
    nikValue: form.nik,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        nik: value,
      })),
    onApplyData: applyPendudukData,
  });

  const handleInputChange =
    (field: keyof PengantarNumpangNikahData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleSelectChange = (field: keyof PengantarNumpangNikahData) => (value: string) => {
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
    const missing = REQUIRED_FIELDS_PENGANTAR_NUMPANG.filter((field) => {
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
      setError(null);

      const result = await generateNumber({
        jenisSurat: surat.slug,
        nomorUrutManual: form.nomorUrutManual,
      });

      if (!result) {
        return;
      }

      const updatedForm = {
        ...form,
        nomorSurat: result.nomorSurat,
        tanggalSurat: result.tanggalSurat,
      };

      const params = new URLSearchParams();
      params.set("data", JSON.stringify(updatedForm));
      params.set("reservedNumberId", result.reservedNumberId);
      if (entryId) {
        params.set("entryId", entryId);
      }
      if (from) {
        params.set("from", from);
      }
      router.push(`/surat-nikah/${surat.slug}/preview?${params.toString()}`);
    } catch (error) {
      console.error("Error generating number:", error);
      setError(error instanceof Error ? error.message : "Gagal generate nomor surat. Silakan coba lagi.");
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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Pengantar numpang nikah</p>
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
                <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
                <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Nomor Urut Surat (Opsional)
                  <span className="ml-1 text-xs font-normal text-slate-500">Kosongkan untuk auto-generate</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={form.nomorUrutManual || ""}
                  onChange={handleInputChange("nomorUrutManual")}
                  placeholder="Contoh: 1, 2, 10"
                  className={INPUT_BASE}
                />
                <p className="text-xs text-slate-500">Sistem akan mencegah nomor duplikat.</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Pemohon</p>
              <NikLookupField
                label="NIK"
                value={form.nik}
                onChange={handleNikChange}
                onSearch={handleNikLookup}
                lookupState={pendudukLookupState}
                isLoading={isPendudukLookupLoading}
                inputClassName={INPUT_BASE}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama</Label>
                  <Input value={form.nama} onChange={handleInputChange("nama")} placeholder="Nama lengkap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Jenis Kelamin</Label>
                  <Select value={form.jenisKelamin} onValueChange={handleSelectChange("jenisKelamin")}>
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir</Label>
                  <Input value={form.tempatLahir} onChange={handleInputChange("tempatLahir")} placeholder="Kabupaten" className={INPUT_BASE} />
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
                  <Input value={form.agama} onChange={handleInputChange("agama")} placeholder="Islam" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan</Label>
                  <Input value={form.pekerjaan} onChange={handleInputChange("pekerjaan")} placeholder="Pekerjaan" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Alamat Pemohon</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat</Label>
                <Textarea value={form.alamat} onChange={handleInputChange("alamat")} placeholder="Alamat jalan/dusun" rows={3} className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RT</Label>
                  <Input value={form.rt} onChange={handleInputChange("rt")} placeholder="04" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RW</Label>
                  <Input value={form.rw} onChange={handleInputChange("rw")} placeholder="02" className={INPUT_BASE} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Kecamatan</Label>
                  <Input value={form.kecamatan} onChange={handleInputChange("kecamatan")} placeholder="Patikraja" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</Label>
                <Input value={form.kabupaten} onChange={handleInputChange("kabupaten")} placeholder="Banyumas" className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Identitas Kependudukan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">NKK</Label>
                <Input value={form.nkk} onChange={handleInputChange("nkk")} placeholder="Nomor Kartu Keluarga" className={INPUT_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keperluan</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keperluan</Label>
                <Textarea value={form.keperluan} onChange={handleInputChange("keperluan")} className={TEXTAREA_BASE} placeholder="Tuliskan keperluan numpang nikah" rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Berlaku Sampai</Label>
                  <Input type="date" value={form.berlakuSampai} onChange={handleInputChange("berlakuSampai")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Calon Pasangan</Label>
                  <Input value={form.namaPasangan} onChange={handleInputChange("namaPasangan")} placeholder="Nama calon pasangan" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Keterangan Lain</Label>
                <Textarea value={form.keteranganLain} onChange={handleInputChange("keteranganLain")} className={TEXTAREA_BASE} placeholder="Tambahan keterangan jika diperlukan" rows={3} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pejabat Penandatangan</p>
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={handleCancel} className="h-12 rounded-xl border border-slate-400 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Batal
              </Button>
              <Button type="button" onClick={handlePreview} disabled={isGenerating} className="h-12 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800">
                {isGenerating ? "Memproses..." : "Preview Surat"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
