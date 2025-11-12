"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { formatDateIndonesian, type FormN6Data } from "@/app/surat-nikah/types";

type PreviewN6Props = {
  surat: SuratNikahOption;
  data: FormN6Data;
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

const combineTempatTanggal = (tempat: string, tanggal: string) => {
  const formattedDate = formatDateIndonesian(tanggal);
  if (!tempat && (!tanggal || formattedDate === "-")) return "-";
  if (!tempat) return formattedDate;
  if (!tanggal || formattedDate === "-") return tempat;
  return `${tempat}, ${formattedDate}`;
};

export function PreviewN6({ surat, data }: PreviewN6Props) {
  const router = useRouter();

  const tanggalSurat = useMemo(
    () => formatDateIndonesian(data.tanggalSurat),
    [data.tanggalSurat]
  );
  const tanggalMeninggal = useMemo(
    () => formatDateIndonesian(data.tanggalMeninggal),
    [data.tanggalMeninggal]
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
            Preview -{" "}
            {surat.code ? `${surat.code} ${surat.title}` : surat.title}
          </p>
          <p className="text-xs uppercase tracking-wide">
            Periksa kembali sebelum mencetak
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper print:border-0">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet print:border-0">
          <div className="text-left text-[10px] uppercase leading-snug tracking-wide text-slate-700">
            <p>Keputusan Direktur Jenderal Bimbingan Masyarakat Islam</p>
            <p>Nomor 713 Tahun 2018</p>
            <p>
              Tentang Penetapan Formulir dan Laporan Pencatatan Perkawinan atau
              Rujuk
            </p>
          </div>

          <div className="mt-5 leading-tight">
            <p className="text-center text-[18px]  uppercase">
              Formulir Surat Keterangan Kematian Suami / Istri
            </p>
            <div className="mt-1 flex justify-end">
              <p className="text-[16px]  uppercase">Model N6</p>
            </div>
          </div>

          <table className="mt-6 w-full text-[15px] leading-relaxed">
            <tbody>
              <tr>
                <td className="w-[240px] uppercase">Kantor Desa/Kelurahan</td>
                <td className="w-6 text-center">:</td>
                <td className="uppercase">{data.kantorDesa || "-"}</td>
              </tr>
              <tr>
                <td className="uppercase">Kecamatan</td>
                <td className="text-center">:</td>
                <td className="uppercase">{data.kecamatan || "-"}</td>
              </tr>
              <tr>
                <td className="uppercase">Kabupaten</td>
                <td className="text-center">:</td>
                <td className="uppercase">{data.kabupaten || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 text-center leading-tight">
            <p className="text-[16px] uppercase underline decoration-slate-700 decoration-1 print:text-[14px]">
              Surat Keterangan Kematian
            </p>
            <p className="text-[14px] mt-2">
              Nomor :{" "}
              <span className="underline decoration-slate-700 decoration-dotted">
                {data.nomorSurat || "........"}
              </span>
            </p>
          </div>

          <p className="mt-2 text-[15px] leading-relaxed">
            Yang bertanda tangan di bawah ini menerangkan dengan sesungguhnya
            bahwa:
          </p>

          <div className="mt-4 space-y-5">
            <table className="w-full text-[15px] leading-relaxed">
              <tbody>
                <tr>
                  <td className="w-6 align-top text-[15px] ">A.</td>
                  <td className="align-top">
                    <table className="w-full text-[15px] leading-relaxed">
                      <tbody>
                        <tr>
                          <td className="w-[230px] align-top">
                            1. Nama lengkap dan alias
                          </td>
                          <td className="w-4 align-top">:</td>
                          <td className="align-top">
                            {data.almarhumNama || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">2. Bin/Binti</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.almarhumBin || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            3. Nomor Induk Kependudukan
                          </td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.almarhumNik || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            4. Tempat dan tanggal lahir
                          </td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {combineTempatTanggal(
                              data.almarhumTempatLahir,
                              data.almarhumTanggalLahir
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">5. Kewarganegaraan</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.almarhumKewarganegaraan || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">6. Agama</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.almarhumAgama || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">7. Pekerjaan</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.almarhumPekerjaan || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">8. Alamat</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {renderMultiline(data.almarhumAlamat)}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            Telah meninggal dunia pada tanggal
                          </td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {tanggalMeninggal !== "-"
                              ? tanggalMeninggal
                              : "........................"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">Di</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.tempatMeninggal ||
                              ".........................................................."}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-4 text-[15px] leading-relaxed">
              Yang bersangkutan adalah suami/istri dari :
            </p>

            <table className="w-full text-[15px] leading-relaxed mt-2">
              <tbody>
                <tr>
                  <td className="w-6 align-top text-[15px]">B.</td>
                  <td className="align-top">
                    <table className="w-full text-[15px] leading-relaxed">
                      <tbody>
                        <tr>
                          <td className="w-[230px] align-top">
                            1. Nama lengkap dan alias
                          </td>
                          <td className="w-4 align-top">:</td>
                          <td className="align-top">
                            {data.pasanganNama || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">2. Bin/Binti</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.pasanganBin || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            3. Nomor Induk Kependudukan
                          </td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.pasanganNik || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            4. Tempat dan tanggal lahir
                          </td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {combineTempatTanggal(
                              data.pasanganTempatLahir,
                              data.pasanganTanggalLahir
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">5. Kewarganegaraan</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.pasanganKewarganegaraan || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">6. Agama</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.pasanganAgama || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">7. Pekerjaan</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {data.pasanganPekerjaan || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">8. Tempat tinggal</td>
                          <td className="align-top">:</td>
                          <td className="align-top">
                            {renderMultiline(data.pasanganAlamat)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[15px] text-justify leading-relaxed">
            Demikian surat keterangan ini dibuat dengan mengingat sumpah jabatan
            dan untuk digunakan seperlunya.
          </p>

          <div className="mt-5 flex justify-end text-[15px] leading-relaxed print:text-[11.5px]">
            <div className="w-[260px] text-center">
              <p>
                {(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}
              </p>
              <p className="mt-1">
                Kepala Desa {data.kantorDesa || data.tempatSurat || "-"}
              </p>
              <div className="mt-8 h-14" />
              <p className="font-semibold uppercase tracking-wide">
                {data.kepalaDesa || "........................"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
