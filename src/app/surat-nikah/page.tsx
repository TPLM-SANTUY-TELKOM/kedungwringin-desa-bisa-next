import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type SuratNikahOption = {
  code?: string;
  title: string;
  description: string;
};

const SURAT_NIKAH_OPTIONS: SuratNikahOption[] = [
  {
    code: "N1",
    title: "Surat keterangan untuk nikah",
    description: "Surat keterangan untuk menikah",
  },
  {
    code: "N2",
    title: "Surat keterangan asal usul",
    description: "Keterangan asal usul mempelai",
  },
  {
    code: "N3",
    title: "Surat Pemberitahuan Kehendak Nikah",
    description: "Pemberitahuan kehendak menikah",
  },
  {
    code: "N5",
    title: "Surat Izin Orang Tua",
    description: "Untuk surat izin orang tua",
  },
  {
    code: "N6",
    title: "Surat Kematian Suami/Istri",
    description: "Untuk menikah lagi setelah kematian pasangan",
  },
  {
    title: "Surat keterangan wali",
    description: "Perwalian dari keluarga (Ayah/Kakek/Saudara)",
  },
  {
    title: "Surat pernyataan belum nikah",
    description: "Untuk menikah lagi setelah kematian pasangan",
  },
];

export default function SuratNikahPage() {
  return (
    <main className="min-h-screen bg-[#eef3fb] px-6 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Ajukan Surat
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Surat Pengantar Nikah
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
              Pilih jenis surat nikah yang Anda perlukan. Setiap surat memiliki
              fungsi dan persyaratan yang berbeda sesuai kebutuhan pengajuan.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {SURAT_NIKAH_OPTIONS.map((option) => (
            <Card
              key={`${option.code ?? option.title}`}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="space-y-1 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {option.code
                    ? `${option.code} - ${option.title}`
                    : option.title}
                </h2>
                <p className="text-sm text-slate-600 sm:text-base">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
