"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { formatDateIndonesian, type FormN2Data } from "@/app/surat-nikah/types";

type PreviewN2Props = {
  surat: SuratNikahOption;
  data: FormN2Data;
};

export function PreviewN2({ surat, data }: PreviewN2Props) {
  const router = useRouter();

  const tanggalAkad = useMemo(
    () => formatDateIndonesian(data.tanggalAkad),
    [data.tanggalAkad]
  );
  const tanggalSurat = useMemo(
    () => formatDateIndonesian(data.tanggalSurat),
    [data.tanggalSurat]
  );
  const tanggalDiterima = useMemo(
    () => formatDateIndonesian(data.diterimaTanggal),
    [data.diterimaTanggal]
  );

  const lampiranList = useMemo(
    () =>
      [
        data.lampiran1,
        data.lampiran2,
        data.lampiran3,
        data.lampiran4,
        data.lampiran5,
        data.lampiran6,
        data.lampiran7,
        data.lampiran8,
      ].filter((item) => item.trim().length > 0),
    [
      data.lampiran1,
      data.lampiran2,
      data.lampiran3,
      data.lampiran4,
      data.lampiran5,
      data.lampiran6,
      data.lampiran7,
      data.lampiran8,
    ]
  );

  const tujuanTempat = data.tujuanTempat?.trim() || "";

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

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper print:p-0">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet print:px-8 print:py-6 print:text-[12.5px] print:leading-snug">
          <div className="text-left text-[10px] uppercase leading-snug tracking-wide text-slate-700 print:text-[9px]">
            <p>Keputusan Direktur Jenderal Bimbingan Masyarakat Islam</p>
            <p>Nomor 713 Tahun 2018</p>
            <p>
              Tentang Penetapan Formulir dan Laporan Pencatatan Perkawinan atau
              Rujuk
            </p>
          </div>

          <div className="mt-6 leading-tight print:mt-4">
            <p className="text-center text-[16px] uppercase tracking-[0.08em] print:text-[18px]">
              Formulir Permohonan Kehendak Perkawinan
            </p>
            <div className="mt-2 flex justify-end">
              <p className="text-[16px]  uppercase tracking-wide print:text-[14px]">
                Model N2
              </p>
            </div>
          </div>

          <div className="mt-8 text-[15px] leading-relaxed">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p>Perihal : {data.perihal || "-"}</p>
              </div>
              <div className="text-right">
                <p>
                  {(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <p>Kepada Yth.</p>
              <p>{data.tujuanInstansi || "-"}</p>
              <p>{tujuanTempat ? `di ${tujuanTempat}` : "di Tempat"}</p>
            </div>

            <p className="mt-6 text-justify leading-relaxed">
              Dengan hormat, kami mengajukan permohonan kehendak perkawinan
              untuk atas nama: Calon suami{" "}
              <span className="font-semibold">
                {data.calonSuamiNama || "................................"}
              </span>{" "}
              dengan Calon istri{" "}
              <span className="font-semibold">
                {data.calonIstriNama || "................................"}
              </span>{" "}
              pada hari <span className="">{data.hariAkad || "........"}</span>{" "}
              tanggal <span className="">{tanggalAkad}</span> jam{" "}
              {data.waktuAkad || "........"} bertempat di{" "}
              {data.tempatAkad ||
                "........................................................"}
              .
            </p>

            <p className="mt-4 leading-relaxed">
              Bersama ini kami sampaikan surat-surat yang diperlukan untuk
              diperiksa sebagai berikut:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              {lampiranList.length > 0 ? (
                lampiranList.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))
              ) : (
                <>
                  <li>
                    ..........................................................
                  </li>
                  <li>
                    ..........................................................
                  </li>
                </>
              )}
            </ol>

            <p className="mt-4 text-justify leading-relaxed">
              Demikian permohonan ini kami sampaikan, kiranya dapat diperiksa,
              dihadiri, dan dicatat sesuai dengan ketentuan peraturan
              perundang-undangan.
            </p>

            <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
              <div className="flex w-full flex-col gap-4 text-left sm:w-1/2">
                <div className="space-y-2">
                  <p className="">
                    Diterima tanggal:{" "}
                    {tanggalDiterima !== "-"
                      ? tanggalDiterima
                      : "........................"}
                  </p>
                  <p>
                    {data.pejabatJabatan ||
                      "Kepala KUA/Penghulu/PPN Luar Negeri"}
                  </p>
                </div>
                <div className="mt-20 text-left">
                  <p className=" uppercase tracking-wide">
                    {data.pejabatPenerima || "........................"}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-2 text-center sm:w-1/2">
                <div className="space-y-1">
                  <p>Wassalam,</p>
                  <p>Pemohon</p>
                </div>
                <div className="mt-20 text-center">
                  <p className=" uppercase tracking-wide">
                    {data.pemohonNama || "........................"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
