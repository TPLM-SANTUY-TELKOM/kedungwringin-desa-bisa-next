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
import { createDefaultWaliNikahData, REQUIRED_FIELDS_WALI_NIKAH, type WaliNikahData } from "@/app/surat-nikah/types";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

export function SuratFormWaliNikah({ surat }: { surat: SuratNikahOption }) {
  const router = useRouter();
  const [form, setForm] = useState<WaliNikahData>(() => createDefaultWaliNikahData());
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof WaliNikahData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const payload = encodeURIComponent(JSON.stringify(form));
    router.push(`/surat-nikah/${surat.slug}/preview?data=${payload}`);
  };

  const renderIdentityFields = (prefix: string, mappings: Array<{ key: keyof WaliNikahData; label: string; placeholder?: string }>) => (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{prefix}</p>
      <div className="grid gap-4">
        {mappings.map(({ key, label, placeholder }) => (
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
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Nomor Surat</Label>
                  <Input value={form.nomorSurat} onChange={handleInputChange("nomorSurat")} placeholder="474.2/08/55/XI/2020" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                  <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tempat Surat</Label>
                <Input value={form.tempatSurat} onChange={handleInputChange("tempatSurat")} placeholder="Kedungwringin" className={INPUT_BASE} />
              </div>
            </div>

            {renderIdentityFields("Data Wali Nikah", [
              { key: "waliNama", label: "Nama lengkap", placeholder: "Nama wali" },
              { key: "waliBin", label: "Bin", placeholder: "Nama ayah wali" },
              { key: "waliTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "waliTanggalLahir", label: "Tanggal lahir" },
              { key: "waliKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "waliAgama", label: "Agama", placeholder: "Islam" },
              { key: "waliPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
              { key: "waliAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

            {renderIdentityFields("Data Calon Mempelai Perempuan", [
              { key: "mempelaiNama", label: "Nama lengkap", placeholder: "Nama calon mempelai" },
              { key: "mempelaiBinti", label: "Binti", placeholder: "Nama ayah" },
              { key: "mempelaiTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "mempelaiTanggalLahir", label: "Tanggal lahir" },
              { key: "mempelaiKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "mempelaiAgama", label: "Agama", placeholder: "Islam" },
              { key: "mempelaiPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
              { key: "mempelaiAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

            {renderIdentityFields("Data Calon Suami", [
              { key: "pasanganNama", label: "Nama lengkap", placeholder: "Nama calon suami" },
              { key: "pasanganBin", label: "Bin", placeholder: "Nama ayah" },
              { key: "pasanganTempatLahir", label: "Tempat lahir", placeholder: "Kabupaten" },
              { key: "pasanganTanggalLahir", label: "Tanggal lahir" },
              { key: "pasanganKewarganegaraan", label: "Kewarganegaraan", placeholder: "Indonesia" },
              { key: "pasanganAgama", label: "Agama", placeholder: "Islam" },
              { key: "pasanganPekerjaan", label: "Pekerjaan", placeholder: "Pekerjaan" },
              { key: "pasanganAlamat", label: "Alamat", placeholder: "Alamat lengkap" },
            ])}

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
                <Textarea value={form.hubunganWali} onChange={handleInputChange("hubunganWali")} className={TEXTAREA_BASE} placeholder="Hubungan wali dengan mempelai" rows={3} />
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
