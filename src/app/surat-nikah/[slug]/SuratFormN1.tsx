"use client";

import { useCallback, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { NikLookupField } from "@/components/form/NikLookupField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

import { KepalaDesaSelect } from "@/components/form/KepalaDesaSelect";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { createDefaultFormN1, REQUIRED_FIELDS_N1, type FormN1Data, type GenderOption } from "@/app/surat-nikah/types";
import { useNikAutofillField, type PendudukLookupResult } from "@/hooks/useNikAutofillField";
import { usePrefillFormState } from "@/hooks/usePrefillFormState";
import { useSuratNumbering } from "@/hooks/useSuratNumbering";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

const STATUS_PERKAWINAN_LAKI_OPTIONS = [
  { value: "Jejaka", label: "Jejaka" },
  { value: "Duda", label: "Duda" },
  { value: "Beristri", label: "Beristri" },
];

const STATUS_PERKAWINAN_PEREMPUAN_OPTIONS = [
  { value: "Perawan", label: "Perawan" },
  { value: "Janda", label: "Janda" },
];

type SuratFormN1Props = {
  surat: SuratNikahOption;
  entryId?: string | null;
  initialData?: Record<string, unknown> | null;
  from?: string | null;
  backUrl?: string;
};

export function SuratFormN1({ surat, entryId, initialData, from, backUrl = "/surat-nikah" }: SuratFormN1Props) {
  const router = useRouter();
  const { form, setForm } = usePrefillFormState<FormN1Data>({
    createDefault: createDefaultFormN1,
    entryId,
    initialData: (initialData as Partial<FormN1Data>) ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const { generateNumber, isGenerating } = useSuratNumbering();

  const applyPemohonPendudukData = useCallback(
    (data: PendudukLookupResult) => {
      setForm((prev) => {
        const next: FormN1Data = { ...prev };
        next.nikPemohon = data.nik ?? prev.nikPemohon;
        next.namaPemohon = data.nama ?? prev.namaPemohon;
        next.jenisKelamin = (data.jenis_kelamin as GenderOption) ?? prev.jenisKelamin;
        next.tempatLahir = data.tempat_lahir ?? prev.tempatLahir;
        next.tanggalLahir = data.tanggal_lahir || prev.tanggalLahir;
        next.agama = data.agama ?? prev.agama;
        next.pekerjaan = data.pekerjaan ?? prev.pekerjaan;
        next.alamatJalan = data.alamat ?? prev.alamatJalan;
        next.alamatRt = data.rt ?? prev.alamatRt;
        next.alamatRw = data.rw ?? prev.alamatRw;
        if (data.status_perkawinan) {
          if (data.jenis_kelamin === "Laki-laki") {
            next.statusPerkawinanLaki = data.status_perkawinan;
          } else {
            next.statusPerkawinanPerempuan = data.status_perkawinan;
          }
        }
        return next;
      });
    },
    [setForm],
  );

  const applyAyahPendudukData = useCallback(
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

  const applyIbuPendudukData = useCallback(
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

  const {
    lookupState: pemohonLookupState,
    isLookupLoading: isPemohonLookupLoading,
    handleNikChange: handlePemohonNikChange,
    handleNikLookup: handlePemohonNikLookup,
  } = useNikAutofillField({
    nikValue: form.nikPemohon,
    onNikValueChange: (value) =>
      setForm((prev) => ({
        ...prev,
        nikPemohon: value,
      })),
    onApplyData: applyPemohonPendudukData,
  });

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
    onApplyData: applyAyahPendudukData,
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
    onApplyData: applyIbuPendudukData,
  });

  const handleInputChange =
    (field: keyof FormN1Data) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleSelectChange = (field: keyof FormN1Data) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleStatusPerkawinanLakiChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      statusPerkawinanLaki: value,
      statusPerkawinanBeristriKe: value === "Beristri" ? prev.statusPerkawinanBeristriKe : "",
    }));
    if (error) setError(null);
  };

  const handleStatusPerkawinanPerempuanChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      statusPerkawinanPerempuan: value,
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
    const missing = REQUIRED_FIELDS_N1.filter((field) => {
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
      console.error("Error generating nomor surat:", error);
      setError(error instanceof Error ? error.message : "Gagal generate nomor surat. Silakan coba lagi.");
    }
  };

  const isBeristriSelected = form.statusPerkawinanLaki === "Beristri";

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
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Untuk -</p>
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
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
                  <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kantor Desa/Kelurahan</Label>
                  <Input value={form.kantorDesa} onChange={handleInputChange("kantorDesa")} placeholder="Kedungwringin" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kecamatan Kantor</Label>
                  <Input value={form.kecamatanKantor} onChange={handleInputChange("kecamatanKantor")} placeholder="Patikraja" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kabupaten Kantor</Label>
                  <Input value={form.kabupatenKantor} onChange={handleInputChange("kabupatenKantor")} placeholder="Banyumas" className={INPUT_BASE} />
                </div>
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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Calon Mempelai</p>
              <NikLookupField
                label="NIK"
                value={form.nikPemohon}
                onChange={handlePemohonNikChange}
                onSearch={handlePemohonNikLookup}
                lookupState={pemohonLookupState}
                isLoading={isPemohonLookupLoading}
                inputClassName={INPUT_BASE}
              />
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                <Input value={form.namaPemohon} onChange={handleInputChange("namaPemohon")} placeholder="Nama lengkap sesuai KTP" className={INPUT_BASE} />
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan</Label>
                  <Input value={form.kewarganegaraan} onChange={handleInputChange("kewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
              </div>
            </div>

              <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Alamat Pemohon</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat Jalan/Dusun</Label>
                <Textarea value={form.alamatJalan} onChange={handleInputChange("alamatJalan")} placeholder="Contoh: Kedungwringin" className={TEXTAREA_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RT</Label>
                  <Input value={form.alamatRt} onChange={handleInputChange("alamatRt")} placeholder="02" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">RW</Label>
                  <Input value={form.alamatRw} onChange={handleInputChange("alamatRw")} placeholder="05" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kelurahan/Desa</Label>
                  <Input value={form.alamatKelurahan} onChange={handleInputChange("alamatKelurahan")} placeholder="Kedungwringin" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kecamatan</Label>
                  <Input value={form.alamatKecamatan} onChange={handleInputChange("alamatKecamatan")} placeholder="Patikraja" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</Label>
                  <Input value={form.alamatKabupaten} onChange={handleInputChange("alamatKabupaten")} placeholder="Banyumas" className={INPUT_BASE} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status Perkawinan</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Laki-laki</Label>
                  <Select value={form.statusPerkawinanLaki} onValueChange={handleStatusPerkawinanLakiChange}>
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Pilih status laki-laki" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_PERKAWINAN_LAKI_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                      {form.statusPerkawinanLaki &&
                        !STATUS_PERKAWINAN_LAKI_OPTIONS.some((option) => option.value === form.statusPerkawinanLaki) && (
                          <SelectItem value={form.statusPerkawinanLaki}>{form.statusPerkawinanLaki}</SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>
                {isBeristriSelected && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Beristri ke (jika laki-laki)</Label>
                    <Input
                      value={form.statusPerkawinanBeristriKe}
                      onChange={handleInputChange("statusPerkawinanBeristriKe")}
                      placeholder="Isi angka beristri ke"
                      className={INPUT_BASE}
                      type="number"
                      min={1}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Perempuan</Label>
                  <Select value={form.statusPerkawinanPerempuan} onValueChange={handleStatusPerkawinanPerempuanChange}>
                    <SelectTrigger className={INPUT_BASE}>
                      <SelectValue placeholder="Pilih status perempuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_PERKAWINAN_PEREMPUAN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                      {form.statusPerkawinanPerempuan &&
                        !STATUS_PERKAWINAN_PEREMPUAN_OPTIONS.some((option) => option.value === form.statusPerkawinanPerempuan) && (
                          <SelectItem value={form.statusPerkawinanPerempuan}>{form.statusPerkawinanPerempuan}</SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nama Suami/Istri Terdahulu</Label>
                  <Input
                    value={form.namaPasanganTerdahulu}
                    onChange={handleInputChange("namaPasanganTerdahulu")}
                    placeholder="Isi '-' jika tidak ada"
                    className={INPUT_BASE}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Orang Tua Laki-laki</p>
              <NikLookupField
                label="NIK Ayah"
                value={form.ayahNik}
                onChange={handleAyahNikChange}
                onSearch={handleAyahNikLookup}
                lookupState={ayahLookupState}
                isLoading={isAyahLookupLoading}
                inputClassName={INPUT_BASE}
                helperText={undefined}
              />
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap dan Alias</Label>
                <Input value={form.ayahNama} onChange={handleInputChange("ayahNama")} placeholder="Nama lengkap ayah" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan Ayah</Label>
                  <Input value={form.ayahPekerjaan} onChange={handleInputChange("ayahPekerjaan")} placeholder="Wiraswasta" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir Ayah</Label>
                  <Input value={form.ayahTempatLahir} onChange={handleInputChange("ayahTempatLahir")} placeholder="Magelang" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir Ayah</Label>
                  <Input type="date" value={form.ayahTanggalLahir} onChange={handleInputChange("ayahTanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama Ayah</Label>
                  <Input value={form.ayahAgama} onChange={handleInputChange("ayahAgama")} placeholder="Islam" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan Ayah</Label>
                  <Input value={form.ayahKewarganegaraan} onChange={handleInputChange("ayahKewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat Ayah</Label>
                <Textarea value={form.ayahAlamat} onChange={handleInputChange("ayahAlamat")} placeholder="Alamat lengkap ayah" className={TEXTAREA_BASE} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Orang Tua Perempuan</p>
              <NikLookupField
                label="NIK Ibu"
                value={form.ibuNik}
                onChange={handleIbuNikChange}
                onSearch={handleIbuNikLookup}
                lookupState={ibuLookupState}
                isLoading={isIbuLookupLoading}
                inputClassName={INPUT_BASE}
                helperText={undefined}
              />
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap dan Alias</Label>
                <Input value={form.ibuNama} onChange={handleInputChange("ibuNama")} placeholder="Nama lengkap ibu" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Pekerjaan Ibu</Label>
                  <Input value={form.ibuPekerjaan} onChange={handleInputChange("ibuPekerjaan")} placeholder="Ibu Rumah Tangga" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tempat Lahir Ibu</Label>
                  <Input value={form.ibuTempatLahir} onChange={handleInputChange("ibuTempatLahir")} placeholder="Cilacap" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Lahir Ibu</Label>
                  <Input type="date" value={form.ibuTanggalLahir} onChange={handleInputChange("ibuTanggalLahir")} className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Agama Ibu</Label>
                  <Input value={form.ibuAgama} onChange={handleInputChange("ibuAgama")} placeholder="Islam" className={INPUT_BASE} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Kewarganegaraan Ibu</Label>
                  <Input value={form.ibuKewarganegaraan} onChange={handleInputChange("ibuKewarganegaraan")} placeholder="Indonesia" className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Alamat Ibu</Label>
                <Textarea value={form.ibuAlamat} onChange={handleInputChange("ibuAlamat")} placeholder="Alamat lengkap ibu" className={TEXTAREA_BASE} />
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
