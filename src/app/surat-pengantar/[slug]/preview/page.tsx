import { notFound } from "next/navigation";

import { findSuratPengantarBySlug } from "@/data/surat-pengantar-options";
import type {
  SuratPengantarUmumData,
  SuratPengantarKepolisianData,
  SuratPengantarIzinKeramaianData,
} from "@/app/surat-pengantar/types";
import { findSuratFormEntryById, saveSuratFormEntryFromPreview, updateSuratFormEntry } from "@/lib/suratFormEntryService";

import { PreviewUmum } from "../PreviewUmum";
import { PreviewKepolisian } from "../PreviewKepolisian";
import { PreviewIzinKeramaian } from "../PreviewIzinKeramaian";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ data?: string; entryId?: string; reservedNumberId?: string }> | { data?: string; entryId?: string; reservedNumberId?: string };
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratPengantarBySlug(decodedSlug);

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
    case "surat-pengantar-umum":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewUmum surat={surat} data={formData as SuratPengantarUmumData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-pengantar-kepolisian":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewKepolisian surat={surat} data={formData as SuratPengantarKepolisianData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-pengantar-izin-keramaian":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewIzinKeramaian surat={surat} data={formData as SuratPengantarIzinKeramaianData} reservedNumberId={reservedNumberId} />
        </main>
      );
    default:
      notFound();
  }
}
