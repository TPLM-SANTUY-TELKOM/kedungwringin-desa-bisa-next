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

import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { createDefaultFormN1, REQUIRED_FIELDS_N1, type FormN1Data } from "@/app/surat-nikah/types";

const INPUT_BASE =
  "h-12 rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";
const TEXTAREA_BASE =
  "min-h-[90px] rounded-xl border border-slate-300 bg-white/80 text-base text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400";

export function SuratFormN1({ surat }: { surat: SuratNikahOption }) {
  const router = useRouter();
  const [form, setForm] = useState<FormN1Data>(() => createDefaultFormN1());
  const [error, setError] = useState<string | null>(null);

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

  const handleCancel = () => {
    router.back();
  };

  const handlePreview = () => {
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

    const payload = encodeURIComponent(JSON.stringify(form));
    router.push(`/surat-nikah/${surat.slug}/preview?data=${payload}`);
  };

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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Nomor Surat</Label>
                  <Input value={form.nomorSurat} onChange={handleInputChange("nomorSurat")} placeholder="472.21/08/05/II/2025" className={INPUT_BASE} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tanggal Surat</Label>
                  <Input type="date" value={form.tanggalSurat} onChange={handleInputChange("tanggalSurat")} className={INPUT_BASE} />
                </div>
              </div>
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
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data Calon Mempelai</p>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                <Input value={form.namaPemohon} onChange={handleInputChange("namaPemohon")} placeholder="Nama lengkap sesuai KTP" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">NIK</Label>
                  <Input value={form.nikPemohon} onChange={handleInputChange("nikPemohon")} placeholder="Nomor Induk Kependudukan" className={INPUT_BASE} />
                  <p className="text-xs text-slate-500">Pastikan sesuai KTP elektronik.</p>
                </div>
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
                  <Input
                    value={form.statusPerkawinanLaki}
                    onChange={handleInputChange("statusPerkawinanLaki")}
                    placeholder="Jejaka/Duda"
                    className={INPUT_BASE}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Beristri ke (jika laki-laki)</Label>
                  <Input
                    value={form.statusPerkawinanBeristriKe}
                    onChange={handleInputChange("statusPerkawinanBeristriKe")}
                    placeholder="Isi jika sudah beristri"
                    className={INPUT_BASE}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Perempuan</Label>
                  <Input
                    value={form.statusPerkawinanPerempuan}
                    onChange={handleInputChange("statusPerkawinanPerempuan")}
                    placeholder="Perawan/Janda"
                    className={INPUT_BASE}
                  />
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
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap dan Alias</Label>
                <Input value={form.ayahNama} onChange={handleInputChange("ayahNama")} placeholder="Nama lengkap ayah" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">NIK Ayah</Label>
                  <Input value={form.ayahNik} onChange={handleInputChange("ayahNik")} placeholder="Nomor Induk Kependudukan" className={INPUT_BASE} />
                </div>
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
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Nama Lengkap dan Alias</Label>
                <Input value={form.ibuNama} onChange={handleInputChange("ibuNama")} placeholder="Nama lengkap ibu" className={INPUT_BASE} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">NIK Ibu</Label>
                  <Input value={form.ibuNik} onChange={handleInputChange("ibuNik")} placeholder="Nomor Induk Kependudukan" className={INPUT_BASE} />
                </div>
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
                <Input value={form.kepalaDesa} onChange={handleInputChange("kepalaDesa")} placeholder="Parminah" className={INPUT_BASE} />
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
