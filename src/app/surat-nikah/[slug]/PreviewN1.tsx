"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Printer, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import {
  buildFullAddress,
  formatDateIndonesian,
  type FormN1Data,
} from "@/app/surat-nikah/types";
import { useBackNavigation } from "@/hooks/useBackNavigation";

type PreviewN1Props = {
  surat: SuratNikahOption;
  data: FormN1Data;
  reservedNumberId?: string;
};

export function PreviewN1({ surat, data, reservedNumberId }: PreviewN1Props) {
  const handleBack = useBackNavigation("/surat-nikah");
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
      const response = await fetch(`/api/surat-number?id=${reservedNumberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengonfirmasi nomor surat");
      }

      setShowConfirmDialog(false);
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      console.error("Error confirming number:", error);
      alert("Gagal mengonfirmasi nomor surat. Silakan coba lagi.");
    } finally {
      setIsPrinting(false);
    }
  };

  const alamatLengkap = useMemo(
    () =>
      buildFullAddress({
        alamatJalan: data.alamatJalan,
        alamatRt: data.alamatRt,
        alamatRw: data.alamatRw,
        alamatKelurahan: data.alamatKelurahan,
        alamatKecamatan: data.alamatKecamatan,
        alamatKabupaten: data.alamatKabupaten,
      }),
    [
      data.alamatJalan,
      data.alamatRt,
      data.alamatRw,
      data.alamatKelurahan,
      data.alamatKecamatan,
      data.alamatKabupaten,
    ]
  );

  const renderMultiline = (value: string) => {
    if (!value || value.trim() === "") return "-";
    const lines = value.split("\n");
    return lines.map((line, i) => (
      <span key={`${line}-${i}`}>
        {line}
        {i < lines.length - 1 && <br />}
      </span>
    ));
  };

  const combineTempatTanggal = (tempat: string, tanggal: string) => {
    const formattedDate = formatDateIndonesian(tanggal);
    if (!tempat && (!tanggal || formattedDate === "-")) return "-";
    if (!tempat) return formattedDate;
    if (!tanggal || formattedDate === "-") return tempat;
    return `${tempat}, ${formattedDate}`;
  };

  const statusPerkawinanLakiText = data.statusPerkawinanLaki || "-";
  const statusPerkawinanPerempuanText = data.statusPerkawinanPerempuan || "-";
  const isStatusLakiBeristri =
    (data.statusPerkawinanLaki || "").toLowerCase() === "beristri";

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:gap-6 print:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleBack} className="rounded-full border-slate-300 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            onClick={handlePrintClick}
            className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p className="font-semibold text-slate-700">
            Preview -{" "}
            {surat.code ? `${surat.code} ${surat.title}` : surat.title}
          </p>
          <p className="text-xs uppercase tracking-wide">
            Periksa kembali sebelum mencetak
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper print:border-0 print:p-0">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet print:border-0 print:px-8 print:py-6 print:text-[12.5px] print:leading-snug">
          <div className="text-left text-[10px] uppercase leading-snug tracking-wide text-slate-700 print:text-[9px]">
            <p>Keputusan Direktur Jenderal Bimbingan Masyarakat Islam</p>
            <p>Nomor 713 Tahun 2018</p>
            <p>
              Tentang Penetapan Formulir dan Laporan Pencatatan Perkawinan atau
              Rujuk
            </p>
          </div>

          <div className="relative mt-4 leading-tight print:mt-3">
            <p className="text-center text-[16px] uppercase print:text-[16px]">
              Formulir Pengantar Nikah
            </p>
            <p className="absolute right-0 top-1/2 -translate-y-1/2 text-[16px]  uppercase print:text-[14px]">
              Model N1
            </p>
          </div>

          <div className="mt-5 flex justify-center print:mt-4">
            <table className="w-full max-w-md text-[15px] leading-relaxed print:text-[12.5px] print:leading-normal">
              <tbody className="[&>tr>td]:align-top">
                <tr>
                  <td className="w-[220px] uppercase">Kantor Desa/Kel</td>
                  <td className="w-6 text-center">:</td>
                  <td className="uppercase">{data.kantorDesa || "-"}</td>
                </tr>
                <tr>
                  <td className="uppercase">Kecamatan</td>
                  <td className="text-center">:</td>
                  <td className="uppercase">{data.kecamatanKantor || "-"}</td>
                </tr>
                <tr>
                  <td className="uppercase">Kabupaten</td>
                  <td className="text-center">:</td>
                  <td className="uppercase">{data.kabupatenKantor || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-1 text-center leading-tight print:mt-4 print:leading-snug">
            <p className="text-[16px] uppercase underline decoration-slate-700 decoration-1 print:text-[14px]">
              Surat Pengantar Perkawinan
            </p>
            <p className="text-[14px] print:text-[13px]">
              Nomor :{" "}
              <span className="underline decoration-slate-700 decoration-dotted decoration-1">
                {data.nomorSurat || "........"}
              </span>
            </p>
          </div>

          <p className="mt-5 text-left text-[15px] print:text-[12.5px] leading-relaxed print:mt-4 print:leading-normal">
            Yang bertanda tangan di bawah ini menerangkan dengan sesungguhnya
            bahwa:
          </p>

          {/* TABEL UTAMA */}
          <table className="mt-4 w-full text-[15px] leading-relaxed print:mt-3 print:text-[12.5px] print:leading-normal">
            <tbody className="[&>tr>td]:align-top [&>tr>td:nth-child(1)]:w-8 [&>tr>td:nth-child(2)]:w-[220px] [&>tr>td:nth-child(3)]:w-4">
              <tr>
                <td>1.</td>
                <td>Nama</td>
                <td>:</td>
                <td>{data.namaPemohon || "-"}</td>
              </tr>
              <tr>
                <td>2.</td>
                <td>Nomor Induk Kependudukan (NIK)</td>
                <td>:</td>
                <td>{data.nikPemohon || "-"}</td>
              </tr>
              <tr>
                <td>3.</td>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>{data.jenisKelamin || "-"}</td>
              </tr>
              <tr>
                <td>4.</td>
                <td>Tempat dan tanggal lahir</td>
                <td>:</td>
                <td>
                  {combineTempatTanggal(data.tempatLahir, data.tanggalLahir)}
                </td>
              </tr>
              <tr>
                <td>5.</td>
                <td>Kewarganegaraan</td>
                <td>:</td>
                <td>{data.kewarganegaraan || "-"}</td>
              </tr>
              <tr>
                <td>6.</td>
                <td>Agama</td>
                <td>:</td>
                <td>{data.agama || "-"}</td>
              </tr>
              <tr>
                <td>7.</td>
                <td>Pekerjaan</td>
                <td>:</td>
                <td>{data.pekerjaan || "-"}</td>
              </tr>
              <tr>
                <td>8.</td>
                <td>Alamat</td>
                <td>:</td>
                <td>{renderMultiline(alamatLengkap)}</td>
              </tr>

              {/* 9. STATUS PERKAWINAN (judul + isi sejajar label) */}
              <tr>
                <td>9.</td>
                <td>Status Perkawinan</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={3}>
                  <div className="space-y-1">
                    <p>
                      a. Laki-laki : {statusPerkawinanLakiText}
                      {isStatusLakiBeristri && (
                        <span>
                          {" "}
                          / beristri ke :{" "}
                          {data.statusPerkawinanBeristriKe || "-"}
                        </span>
                      )}
                    </p>
                    <p>b. Perempuan : {statusPerkawinanPerempuanText}</p>
                  </div>
                </td>
              </tr>

              {/* 10. NAMA SUAMI/ISTRI TERDAHULU */}
              <tr>
                <td>10.</td>
                <td>Nama istri/suami terdahulu</td>
                <td>:</td>
                <td>{data.namaPasanganTerdahulu || "-"}</td>
              </tr>

              {/* BLOK ORANG TUA – sejajar dengan label, bukan angka */}
              <tr>
                <td></td>
                <td colSpan={3}>
                  <table className="w-full text-[15px] leading-relaxed print:text-[12.5px] print:leading-normal [&>tbody>tr>td]:align-top [&>tbody>tr>td:nth-child(1)]:w-[220px] [&>tbody>tr>td:nth-child(2)]:w-4">
                    <tbody>
                      <tr>
                        <td colSpan={3}>
                          Adalah benar anak dari pernikahan seorang pria:
                        </td>
                      </tr>
                      <tr>
                        <td>Nama lengkap dan alias</td>
                        <td>:</td>
                        <td>{data.ayahNama || "-"}</td>
                      </tr>
                      <tr>
                        <td>Nomor Induk Kependudukan (NIK)</td>
                        <td>:</td>
                        <td>{data.ayahNik || "-"}</td>
                      </tr>
                      <tr>
                        <td>Tempat dan tanggal lahir</td>
                        <td>:</td>
                        <td>
                          {combineTempatTanggal(
                            data.ayahTempatLahir,
                            data.ayahTanggalLahir
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Kewarganegaraan</td>
                        <td>:</td>
                        <td>{data.ayahKewarganegaraan || "-"}</td>
                      </tr>
                      <tr>
                        <td>Agama</td>
                        <td>:</td>
                        <td>{data.ayahAgama || "-"}</td>
                      </tr>
                      <tr>
                        <td>Pekerjaan</td>
                        <td>:</td>
                        <td>{data.ayahPekerjaan || "-"}</td>
                      </tr>
                      <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>{renderMultiline(data.ayahAlamat)}</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className="pt-3">
                          Dengan seorang wanita:
                        </td>
                      </tr>
                      <tr>
                        <td>Nama lengkap dan alias</td>
                        <td>:</td>
                        <td>{data.ibuNama || "-"}</td>
                      </tr>
                      <tr>
                        <td>Nomor Induk Kependudukan (NIK)</td>
                        <td>:</td>
                        <td>{data.ibuNik || "-"}</td>
                      </tr>
                      <tr>
                        <td>Tempat dan tanggal lahir</td>
                        <td>:</td>
                        <td>
                          {combineTempatTanggal(
                            data.ibuTempatLahir,
                            data.ibuTanggalLahir
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Kewarganegaraan</td>
                        <td>:</td>
                        <td>{data.ibuKewarganegaraan || "-"}</td>
                      </tr>
                      <tr>
                        <td>Agama</td>
                        <td>:</td>
                        <td>{data.ibuAgama || "-"}</td>
                      </tr>
                      <tr>
                        <td>Pekerjaan</td>
                        <td>:</td>
                        <td>{data.ibuPekerjaan || "-"}</td>
                      </tr>
                      <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>{renderMultiline(data.ibuAlamat)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6 text-left text-[15px] print:text-[12.5px] leading-relaxed print:mt-4 print:leading-normal">
            Demikian, surat pengantar ini dibuat dengan mengingat sumpah jabatan
            dan untuk dipergunakan sebagaimana mestinya.
          </p>

          <div className="mt-10 flex justify-end text-[15px] leading-relaxed print:mt-6">
            <div className="w-[260px] text-center print:w-[220px]">
              <p>
                {(data.tempatSurat || "Kedungwringin") +
                  ", " +
                  formatDateIndonesian(data.tanggalSurat)}
              </p>
              <p className="mt-1 print:mt-0.5">
                Kepala Desa {data.kantorDesa || data.tempatSurat || "-"}
              </p>
              <div className="mt-10 h-16 print:mt-6 print:h-10" />
              <p className="font-semibold uppercase tracking-wide">
                {data.kepalaDesa || "........................"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print-hidden">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Konfirmasi Cetak Surat
                </h3>
                <p className="text-sm text-slate-600">Nomor surat akan disimpan</p>
              </div>
            </div>

            <div className="mb-6 space-y-2 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">Nomor Surat:</p>
              <p className="text-lg font-bold text-slate-800">{data.nomorSurat}</p>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-slate-700">
              Dengan mencetak surat ini, nomor surat akan dikonfirmasi dan disimpan secara
              permanen. Pastikan semua data sudah benar sebelum melanjutkan.
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isPrinting}
                className="flex-1 rounded-xl border-slate-300 hover:bg-slate-100"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleConfirmPrint}
                disabled={isPrinting}
                className="flex-1 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                {isPrinting ? "Memproses..." : "Cetak"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
