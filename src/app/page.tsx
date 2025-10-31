"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, FileText, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const JENIS_SURAT = [
  { id: "SKTM", nama: "Surat Keterangan Tidak Mampu" },
  { id: "Domisili", nama: "Surat Keterangan Domisili" },
  { id: "Usaha", nama: "Surat Keterangan Usaha" },
  { id: "SKCK", nama: "Surat Pengantar SKCK" },
  { id: "N1", nama: "Surat Pengantar Nikah N1" },
  { id: "N2", nama: "Surat Pengantar Nikah N2" },
  { id: "N3", nama: "Surat Pengantar Nikah N3" },
  { id: "N4", nama: "Surat Pengantar Nikah N4" },
  { id: "N5", nama: "Surat Pengantar Nikah N5" },
];

const PEJABAT = [
  "Kepala Desa Kedungwringin",
  "Sekretaris Desa",
  "Kaur Pemerintahan",
  "Kepala Dusun I",
  "Kepala Dusun II",
  "Kepala Dusun III",
] as const;

// Validation schema for the form
const suratSchema = z.object({
  jenisSurat: z.enum(JENIS_SURAT.map(s => s.id) as [string, ...string[]]),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
  keperluan: z.string()
    .trim()
    .min(10, "Keperluan minimal 10 karakter")
    .max(500, "Keperluan maksimal 500 karakter"),
  pejabatTtd: z.enum(PEJABAT),
});

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPenduduk, setSelectedPenduduk] = useState<any>(null);
  const [jenisSurat, setJenisSurat] = useState("");
  const [nik, setNik] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [pejabatTtd, setPejabatTtd] = useState("");
  const [searchingNik, setSearchingNik] = useState(false);

  const handleSearchNik = async () => {
    if (!nik || nik.length !== 16) {
      toast({
        title: "Error",
        description: "NIK harus 16 digit",
        variant: "destructive",
      });
      return;
    }

    setSearchingNik(true);
    try {
      const { data, error } = await supabase
        .rpc("search_penduduk_by_nik", { p_nik: nik });

      if (error) throw error;

      if (data && data.length > 0) {
        setSelectedPenduduk(data[0]);
        toast({
          title: "Berhasil",
          description: "Data penduduk ditemukan",
        });
      } else {
        setSelectedPenduduk(null);
        toast({
          title: "Tidak Ditemukan",
          description: "NIK tidak ditemukan dalam database",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSearchingNik(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with zod
    try {
      suratSchema.parse({
        jenisSurat,
        nik,
        keperluan,
        pejabatTtd,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validasi Gagal",
          description: error.issues[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    if (!selectedPenduduk) {
      toast({
        title: "Error",
        description: "Silakan cari dan pilih data penduduk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Submit surat using RPC function (works for public/unauthenticated users)
      const { data: suratData, error: suratError } = await supabase
        .rpc("submit_public_surat", {
          p_jenis_surat: jenisSurat as any,
          p_penduduk_id: selectedPenduduk.id,
          p_keperluan: keperluan,
          p_pejabat_ttd: pejabatTtd,
        });

      if (suratError) throw suratError;

      const result = suratData as { id: string; nomor_surat: string };

      setSubmitted(true);
      toast({
        title: "Berhasil",
        description: `Permohonan surat berhasil diajukan dengan nomor: ${result.nomor_surat}`,
      });

      // Reset form
      setTimeout(() => {
        setSelectedPenduduk(null);
        setJenisSurat("");
        setNik("");
        setKeperluan("");
        setPejabatTtd("");
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elevated text-center">
          <CardContent className="pt-12 pb-12">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Berhasil Diajukan!</h2>
            <p className="text-muted-foreground mb-6">
              Permohonan surat Anda telah diterima dan akan segera diproses oleh petugas desa.
            </p>
            <p className="text-sm text-muted-foreground">
              Anda akan diarahkan kembali ke form...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Desa Kedungwringin</h1>
                <p className="text-sm opacity-90">Sistem Pelayanan Surat Online</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push("/admin")}>
              Admin Login
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card className="shadow-elevated">
          <CardHeader className="bg-gradient-soft border-b">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Form Pengajuan Surat</CardTitle>
                <CardDescription>
                  Isi formulir di bawah ini untuk mengajukan permohonan surat
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jenisSurat">Jenis Surat *</Label>
                <Select value={jenisSurat} onValueChange={setJenisSurat} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_SURAT.map((surat) => (
                      <SelectItem key={surat.id} value={surat.id}>
                        {surat.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 digit) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="nik"
                    type="text"
                    placeholder="Masukkan NIK 16 digit"
                    value={nik}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setNik(value);
                    }}
                    className="h-11"
                    maxLength={16}
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleSearchNik}
                    disabled={searchingNik || nik.length !== 16}
                    className="whitespace-nowrap"
                  >
                    {searchingNik ? "Mencari..." : "Cari"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan NIK 16 digit untuk mencari data penduduk
                </p>
              </div>

              {selectedPenduduk && (
                <Card className="bg-accent/50 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Nama Lengkap</div>
                        <div className="font-medium">{selectedPenduduk.nama}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">NIK</div>
                        <div className="font-medium">{selectedPenduduk.nik}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Tempat, Tanggal Lahir</div>
                        <div className="font-medium">
                          {selectedPenduduk.tempat_lahir},{" "}
                          {new Date(selectedPenduduk.tanggal_lahir).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Jenis Kelamin</div>
                        <div className="font-medium">
                          {selectedPenduduk.jenis_kelamin === "Laki-laki"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Agama</div>
                        <div className="font-medium">{selectedPenduduk.agama}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pekerjaan</div>
                        <div className="font-medium">
                          {selectedPenduduk.pekerjaan || "-"}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-muted-foreground">Alamat</div>
                        <div className="font-medium">
                          {selectedPenduduk.alamat}, RT {selectedPenduduk.rt}/RW{" "}
                          {selectedPenduduk.rw}, Dusun {selectedPenduduk.dusun}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="keperluan">Keperluan *</Label>
                <Textarea
                  id="keperluan"
                  placeholder="Tuliskan keperluan pembuatan surat (10-500 karakter)..."
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value.slice(0, 500))}
                  className="min-h-[100px]"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {keperluan.length}/500 karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pejabat">Pejabat Penandatangan *</Label>
                <Select value={pejabatTtd} onValueChange={setPejabatTtd} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih pejabat penandatangan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PEJABAT.map((pejabat) => (
                      <SelectItem key={pejabat} value={pejabat}>
                        {pejabat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                {loading ? "Memproses..." : "Ajukan Permohonan Surat"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
