import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import { SURAT_NIKAH_OPTIONS } from "@/data/surat-nikah-options";

export default function SuratNikahPage() {
  return (
    <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
      <header className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-full bg-white shadow-[6px_6px_12px_rgba(200,205,215,0.35),_-6px_-6px_12px_rgba(255,255,255,0.9)]">
            <Image
              src={logoDesa}
              alt="Logo Desa Kedungwringin"
              fill
              sizes="48px"
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-base font-semibold text-slate-900 sm:text-lg">
            Desa Kedungwringin
          </span>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-[18px] px-5 py-2.5 text-sm font-semibold text-white border-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff6435]/20 focus-visible:ring-offset-4 focus-visible:ring-offset-[#EBEFF3] active:scale-[0.98]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #FC5132 0%, #FC5132 100%)",
            boxShadow:
              "2.42px 2.42px 4.83px 0px #BDC2C7BF, 4.83px 4.83px 7.25px 0px #BDC2C740, -2.42px -2.42px 4.83px 0px #FFFFFFBF, -4.83px -4.83px 7.25px 0px #FFFFFF40, inset 2.42px 2.42px 4.83px 0px #FFFFFFBF, inset 4.83px 4.83px 7.25px 0px #FFFFFF40, inset -2.42px -2.42px 4.83px 0px #FC5132BF, inset -4.83px -4.83px 7.25px 0px #FC513240",
          }}
        >
          Admin Login
        </Link>
      </header>

      <div className="mx-auto mt-14 flex w-full max-w-4xl flex-col gap-8">
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
            <Link
              key={option.slug}
              href={`/surat-nikah/${option.slug}`}
              className="block transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#EBEFF3]"
            >
              <Card className="rounded-3xl border border-white/40 bg-white/80 shadow-[5px_5px_16px_rgba(197,205,214,0.35)] backdrop-blur">
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
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
