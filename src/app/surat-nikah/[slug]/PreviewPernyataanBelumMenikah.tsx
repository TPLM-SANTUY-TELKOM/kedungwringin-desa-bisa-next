"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import {
  formatDateIndonesian,
  type PernyataanBelumMenikahData,
} from "@/app/surat-nikah/types";

type PreviewPernyataanBelumMenikahProps = {
  surat: SuratNikahOption;
  data: PernyataanBelumMenikahData;
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

const getPernyataanText = (
  jenisKelamin: PernyataanBelumMenikahData["jenisKelamin"]
) => {
  const pasangan = jenisKelamin === "Perempuan" ? "laki-laki" : "perempuan";
  return `Dengan ini menyatakan yang sesungguhnya dan sebenarnya, bahwa saya sampai saat ini belum pernah menikah dengan seorang ${pasangan}, baik secara resmi maupun di bawah tangan (masih lajang).`;
};

export function PreviewPernyataanBelumMenikah({
  surat,
  data,
}: PreviewPernyataanBelumMenikahProps) {
  const router = useRouter();
  const tanggalSurat = useMemo(
    () => formatDateIndonesian(data.tanggalSurat),
    [data.tanggalSurat]
  );
  const tanggalLahir = useMemo(
    () => formatDateIndonesian(data.tanggalLahir),
    [data.tanggalLahir]
  );

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full border-slate-300 px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            onClick={() => window.print()}
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
        <div className="mx-auto max-w-[680px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet print:border-0">
          <div className="text-center leading-tight">
            <p className="text-[18px] font-semibold uppercase underline decoration-2 underline-offset-8">
              Surat Pernyataan Belum Menikah
            </p>
          </div>

          <p className="mt-6 text-[15px] leading-relaxed">
            Yang bertanda tangan di bawah ini:
          </p>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
            <tbody>
              <tr>
                <td className="w-[220px] align-top">Nama Lengkap</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">{data.nama || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Tempat/tanggal lahir</td>
                <td className="align-top">:</td>
                <td className="align-top">
                  {(data.tempatLahir || "-") + ", " + tanggalLahir}
                </td>
              </tr>
              <tr>
                <td className="align-top">Pekerjaan</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.pekerjaan || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">NIK</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.nik || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Agama</td>
                <td className="align-top">:</td>
                <td className="align-top">{data.agama || "-"}</td>
              </tr>
              <tr>
                <td className="align-top">Alamat</td>
                <td className="align-top">:</td>
                <td className="align-top">{renderMultiline(data.alamat)}</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6 text-justify text-[15px] leading-relaxed">
            {getPernyataanText(data.jenisKelamin)} Surat pernyataan ini saya
            buat untuk melengkapi persyaratan menikah.
          </p>
          <p className="mt-3 text-justify text-[15px] leading-relaxed">
            Demikian surat pernyataan ini saya buat, ditandatangani dalam
            keadaan sehat jasmani dan rohani, tanpa ada paksaan dan bujukan dari
            siapapun. Apabila surat pernyataan ini tidak benar, maka saya
            bersedia bertanggung jawab di hadapan hukum yang berlaku.
          </p>

          <div className="mt-10 flex flex-col gap-10 text-[15px] leading-relaxed sm:flex-row sm:gap-6">
            <div className="flex-1">
              <p>Mengetahui</p>
              <p>Kepala Desa Kedungwringin</p>
              <div className="mt-16">
                <p className="uppercase tracking-wide">
                  {data.kepalaDesa || "........................"}
                </p>
              </div>
            </div>
            <div className="flex-1 text-left">
              <p>
                {(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}
              </p>
              <p className="mt-1">Yang menyatakan,</p>
              <div className="mt-16">
                <p className="uppercase tracking-wide">
                  {data.nama || "........................"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
