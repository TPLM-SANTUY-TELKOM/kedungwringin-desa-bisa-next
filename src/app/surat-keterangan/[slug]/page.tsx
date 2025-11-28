import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import { findSuratKeteranganBySlug } from "@/data/surat-keterangan-options";
import { findSuratFormEntryById } from "@/lib/suratFormEntryService";

import { SuratFormUmum } from "./SuratFormUmum";
import { SuratFormBelumPernahKawin } from "./SuratFormBelumPernahKawin";
import { SuratFormDomisiliTempatTinggal } from "./SuratFormDomisiliTempatTinggal";
import { SuratFormUsaha } from "./SuratFormUsaha";
import { SuratFormWaliHakim } from "./SuratFormWaliHakim";
import { SuratFormDomisiliUsaha } from "./SuratFormDomisiliUsaha";
import { SuratFormTidakMampu } from "./SuratFormTidakMampu";

type SuratKeteranganFormPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ entryId?: string; from?: string }> | { entryId?: string; from?: string };
};

export default async function SuratKeteranganFormPage({ params, searchParams }: SuratKeteranganFormPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratKeteranganBySlug(decodedSlug);

  if (!surat) {
    notFound();
  }

  const resolvedSearch = (await searchParams) ?? {};
  const entryId = resolvedSearch?.entryId;
  const fromSource = resolvedSearch?.from;
  let entryData: Record<string, unknown> | null = null;

  if (entryId) {
    const entry = await findSuratFormEntryById(entryId);
    if (!entry || entry.slug !== surat.slug) {
      notFound();
    }
    entryData = entry.form_data as Record<string, unknown>;
  }

  const backUrl = fromSource === "admin" ? "/surat" : "/surat-keterangan";

  const renderForm = () => {
    const commonProps = {
      surat,
      entryId,
      initialData: entryData,
      from: fromSource,
      backUrl,
    };

    switch (surat.slug) {
      case "surat-keterangan-umum":
        return <SuratFormUmum {...commonProps} />;
      case "surat-keterangan-belum-pernah-kawin":
        return <SuratFormBelumPernahKawin {...commonProps} />;
      case "surat-keterangan-domisili-tempat-tinggal":
        return <SuratFormDomisiliTempatTinggal {...commonProps} />;
      case "surat-keterangan-usaha":
        return <SuratFormUsaha {...commonProps} />;
      case "surat-keterangan-wali-hakim":
        return <SuratFormWaliHakim {...commonProps} />;
      case "surat-keterangan-domisili-usaha":
        return <SuratFormDomisiliUsaha {...commonProps} />;
      case "surat-keterangan-tidak-mampu":
        return <SuratFormTidakMampu {...commonProps} />;
      default:
        return (
          <Card className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/60 bg-white/70 shadow-[8px_8px_24px_rgba(180,190,205,0.35)]">
            <CardContent className="p-10 text-center">
              <p className="text-xl font-semibold text-slate-800">Form belum tersedia</p>
              <p className="mt-2 text-sm text-slate-600">
                Formulir untuk &ldquo;{surat.title}&rdquo; masih dalam proses pengembangan.
              </p>
              <Link href="/surat-keterangan" className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Kembali ke daftar surat keterangan
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
          className="inline-flex items-center justify-center rounded-[18px] bg-[#ff6435] px-5 py-2.5 text-sm font-semibold text-white shadow-[8px_8px_18px_rgba(203,47,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.65)] transition-all duration-200 hover:shadow-[12px_12px_24px_rgba(203,47,0,0.35),_-8px_-8px_20px_rgba(255,255,255,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff6435]/20 focus-visible:ring-offset-4 focus-visible:ring-offset-[#EBEFF3] active:scale-[0.98]"
        >
          Admin Login
        </Link>
      </header>

      {renderForm()}
    </main>
  );
}
