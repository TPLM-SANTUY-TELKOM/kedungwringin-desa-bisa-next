"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { createDefaultFormN4, REQUIRED_FIELDS_N4, type FormN4Data } from "@/app/surat-nikah/types";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

export function SuratFormN4({ surat }: { surat: SuratNikahOption }) {
  const router = useRouter();
  const [form, setForm] = useState<FormN4Data>(() => createDefaultFormN4());
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof FormN4Data) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handleCancel = () => {
    router.back();
  };

  const handlePreview = () => {
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

    const payload = encodeURIComponent(JSON.stringify(form));
    router.push(`/surat-nikah/${surat.slug}/preview?data=${payload}`);
  };

  const renderIdentitySection = (
    title: string,
    fields: Array<{ key: keyof FormN4Data; label: string; placeholder?: string }>,
  ) => (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="grid gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key as string} className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{label}</Label>
            {key.toLowerCase().includes("alamat") ? (
              <Textarea value={form[key] ?? ""} onChange={handleInputChange(key)} className={TEXTAREA_BASE} placeholder={placeholder} rows={3} />
            ) : key.toLowerCase().includes("tanggal") ? (
              <Input type="date" value={form[key] ?? ""} onChange={handleInputChange(key)} className={INPUT_BASE} />
            ) : (
              <Input value={form[key] ?? ""} onChange={handleInputChange(key)} placeholder={placeholder} className={INPUT_BASE} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto mt-12 w-full max-w-4xl">
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

            {renderIdentitySection("Data Ayah/Wali/Pengampu", [
              { key: "ayahNama", label: "Nama lengkap dan alias", placeholder: "Nama ayah" },
              { key: "ayahAlias", label: "Alias", placeholder: "Alias (jika ada)" },
              { key: "ayahBin", label: "Bin", placeholder: "Nama kakek (jika diperlukan)" },
              { key: "ayahNik", label: "Nomor Induk Kependudukan", placeholder: "16 digit NIK" },
              { key: "ayahTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "ayahTanggalLahir", label: "Tanggal lahir" },
              { key: "ayahKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "ayahAgama", label: "Agama", placeholder: "Islam" },
              { key: "ayahPekerjaan", label: "Pekerjaan", placeholder: "Wiraswasta" },
              { key: "ayahAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

            {renderIdentitySection("Data Ibu/Wali/Pengampu", [
              { key: "ibuNama", label: "Nama lengkap dan alias", placeholder: "Nama ibu" },
              { key: "ibuAlias", label: "Alias", placeholder: "Alias (jika ada)" },
              { key: "ibuBinti", label: "Binti", placeholder: "Nama kakek (jika diperlukan)" },
              { key: "ibuNik", label: "Nomor Induk Kependudukan", placeholder: "16 digit NIK" },
              { key: "ibuTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "ibuTanggalLahir", label: "Tanggal lahir" },
              { key: "ibuKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "ibuAgama", label: "Agama", placeholder: "Islam" },
              { key: "ibuPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
              { key: "ibuAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

            {renderIdentitySection("Identitas Anak Yang Diberi Izin", [
              { key: "anakNama", label: "Nama lengkap dan alias", placeholder: "Nama anak" },
              { key: "anakAlias", label: "Alias", placeholder: "Alias (jika ada)" },
              { key: "anakBinti", label: "Bin/Binti", placeholder: "Nama ayah" },
              { key: "anakNik", label: "Nomor Induk Kependudukan", placeholder: "16 digit NIK" },
              { key: "anakTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "anakTanggalLahir", label: "Tanggal lahir" },
              { key: "anakKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "anakAgama", label: "Agama", placeholder: "Islam" },
              { key: "anakPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
              { key: "anakAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

            {renderIdentitySection("Calon Pasangan", [
              { key: "calonPasanganNama", label: "Nama lengkap dan alias", placeholder: "Nama calon pasangan" },
              { key: "calonPasanganAlias", label: "Alias", placeholder: "Alias (jika ada)" },
              { key: "calonPasanganBin", label: "Bin/Binti", placeholder: "Nama orang tua" },
              { key: "calonPasanganNik", label: "Nomor Induk Kependudukan", placeholder: "16 digit NIK" },
              { key: "calonPasanganTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "calonPasanganTanggalLahir", label: "Tanggal lahir" },
              { key: "calonPasanganKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "calonPasanganAgama", label: "Agama", placeholder: "Islam" },
              { key: "calonPasanganPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
              { key: "calonPasanganAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

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
