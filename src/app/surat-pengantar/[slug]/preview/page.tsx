import { notFound } from "next/navigation";

import { findSuratPengantarBySlug } from "@/data/surat-pengantar-options";
import type {
  SuratPengantarUmumData,
  SuratPengantarKepolisianData,
  SuratPengantarIzinKeramaianData,
} from "@/app/surat-pengantar/types";

import { PreviewUmum } from "../PreviewUmum";
import { PreviewKepolisian } from "../PreviewKepolisian";
import { PreviewIzinKeramaian } from "../PreviewIzinKeramaian";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ data?: string }> | { data?: string };
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratPengantarBySlug(decodedSlug);

  if (!surat) {
    notFound();
  }

  const resolvedSearch = await searchParams;
  const encoded = resolvedSearch?.data;

  if (!encoded) {
    notFound();
  }

  let formData: unknown;
  try {
    formData = JSON.parse(decodeURIComponent(encoded));
  } catch {
    notFound();
  }

  switch (surat.slug) {
    case "surat-pengantar-umum":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewUmum surat={surat} data={formData as SuratPengantarUmumData} />
        </main>
      );
    case "surat-pengantar-kepolisian":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewKepolisian surat={surat} data={formData as SuratPengantarKepolisianData} />
        </main>
      );
    case "surat-pengantar-izin-keramaian":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 print:min-h-0 print:bg-white print:px-0 print:pb-0 print:pt-0 sm:px-10 sm:pt-12">
          <PreviewIzinKeramaian surat={surat} data={formData as SuratPengantarIzinKeramaianData} />
        </main>
      );
    default:
      notFound();
  }
}

