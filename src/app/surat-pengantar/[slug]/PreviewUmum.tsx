"use client";

import { useState } from "react";
import { ArrowLeft, Printer, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratPengantarOption } from "@/data/surat-pengantar-options";
import { formatDateIndonesian, type SuratPengantarUmumData } from "@/app/surat-pengantar/types";
import { useBackNavigation } from "@/hooks/useBackNavigation";

import { SuratPengantarHeader } from "./SuratPengantarHeader";

type PreviewUmumProps = {
  surat: SuratPengantarOption;
  data: SuratPengantarUmumData;
  reservedNumberId?: string;
};

export function PreviewUmum({ surat, data, reservedNumberId }: PreviewUmumProps) {
  const handleBack = useBackNavigation("/surat-pengantar");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClick = () => {
    if (reservedNumberId) {
      setShowConfirmDialog(true);
    } else {
      window.print();
    }
  };

  const handleConfirmPrint = async () => {
    if (!reservedNumberId) {
      window.print();
      return;
    }

    setIsPrinting(true);
    try {
      const response = await fetch("/api/surat-number", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservedNumberId, status: "confirmed" }),
      });

      if (!response.ok) {
        throw new Error("Gagal konfirmasi nomor surat");
      }

      setShowConfirmDialog(false);
      window.print();
    } catch (error) {
      console.error("Error confirming nomor surat:", error);
      alert("Gagal konfirmasi nomor surat. Silakan coba lagi.");
    } finally {
      setIsPrinting(false);
    }
  };

  const alamatLengkap = [
    data.alamat.trim(),
    data.rt ? `RT ${data.rt}` : "",
    data.rw ? `RW ${data.rw}` : "",
    data.kelurahan,
  ]
    .filter(Boolean)
    .join(", ");

  const alamatWilayah = [data.kecamatan, data.kabupaten].filter(Boolean).join(", ");

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleBack} className="rounded-full border-slate-300 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button onClick={handlePrintClick} className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Preview - {surat.title}</p>
          <p className="text-xs uppercase tracking-wide">Periksa kembali sebelum mencetak</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-300 bg-white p-4 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper">
        <div className="mx-auto max-w-[720px] border-0 px-7 py-6 font-['Times_New_Roman',serif] text-[12px] leading-[1.4] text-slate-900 print:px-9 print:py-8 print:text-[12px] print-sheet">
          <SuratPengantarHeader />
          <div className="text-center leading-tight">
            <p className="text-[16px] font-bold uppercase">Surat Pengantar</p>
            <p className="text-[12px] font-semibold">Nomor: {data.nomorSurat || "-"}</p>
          </div>

          <div className="mt-4 space-y-3 text-[12px] leading-[1.4]">
            <p>
              Yang bertanda tangan di bawah ini, Kepala Desa {data.kelurahan} Kecamatan {data.kecamatan} Kabupaten {data.kabupaten}, menerangkan dengan sebenarnya bahwa:
            </p>
          </div>

          <table className="mt-3 w-full text-[12px] leading-[1.4]">
            <tbody className="[&>tr>td]:align-top">
              <tr>
                <td className="w-[220px]">1. Nama</td>
                <td className="pr-3">:</td>
                <td>{data.nama || "-"}</td>
              </tr>
              <tr>
                <td>2. Jenis Kelamin</td>
                <td className="pr-3">:</td>
                <td>{data.jenisKelamin || "-"}</td>
              </tr>
              <tr>
                <td>3. Tempat/Tanggal Lahir</td>
                <td className="pr-3">:</td>
                <td>{data.tempatLahir || "-"} / {formatDateIndonesian(data.tanggalLahir)}</td>
              </tr>
              <tr>
                <td>4. Warganegara</td>
                <td className="pr-3">:</td>
                <td>{data.kewarganegaraan || "-"}</td>
              </tr>
              <tr>
                <td>5. Agama</td>
                <td className="pr-3">:</td>
                <td>{data.agama || "-"}</td>
              </tr>
              <tr>
                <td>6. Pekerjaan</td>
                <td className="pr-3">:</td>
                <td>{data.pekerjaan || "-"}</td>
              </tr>
              <tr>
                <td>7. Status Perkawinan</td>
                <td className="pr-3">:</td>
                <td>{data.statusPerkawinan || "-"}</td>
              </tr>
              <tr>
                <td>8. Tempat Tinggal</td>
                <td className="pr-3">:</td>
                <td>
                  {alamatLengkap || "-"}
                  {alamatWilayah && (
                    <>
                      <br />
                      {alamatWilayah}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>9. Surat bukti diri</td>
                <td className="pr-3">:</td>
                <td>
                  NIK. {data.nik || "-"}
                  <br />
                  No. KK. {data.nkk || "-"}
                </td>
              </tr>
              <tr>
                <td>10. Keperluan</td>
                <td className="pr-3">:</td>
                <td>{data.keperluan || "-"}</td>
              </tr>
              <tr>
                <td>11. Berlaku</td>
                <td className="pr-3">:</td>
                <td>
                  {formatDateIndonesian(data.berlakuDari) || "-"} s/d {formatDateIndonesian(data.berlakuSampai) || "-"}
                </td>
              </tr>
              <tr>
                <td>12. Keterangan lain</td>
                <td className="pr-3">:</td>
                <td>{data.keteranganLain || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 space-y-3 text-[12px] leading-[1.4]">
            <p>
              Demikian Surat Keterangan ini dibuat untuk dipergunakan seperlunya.
            </p>
          </div>

          <div className="mt-5 space-y-2 text-[12px] leading-[1.4]">
            <div className="flex w-full items-center gap-2">
              <span className="w-[80px]">No. Reg</span>
              <span>:</span>
              <span className="flex-1">
                <span className="inline-flex min-h-[20px] w-full items-center border-b border-black">
                  &nbsp;
                </span>
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-[80px]">Tanggal</span>
              <span>:</span>
              <span className="flex-1">
                <span className="inline-flex min-h-[20px] w-full items-center border-b border-black">
                  &nbsp;
                </span>
              </span>
            </div>
          </div>

          <table className="mt-5 w-full table-fixed text-center text-[12px] leading-[1.4]">
            <tbody>
              <tr className="[&>td]:align-bottom">
                <td>
                  <p>Pemohon</p>
                </td>
                <td>
                  <p>Mengetahui</p>
                  {data.mengetahuiJabatan && (
                    <p className="mt-1 text-[11px] font-semibold normal-case">{data.mengetahuiJabatan}</p>
                  )}
                </td>
                <td>
                  <p className="text-[11px]">
                    {data.tempatSurat || "-"}, {formatDateIndonesian(data.tanggalSurat)}
                  </p>
                  <p className="mt-1 uppercase">Kepala Desa</p>
                </td>
              </tr>
              <tr className="h-24">
                <td />
                <td />
                <td />
              </tr>
              <tr className="font-semibold">
                <td>({data.nama || "................................"})</td>
                <td>
                  <span className="underline">{data.mengetahuiNama || "................................"}</span>
                </td>
                <td>
                  <span className="underline">{data.kepalaDesa || "................................"}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print-hidden">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">Konfirmasi Cetak Surat</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Nomor surat <span className="font-semibold text-slate-900">{data.nomorSurat}</span> akan dikonfirmasi dan tidak dapat diubah.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isPrinting}
                className="flex-1 rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={handleConfirmPrint}
                disabled={isPrinting}
                className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800"
              >
                {isPrinting ? "Memproses..." : "Cetak Sekarang"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
