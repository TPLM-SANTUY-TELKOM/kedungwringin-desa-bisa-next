'use client';

import Image from "next/image";

import { useCallback, useEffect, useMemo, useState } from "react";

import { findSuratNikahBySlug, type SuratNikahOption } from "@/data/surat-nikah-options";
import { NIKAH_BUNDLE_CODES } from "@/data/surat-form-meta";
import type { SuratFormEntryRecord } from "@/lib/suratFormEntryService";
import { Button } from "@/components/ui/button";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import { useBackNavigation } from "@/hooks/useBackNavigation";

import { PreviewN1 } from "../../../[slug]/PreviewN1";
import { PreviewN2 } from "../../../[slug]/PreviewN2";
import { PreviewN3 } from "../../../[slug]/PreviewN3";
import { PreviewN4 } from "../../../[slug]/PreviewN4";
import { PreviewN6 } from "../../../[slug]/PreviewN6";
import { PreviewWaliNikah } from "../../../[slug]/PreviewWaliNikah";
import { PreviewPernyataanBelumMenikah } from "../../../[slug]/PreviewPernyataanBelumMenikah";
import { PreviewPengantarNumpang } from "../../../[slug]/PreviewPengantarNumpang";

type BundlePreviewClientProps = {
  bundleKey: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const PREVIEW_COMPONENTS: Record<
  string,
  React.ComponentType<{ surat: SuratNikahOption; data: any }>
> = {
  "formulir-pengantar-nikah": PreviewN1,
  "formulir-permohonan-kehendak-perkawinan": PreviewN2,
  "formulir-surat-persetujuan-mempelai": PreviewN3,
  "formulir-surat-izin-orang-tua": PreviewN4,
  "formulir-surat-keterangan-kematian": PreviewN6,
  "surat-keterangan-wali-nikah": PreviewWaliNikah,
  "surat-pernyataan-belum-menikah": PreviewPernyataanBelumMenikah,
  "surat-pengantar-numpang-nikah": PreviewPengantarNumpang,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function BundlePreviewClient({ bundleKey }: BundlePreviewClientProps) {
  const [entries, setEntries] = useState<SuratFormEntryRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleBack = useBackNavigation("/surat-masuk");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/surat-form-entries/bundles/${encodeURIComponent(bundleKey)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Bundle tidak ditemukan.");
        }
        const data = (await res.json()) as { entries: SuratFormEntryRecord[] };
        setEntries(data.entries);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message || "Gagal memuat bundle.");
          setEntries(null);
        }
      }
    };
    void load();
    return () => controller.abort();
  }, [bundleKey]);

  const orderedEntries = useMemo(() => {
    if (!entries) return [];
    return [...entries].sort(
      (a, b) =>
        NIKAH_BUNDLE_CODES.indexOf(a.jenis_surat.toUpperCase()) -
        NIKAH_BUNDLE_CODES.indexOf(b.jenis_surat.toUpperCase()),
    );
  }, [entries]);

  const handleJumpToSection = useCallback((sectionId: string) => {
    const node = document.getElementById(sectionId);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <main className="bundle-preview min-h-screen bg-[#EBEFF3] px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
      <style jsx global>{`
        .bundle-preview .print-hidden {
          display: none !important;
        }
      `}</style>
      <header className="print:hidden flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-full bg-white shadow-[6px_6px_12px_rgba(200,205,215,0.35),_-6px_-6px_12px_rgba(255,255,255,0.9)]">
            <Image src={logoDesa} alt="Logo Desa Kedungwringin" fill sizes="48px" className="object-contain p-1" priority />
          </div>
          <span className="text-base font-semibold text-slate-900 sm:text-lg">Desa Kedungwringin</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-full border-slate-300" onClick={handleBack}>
            Kembali ke Surat Masuk
          </Button>
          <Button
            className="rounded-full border-0 bg-slate-900 px-6 text-white hover:bg-slate-800"
            onClick={() => window.print()}
          >
            Cetak Semua
          </Button>
        </div>
      </header>

      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-6 print:hidden">
        <div className="rounded-[36px] border border-white/60 bg-white/90 p-6 shadow-[5px_5px_16px_rgba(197,205,214,0.35)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Informasi Paket</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">Bundle ID: {bundleKey}</p>
          <p className="mt-1 text-sm text-slate-600">
            Paket ini berisi {orderedEntries.length || 0} dokumen ({orderedEntries.map((entry) => entry.jenis_surat).join(", ") || "-"}).
          </p>
          {!entries && !error && <p className="mt-4 text-sm text-slate-500">Memuat data paket...</p>}
          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {orderedEntries.length > 0 && (
          <div className="rounded-[36px] border border-white/60 bg-white p-6 shadow-[5px_5px_16px_rgba(197,205,214,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Daftar Dokumen</p>
            <div className="mt-4 grid gap-4 grid-cols-1">
              {orderedEntries.map((entry) => {
                const surat = findSuratNikahBySlug(entry.slug);
                const sectionId = `bundle-section-${entry.id}`;
                return (
                  <div
                    key={`summary-${entry.id}`}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="text-sm font-semibold text-slate-900">Model {entry.jenis_surat}</div>
                    <p className="text-xs text-slate-500">{surat?.title ?? entry.slug}</p>
                    <div className="mt-4 flex justify-between text-xs text-slate-500">
                      <span>{new Date(entry.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-3 justify-start px-0 text-sm font-semibold text-slate-800 hover:text-slate-900"
                      onClick={() => handleJumpToSection(sectionId)}
                    >
                      Lihat Dokumen
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bundle-preview-stack space-y-8 pt-10">
        {orderedEntries.map((entry) => {
          const surat = findSuratNikahBySlug(entry.slug);
          const Component = PREVIEW_COMPONENTS[entry.slug];
          const sectionId = `bundle-section-${entry.id}`;
          if (!surat || !Component) {
            return null;
          }
          return (
            <section key={entry.id} id={sectionId} className="surat-nikah-print">
              <Component surat={surat} data={entry.form_data} />
            </section>
          );
        })}
      </div>
    </main>
  );
}
