import { notFound } from "next/navigation";

import { findSuratNikahBySlug } from "@/data/surat-nikah-options";
import type {
  FormN1Data,
  FormN2Data,
  FormN3Data,
  FormN4Data,
  FormN6Data,
  PengantarNumpangNikahData,
  PernyataanBelumMenikahData,
  WaliNikahData,
} from "@/app/surat-nikah/types";
import { findSuratFormEntryById, saveSuratFormEntryFromPreview, updateSuratFormEntry } from "@/lib/suratFormEntryService";

import { PreviewN1 } from "../PreviewN1";
import { PreviewN2 } from "../PreviewN2";
import { PreviewN3 } from "../PreviewN3";
import { PreviewN4 } from "../PreviewN4";
import { PreviewN6 } from "../PreviewN6";
import { PreviewWaliNikah } from "../PreviewWaliNikah";
import { PreviewPernyataanBelumMenikah } from "../PreviewPernyataanBelumMenikah";
import { PreviewPengantarNumpang } from "../PreviewPengantarNumpang";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ data?: string; entryId?: string; reservedNumberId?: string }> | { data?: string; entryId?: string; reservedNumberId?: string };
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratNikahBySlug(decodedSlug);

  if (!surat) {
    notFound();
  }

  const resolvedSearch = await searchParams;
  const entryId = resolvedSearch?.entryId;
  const encoded = resolvedSearch?.data;
  const reservedNumberId = resolvedSearch?.reservedNumberId;
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

  const previewMainClass =
    "surat-nikah-print min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12";

  switch (surat.slug) {
    case "formulir-pengantar-nikah":
      return (
        <main className={previewMainClass}>
          <PreviewN1 surat={surat} data={formData as FormN1Data} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "formulir-permohonan-kehendak-perkawinan":
      return (
        <main className={previewMainClass}>
          <PreviewN2 surat={surat} data={formData as FormN2Data} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "formulir-surat-persetujuan-mempelai":
      return (
        <main className={previewMainClass}>
          <PreviewN3 surat={surat} data={formData as FormN3Data} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "formulir-surat-izin-orang-tua":
      return (
        <main className={previewMainClass}>
          <PreviewN4 surat={surat} data={formData as FormN4Data} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "formulir-surat-keterangan-kematian":
      return (
        <main className={previewMainClass}>
          <PreviewN6 surat={surat} data={formData as FormN6Data} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-keterangan-wali-nikah":
      return (
        <main className={previewMainClass}>
          <PreviewWaliNikah surat={surat} data={formData as WaliNikahData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-pernyataan-belum-menikah":
      return (
        <main className={previewMainClass}>
          <PreviewPernyataanBelumMenikah surat={surat} data={formData as PernyataanBelumMenikahData} reservedNumberId={reservedNumberId} />
        </main>
      );
    case "surat-pengantar-numpang-nikah":
      return (
        <main className={previewMainClass}>
          <PreviewPengantarNumpang surat={surat} data={formData as PengantarNumpangNikahData} reservedNumberId={reservedNumberId} />
        </main>
      );
    default:
      notFound();
  }
}
