import { notFound } from "next/navigation";

import { findSuratKeteranganBySlug } from "@/data/surat-keterangan-options";
import type {
  SuratKeteranganUmumData,
  SuratKeteranganBelumPernahKawinData,
  SuratKeteranganDomisiliTempatTinggalData,
  SuratKeteranganUsahaData,
  SuratKeteranganWaliHakimData,
  SuratKeteranganDomisiliUsahaData,
  SuratKeteranganTidakMampuData,
} from "@/app/surat-keterangan/types";
import { findSuratFormEntryById, saveSuratFormEntryFromPreview, updateSuratFormEntry } from "@/lib/suratFormEntryService";

import { PreviewUmum } from "../PreviewUmum";
import { PreviewBelumPernahKawin } from "../PreviewBelumPernahKawin";
import { PreviewDomisiliTempatTinggal } from "../PreviewDomisiliTempatTinggal";
import { PreviewUsaha } from "../PreviewUsaha";
import { PreviewWaliHakim } from "../PreviewWaliHakim";
import { PreviewDomisiliUsaha } from "../PreviewDomisiliUsaha";
import { PreviewTidakMampu } from "../PreviewTidakMampu";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ data?: string; entryId?: string; reservedNumberId?: string }> | { data?: string; entryId?: string; reservedNumberId?: string };
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratKeteranganBySlug(decodedSlug);

  if (!surat) {
    notFound();
  }

  const resolvedSearch = await searchParams;
  const entryId = resolvedSearch?.entryId;
  const reservedNumberId = resolvedSearch?.reservedNumberId;
  const encoded = resolvedSearch?.data;
  let formData: unknown;

  if (encoded) {
    try {
      formData = JSON.parse(decodeURIComponent(encoded));
    } catch {
      notFound();
    }
  }

  if (entryId && formData) {
    const updated = await updateSuratFormEntry({
      id: entryId,
      slug: surat.slug,
      title: surat.title,
      jenis: surat.code ?? surat.slug,
      data: formData as Record<string, unknown>,
    });
    if (!updated) {
      notFound();
    }
    formData = updated.form_data;
  } else if (entryId) {
    const entry = await findSuratFormEntryById(entryId);
    if (!entry || entry.slug !== surat.slug) {
      notFound();
    }
    formData = entry.form_data;
  } else if (formData) {
    await saveSuratFormEntryFromPreview({
      slug: surat.slug,
      title: surat.title,
      jenis: surat.code ?? surat.slug,
      data: formData as Record<string, unknown>,
    });
  } else {
    notFound();
  }

  switch (surat.slug) {
    case "surat-keterangan-umum":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewUmum surat={surat} data={formData as SuratKeteranganUmumData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-keterangan-belum-pernah-kawin":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewBelumPernahKawin surat={surat} data={formData as SuratKeteranganBelumPernahKawinData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-keterangan-domisili-tempat-tinggal":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewDomisiliTempatTinggal surat={surat} data={formData as SuratKeteranganDomisiliTempatTinggalData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-keterangan-usaha":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewUsaha surat={surat} data={formData as SuratKeteranganUsahaData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-keterangan-wali-hakim":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewWaliHakim surat={surat} data={formData as SuratKeteranganWaliHakimData} />
        </main>
      );
    case "surat-keterangan-domisili-usaha":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewDomisiliUsaha surat={surat} data={formData as SuratKeteranganDomisiliUsahaData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-keterangan-tidak-mampu":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewTidakMampu surat={surat} data={formData as SuratKeteranganTidakMampuData} reservedNumberId={reservedNumberId} />
        </main>
      );
    default:
      notFound();
  }
}
