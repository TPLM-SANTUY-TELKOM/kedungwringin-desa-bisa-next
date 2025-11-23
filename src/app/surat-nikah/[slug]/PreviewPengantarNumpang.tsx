"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Printer, AlertCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import {
  formatDateIndonesian,
  type PengantarNumpangNikahData,
} from "@/app/surat-nikah/types";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import { useBackNavigation } from "@/hooks/useBackNavigation";

type PreviewPengantarNumpangProps = {
  surat: SuratNikahOption;
  data: PengantarNumpangNikahData;
  reservedNumberId?: string;
};

const renderMultiline = (value: string) => {
  if (!value || value.trim() === "") return "-";
  const lines = value.split("\n");
  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
};

const buildAlamatLengkap = (data: PengantarNumpangNikahData) => {
  const mainLine = [
    data.alamat,
    data.rt ? `RT ${data.rt}` : "",
    data.rw ? `RW ${data.rw}` : "",
  ]
    .filter((value) => value && value.trim().length > 0)
    .join(" ");
  const secondLine = [
    data.kecamatan ? `Kecamatan ${data.kecamatan}` : "",
    data.kabupaten ? `Kabupaten ${data.kabupaten}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return [mainLine || "-", secondLine]
    .filter((value) => value && value.trim().length > 0)
    .join("\n");
};

export function PreviewPengantarNumpang({
  surat,
  data,
  reservedNumberId,
}: PreviewPengantarNumpangProps) {
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

  const tanggalSurat = useMemo(
    () => formatDateIndonesian(data.tanggalSurat),
    [data.tanggalSurat]
  );
  const tanggalLahir = useMemo(
    () => formatDateIndonesian(data.tanggalLahir),
    [data.tanggalLahir]
  );
  const berlakuSampai = useMemo(
    () => formatDateIndonesian(data.berlakuSampai),
    [data.berlakuSampai]
  );

  const alamatLengkap = useMemo(() => buildAlamatLengkap(data), [data]);

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
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
            Preview - {surat.title}
          </p>
          <p className="text-xs uppercase tracking-wide">
            Periksa kembali sebelum mencetak
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper print:border-0">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet print:border-0">
          <div className="text-center leading-tight">
            <div className="flex items-center justify-center gap-4">
              <div className="relative h-20 w-20">
                <Image
                  src={logoDesa}
                  alt="Logo Banyumas"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-[18px] font-semibold uppercase">
                  Pemerintah Kabupaten Banyumas
                </p>
                <p className="text-[17px] font-semibold uppercase">
                  Kecamatan Patikraja
                </p>
                <p className="text-[17px] font-semibold uppercase">
                  Kepala Desa Kedungwringin
                </p>
                <p className="text-[13px] font-medium capitalize tracking-wide">
                  Jl Raya Kedungwringin No. 01 Telp. 0281 6438935 Kode Pos 53171
                </p>
              </div>
            </div>
            <div className="mt-4 border-b-[3px] border-black" />
            <div className="border-b-[1px] border-black" />
          </div>

          <div className="mt-6 text-center leading-tight">
            <p className="text-[16px] uppercase font-semibold underline decoration-slate-700 decoration-1 print:text-[14px]">
              Pengantar Numpang Nikah
            </p>
            <p className="text-[15px]">
              No :{" "}
              <span className="underline decoration-slate-700 decoration-dotted">
                {data.nomorSurat || "........"}
              </span>
            </p>
          </div>

          <p className="mt-6 text-[15px] text-justify leading-relaxed">
            Yang bertanda tangan di bawah ini kami Kepala Desa Kedungwringin
            Kecamatan Patikraja Kabupaten Banyumas Jawa Tengah, menerangkan
            bahwa:
          </p>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
            <tbody>
              <tr>
                <td className="w-[260px] align-top">Nama</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">{data.nama || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Jenis Kelamin</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.jenisKelamin || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Tempat/tanggal lahir</td>
                <td className="align-top">:</td>
                <td className="align-top">
                  {(data.tempatLahir || "-") + ", " + tanggalLahir}
                </td>
              </tr>
              <tr>
                <td className="align-top">Kewarganegaraan</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.kewarganegaraan || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Agama</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.agama || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Pekerjaan</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.pekerjaan || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Tempat Tinggal</td>
                <td className="align-top">:</td>
                <td className="align-top">{renderMultiline(alamatLengkap)}</td>
              </tr>
              <tr>
                <td className="align-top">Surat Bukti diri</td>
                <td className="align-top">:</td>
                <td className="align-top">
                  NIK: {data.nik || "-"}
                  <br />
                  NKK: {data.nkk || "-"}
                </td>
              </tr>
              <tr>
                <td className="align-top">Keperluan</td>
                <td className="align-top">:</td>
                <td className="align-top">{renderMultiline(data.keperluan)}</td>
              </tr>
              <tr>
                <td className="align-top">Berlaku</td>
                <td className="align-top">:</td>
                <td className="align-top">
                  {berlakuSampai !== "-"
                    ? `${berlakuSampai} / seperlunya`
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="align-top">Keterangan lain</td>
                <td className="align-top">:</td>
                <td className="align-top">
                  {data.keteranganLain
                    ? renderMultiline(data.keteranganLain)
                    : `Orang tersebut di atas akan melaksanakan pernikahan dengan ${
                        data.namaPasangan || "................................"
                      }`}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6 text-[15px] text-justify leading-relaxed">
            Demikian surat keterangan ini dibuat untuk digunakan sebagaimana
            mestinya.
          </p>

          <div className="mt-10 flex items-end justify-between gap-8 text-[15px] leading-relaxed">
            <div className="flex-1 text-center">
              <p>Pemohon</p>
              <div className="mt-16">
                <p className="font-semibold uppercase tracking-wide">
                  {data.nama || "........................"}
                </p>
              </div>
            </div>
            <div className="flex-1 text-center">
              <p>
                {(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}
              </p>
              <p className="mt-1">
                Kepala Desa {data.tempatSurat || "Kedungwringin"}
              </p>
              <div className="mt-16">
                <p className="font-semibold uppercase tracking-wide">
                  {data.kepalaDesa || "........................"}
                </p>
              </div>
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
