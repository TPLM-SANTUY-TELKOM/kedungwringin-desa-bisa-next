"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, AlertCircle, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { SuratKeteranganOption } from "@/data/surat-keterangan-options";
import type { SuratKeteranganUmumData } from "@/app/surat-keterangan/types";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import { getPejabatByNama } from "@/lib/pejabat";

type PreviewUmumProps = {
  surat: SuratKeteranganOption;
  data: SuratKeteranganUmumData;
  reservedNumberId?: string;
};

function formatDateIndonesian(dateString: string): string {
  if (!dateString) return "";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function PreviewUmum({ surat, data, reservedNumberId }: PreviewUmumProps) {
  const router = useRouter();
  const [isPrinting, setIsPrinting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const pejabatPenandatangan = getPejabatByNama(data.kepalaDesa);

  const handlePrintClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmPrint = async () => {
    setShowConfirmDialog(false);

    if (reservedNumberId) {
      try {
        setIsPrinting(true);
        // Confirm nomor surat
        const response = await fetch("/api/surat-number", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: reservedNumberId }),
        });

        if (!response.ok) {
          console.error("Failed to confirm number");
          alert("Gagal mengkonfirmasi nomor surat. Silakan coba lagi.");
          return;
        }
      } catch (error) {
        console.error("Error confirming number:", error);
        alert("Terjadi kesalahan saat mengkonfirmasi nomor surat.");
        return;
      } finally {
        setIsPrinting(false);
      }
    }
    window.print();
  };

  const handleCancelPrint = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print-hidden">
          <div className="relative mx-4 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-3xl border border-white/60 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Konfirmasi Cetak Surat</h3>
                    <p className="text-xs text-slate-500">Pastikan data sudah benar</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelPrint}
                  className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                    <div className="text-sm text-slate-700">
                      <p className="mb-2 font-medium">Apakah Anda sudah yakin dengan data ini?</p>
                      <p className="text-slate-600">
                        Setelah dicetak, nomor surat <span className="font-semibold text-slate-900">{data.nomorSurat}</span> akan 
                        dikonfirmasi secara permanen dan tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCancelPrint}
                    variant="outline"
                    className="flex-1 rounded-full border-slate-300 px-6 hover:bg-slate-50"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleConfirmPrint}
                    disabled={isPrinting}
                    className="flex-1 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    {isPrinting ? "Memproses..." : "Ya, Cetak"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push(`/surat-keterangan/${surat.slug}`)} className="rounded-full border-slate-300 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button 
            onClick={handlePrintClick} 
            className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
            disabled={isPrinting}
          >
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? "Memproses..." : "Cetak"}
          </Button>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Preview - {surat.title}</p>
          <p className="text-xs uppercase tracking-wide">Periksa kembali sebelum mencetak</p>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper">
        <div className="mx-auto max-w-[720px] px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet">
          {/* Header */}
          <div className="border-b-[3px] border-black pb-3 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="relative h-20 w-20">
                <Image src={logoDesa} alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <p className="text-[16px] font-bold uppercase">Pemerintah Desa Kedungwringin</p>
                <p className="text-[14px] font-bold uppercase">Kecamatan Patikraja Kabupaten Banyumas</p>
                <p className="text-[18px] font-bold uppercase">Kepala Desa</p>
                <p className="text-[12px]">Jl. Raya Kedungwringin No.1 Kedungwringin Kode Pos 53171</p>
                <p className="text-[12px]">Telp. (0281) 6438935</p>
                <p className="text-[11px] italic">e-mail : kedungwringinbalaldesaku@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mt-6 text-center">
            <p className="text-[16px] font-bold uppercase underline">Surat Keterangan Umum</p>
            <p className="text-[13px]">Nomor : {data.nomorSurat}</p>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-3 text-[14px] leading-relaxed">
            <p className="text-justify">Yang bertanda tangan di bawah ini kami Kepala Desa Kedungwringin Kecamatan Patikraja Kabupaten Banyumas Provinsi Jawa Tengah, menerangkan bahwa :</p>
          </div>

          <table className="mt-4 w-full text-[14px] leading-relaxed">
            <tbody className="[&>tr>td]:py-1 [&>tr>td]:align-top">
              <tr>
                <td className="w-[50px]">1.</td>
                <td className="w-[200px]">Nama</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">{data.nama}</td>
              </tr>
              <tr>
                <td>2.</td>
                <td>Tempat/Tanggal Lahir</td>
                <td className="pr-3">:</td>
                <td>{data.tempatLahir} / {formatDateIndonesian(data.tanggalLahir)}</td>
              </tr>
              <tr>
                <td>3.</td>
                <td>Warganegara</td>
                <td className="pr-3">:</td>
                <td>{data.kewarganegaraan}</td>
              </tr>
              <tr>
                <td>4.</td>
                <td>Agama</td>
                <td className="pr-3">:</td>
                <td>{data.agama}</td>
              </tr>
              <tr>
                <td>5.</td>
                <td>Pekerjaan</td>
                <td className="pr-3">:</td>
                <td>{data.pekerjaan}</td>
              </tr>
              <tr>
                <td>6.</td>
                <td>Tempat Tinggal</td>
                <td className="pr-3">:</td>
                <td>{data.alamat}, RT.{data.rt} / RW.{data.rw}, {data.kelurahan}, {data.kecamatan}, {data.kabupaten}</td>
              </tr>
              <tr>
                <td>7.</td>
                <td>Surat bukti diri</td>
                <td className="pr-3">:</td>
                <td>NIK. {data.nik}</td>
              </tr>
              <tr>
                <td>8.</td>
                <td>Keperluan</td>
                <td className="pr-3">:</td>
                <td>{data.keperluan}</td>
              </tr>
              <tr>
                <td>9.</td>
                <td>Berlaku</td>
                <td className="pr-3">:</td>
                <td>{formatDateIndonesian(data.tanggalSurat)} s/d {formatDateIndonesian(data.tanggalSurat)}</td>
              </tr>
              <tr>
                <td>10.</td>
                <td>Keterangan lain</td>
                <td className="pr-3">:</td>
                <td>{data.keteranganLain || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 space-y-3 text-[14px] leading-relaxed">
            <p className="text-justify">Demikian Surat Keterangan ini dibuat untuk dipergunakan seperlunya.</p>
          </div>

          {/* Signature - Two Columns */}
          <div className="mt-16 flex justify-between items-start">
            {/* Left Column - Pemohon */}
            <div className="text-center w-[280px]">
              <p className="text-[14px]">Pemohon</p>
              <div className="my-32"></div>
              <p className="text-[14px] font-bold uppercase underline">{data.nama}</p>
            </div>

            {/* Right Column - An.Kepala Desa */}
            <div className="text-center w-[280px]">
              <p className="text-[14px]">{data.tempatSurat}, {formatDateIndonesian(data.tanggalSurat)}</p>
              <p className="text-[14px] font-semibold uppercase">{pejabatPenandatangan.jabatan}</p>
              <div className="my-20"></div>
              <p className="text-[14px] font-bold uppercase underline">{pejabatPenandatangan.nama}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
