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
  searchParams: Promise<{ data?: string }> | { data?: string };
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const surat = findSuratNikahBySlug(decodedSlug);

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
    case "formulir-pengantar-nikah":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewN1 surat={surat} data={formData as FormN1Data} />
        </main>
      );
    case "formulir-permohonan-kehendak-perkawinan":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewN2 surat={surat} data={formData as FormN2Data} />
        </main>
      );
    case "formulir-surat-persetujuan-mempelai":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewN3 surat={surat} data={formData as FormN3Data} />
        </main>
      );
    case "formulir-surat-izin-orang-tua":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewN4 surat={surat} data={formData as FormN4Data} />
        </main>
      );
    case "formulir-surat-keterangan-kematian":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewN6 surat={surat} data={formData as FormN6Data} />
        </main>
      );
    case "surat-keterangan-wali-nikah":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewWaliNikah surat={surat} data={formData as WaliNikahData} />
        </main>
      );
    case "surat-pernyataan-belum-menikah":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewPernyataanBelumMenikah surat={surat} data={formData as PernyataanBelumMenikahData} />
        </main>
      );
    case "surat-pengantar-numpang-nikah":
      return (
        <main className="min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
          <PreviewPengantarNumpang surat={surat} data={formData as PengantarNumpangNikahData} />
        </main>
      );
    default:
      notFound();
  }
}
