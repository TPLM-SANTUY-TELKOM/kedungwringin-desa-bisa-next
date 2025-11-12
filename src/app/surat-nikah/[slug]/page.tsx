import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import { findSuratNikahBySlug } from "@/data/surat-nikah-options";

import { SuratFormN1 } from "./SuratFormN1";
import { SuratFormN2 } from "./SuratFormN2";
import { SuratFormN3 } from "./SuratFormN3";
import { SuratFormN4 } from "./SuratFormN4";
import { SuratFormN6 } from "./SuratFormN6";
import { SuratFormWaliNikah } from "./SuratFormWaliNikah";
import { SuratFormPernyataanBelumMenikah } from "./SuratFormPernyataanBelumMenikah";
import { SuratFormPengantarNumpang } from "./SuratFormPengantarNumpang";

type SuratNikahFormPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SuratNikahFormPage({ params }: SuratNikahFormPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratNikahBySlug(decodedSlug);

  if (!surat) {
    notFound();
  }

  const renderForm = () => {
    switch (surat.slug) {
      case "formulir-pengantar-nikah":
        return <SuratFormN1 surat={surat} />;
      case "formulir-permohonan-kehendak-perkawinan":
        return <SuratFormN2 surat={surat} />;
      case "formulir-surat-persetujuan-mempelai":
        return <SuratFormN3 surat={surat} />;
      case "formulir-surat-izin-orang-tua":
        return <SuratFormN4 surat={surat} />;
      case "formulir-surat-keterangan-kematian":
        return <SuratFormN6 surat={surat} />;
      case "surat-keterangan-wali-nikah":
        return <SuratFormWaliNikah surat={surat} />;
      case "surat-pernyataan-belum-menikah":
        return <SuratFormPernyataanBelumMenikah surat={surat} />;
      case "surat-pengantar-numpang-nikah":
        return <SuratFormPengantarNumpang surat={surat} />;
      default:
        return (
          <Card className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/60 bg-white/70 shadow-[8px_8px_24px_rgba(180,190,205,0.35)]">
            <CardContent className="p-10 text-center">
              <p className="text-xl font-semibold text-slate-800">Form belum tersedia</p>
              <p className="mt-2 text-sm text-slate-600">
                Formulir untuk “{surat.title}” masih dalam proses pengembangan.
              </p>
              <Link href="/surat-nikah" className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Kembali ke daftar surat nikah
              </Link>
            </CardContent>
          </Card>
        );
    }
  };

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
          <span className="text-base font-semibold text-slate-900 sm:text-lg">Desa Kedungwringin</span>
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

      {renderForm()}
    </main>
  );
}
