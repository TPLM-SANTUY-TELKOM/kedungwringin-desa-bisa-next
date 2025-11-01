"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { formatDateIndonesian, type FormN3Data } from "@/app/surat-nikah/types";

type PreviewN3Props = {
  surat: SuratNikahOption;
  data: FormN3Data;
};

const renderMultiline = (value: string) => {
  if (!value || value.trim() === "") return "-";
  return value.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < value.split("\n").length - 1 && <br />}
    </span>
  ));
};

const combineTempatTanggal = (tempat: string, tanggal: string) => {
  const formattedDate = formatDateIndonesian(tanggal);
  if (!tempat && (!tanggal || formattedDate === "-")) {
    return "-";
  }
  if (!tempat) {
    return formattedDate;
  }
  if (!tanggal || formattedDate === "-") {
    return tempat;
  }
  return `${tempat}, ${formattedDate}`;
};

export function PreviewN3({ surat, data }: PreviewN3Props) {
  const router = useRouter();

  const tanggalSurat = useMemo(() => formatDateIndonesian(data.tanggalSurat), [data.tanggalSurat]);

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()} className="rounded-full border-slate-300 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button onClick={() => window.print()} className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Preview - {surat.code ? `${surat.code} ${surat.title}` : surat.title}</p>
          <p className="text-xs uppercase tracking-wide">Periksa kembali sebelum mencetak</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet">
          <div className="text-center text-[12px] uppercase leading-snug tracking-wide text-slate-700">
            <p>Keputusan Direktur Jenderal Bimbingan Masyarakat Islam</p>
            <p>Nomor 713 Tahun 2018</p>
            <p>Tentang Penetapan Formulir dan Laporan Pencatatan Perkawinan atau Rujuk</p>
          </div>

          <div className="mt-5 text-center leading-tight">
            <p className="text-[18px] font-semibold uppercase">Formulir Surat Persetujuan Mempelai</p>
            <p className="text-[16px] font-semibold uppercase">Model N3</p>
            <p className="mt-3 text-[15px] uppercase">Surat Persetujuan Mempelai</p>
          </div>

          <p className="mt-6 text-start leading-relaxed">Yang bertanda tangan di bawah ini:</p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="font-semibold uppercase tracking-wide">A. Calon Suami</p>
              <table className="mt-2 w-full text-[15px] leading-relaxed">
                <tbody className="[&>tr>td]:align-top [&>tr>td:nth-child(1)]:w-[230px] [&>tr>td:nth-child(2)]:w-4">
                  <tr>
                    <td>1. Nama lengkap dan alias</td>
                    <td>:</td>
                    <td>{data.calonSuamiNama || "-"}</td>
                  </tr>
                  <tr>
                    <td>2. Bin</td>
                    <td>:</td>
                    <td>{data.calonSuamiBin || "-"}</td>
                  </tr>
                  <tr>
                    <td>3. Nomor Induk Kependudukan</td>
                    <td>:</td>
                    <td>{data.calonSuamiNik || "-"}</td>
                  </tr>
                  <tr>
                    <td>4. Tempat dan tanggal lahir</td>
                    <td>:</td>
                    <td>{combineTempatTanggal(data.calonSuamiTempatLahir, data.calonSuamiTanggalLahir)}</td>
                  </tr>
                  <tr>
                    <td>5. Kewarganegaraan</td>
                    <td>:</td>
                    <td>{data.calonSuamiKewarganegaraan || "-"}</td>
                  </tr>
                  <tr>
                    <td>6. Agama</td>
                    <td>:</td>
                    <td>{data.calonSuamiAgama || "-"}</td>
                  </tr>
                  <tr>
                    <td>7. Pekerjaan</td>
                    <td>:</td>
                    <td>{data.calonSuamiPekerjaan || "-"}</td>
                  </tr>
                  <tr>
                    <td>8. Alamat</td>
                    <td>:</td>
                    <td>{renderMultiline(data.calonSuamiAlamat)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wide">B. Calon Istri</p>
              <table className="mt-2 w-full text-[15px] leading-relaxed">
                <tbody className="[&>tr>td]:align-top [&>tr>td:nth-child(1)]:w-[230px] [&>tr>td:nth-child(2)]:w-4">
                  <tr>
                    <td>1. Nama lengkap dan alias</td>
                    <td>:</td>
                    <td>{data.calonIstriNama || "-"}</td>
                  </tr>
                  <tr>
                    <td>2. Binti</td>
                    <td>:</td>
                    <td>{data.calonIstriBinti || "-"}</td>
                  </tr>
                  <tr>
                    <td>3. Nomor Induk Kependudukan</td>
                    <td>:</td>
                    <td>{data.calonIstriNik || "-"}</td>
                  </tr>
                  <tr>
                    <td>4. Tempat dan tanggal lahir</td>
                    <td>:</td>
                    <td>{combineTempatTanggal(data.calonIstriTempatLahir, data.calonIstriTanggalLahir)}</td>
                  </tr>
                  <tr>
                    <td>5. Kewarganegaraan</td>
                    <td>:</td>
                    <td>{data.calonIstriKewarganegaraan || "-"}</td>
                  </tr>
                  <tr>
                    <td>6. Agama</td>
                    <td>:</td>
                    <td>{data.calonIstriAgama || "-"}</td>
                  </tr>
                  <tr>
                    <td>7. Pekerjaan</td>
                    <td>:</td>
                    <td>{data.calonIstriPekerjaan || "-"}</td>
                  </tr>
                  <tr>
                    <td>8. Alamat</td>
                    <td>:</td>
                    <td>{renderMultiline(data.calonIstriAlamat)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-justify leading-relaxed">
            Menyatakan dengan sesungguhnya bahwa atas dasar suka rela, dengan kesadaran sendiri, tanpa ada paksaan siapapun juga, setuju untuk melangsungkan perkawinan.
          </p>

          <p className="mt-4 text-justify leading-relaxed">Demikian surat persetujuan ini dibuat untuk digunakan seperlunya.</p>

          <div className="mt-10 grid gap-8 text-[15px] leading-relaxed sm:grid-cols-2">
            <div className="text-center">
              <p>{(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-8 text-[15px] leading-relaxed sm:grid-cols-2">
            <div className="text-center">
              <p>Calon Suami</p>
              <div className="mt-16">
                <p className="font-semibold uppercase tracking-wide">{data.calonSuamiNama || "........................"}</p>
              </div>
            </div>
            <div className="text-center">
              <p>Calon Istri</p>
              <div className="mt-16">
                <p className="font-semibold uppercase tracking-wide">{data.calonIstriNama || "........................"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
