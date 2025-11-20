"use client";

import { useMemo, type ReactNode } from "react";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { formatDateIndonesian, type FormN4Data } from "@/app/surat-nikah/types";
import { useBackNavigation } from "@/hooks/useBackNavigation";

type PreviewN4Props = {
  surat: SuratNikahOption;
  data: FormN4Data;
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
  if (!tempat && (!tanggal || formattedDate === "-")) {
    return "-";
  }
  if (!tempat) return formattedDate;
  if (!tanggal || formattedDate === "-") return tempat;
  return `${tempat}, ${formattedDate}`;
};

const IdentityTableRow = ({ label, value }: { label: string; value: string | ReactNode }) => (
  <tr>
    <td className="w-[240px] align-top">{label}</td>
    <td className="w-4 align-top">:</td>
    <td className="align-top">{value}</td>
  </tr>
);

export function PreviewN4({ surat, data }: PreviewN4Props) {
  const handleBack = useBackNavigation("/surat-nikah");

  const tanggalSurat = useMemo(
    () => formatDateIndonesian(data.tanggalSurat),
    [data.tanggalSurat]
  );

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleBack} className="rounded-full border-slate-300 px-6">
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

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper print:border-0 print:p-5">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-11 py-9 font-['Times_New_Roman',serif] text-[14px] text-slate-900 leading-relaxed print-sheet print:border-0 print:px-7 print:py-6 print:text-[11px] print:leading-snug">
          <div className="text-left text-[10px] uppercase leading-snug tracking-wide text-slate-700">
            <p>Keputusan Direktur Jenderal Bimbingan Masyarakat Islam</p>
            <p>Nomor 713 Tahun 2018</p>
            <p>
              Tentang Penetapan Formulir dan Laporan Pencatatan Perkawinan atau
              Rujuk
            </p>
          </div>

          <div className="relative mt-5 text-center leading-tight print:mt-3">
            <p className="text-[17px]  uppercase tracking-[0.08em] print:text-[14px]">
              Formulir Surat Izin Orang Tua
            </p>
            <p className="text-[16px] uppercase underline decoration-slate-700 decoration-1 print:text-[14px]">
              Surat Izin Orang Tua
            </p>
            <p className="absolute right-0 top-1/2 -translate-y-1/2 text-[15px] font-semibold uppercase print:text-[13px]">
              Model N5
            </p>
          </div>

          <p className="mt-2 text-[14px] leading-relaxed print:mt-2">
            Yang bertanda tangan di bawah ini:
          </p>

          <div className="mt-2 space-y-6 print:mt-2 print:space-y-4">
            <table className="w-full text-[14px] leading-relaxed print:text-[11px]">
              <tbody>
                <tr>
                  <td className="w-6 align-top text-lg text-[14px]">A.</td>
                  <td className="align-top">
                    <table className="w-full text-[14px] leading-relaxed print:text-[11px]">
                      <tbody>
                        <IdentityTableRow
                          label="1. Nama lengkap dan alias"
                          value={data.ayahNama || "-"}
                        />
                        <IdentityTableRow
                          label="2. Bin"
                          value={data.ayahBin || "-"}
                        />
                        <IdentityTableRow
                          label="3. Nomor Induk Kependudukan"
                          value={data.ayahNik || "-"}
                        />
                        <IdentityTableRow
                          label="4. Tempat dan tanggal lahir"
                          value={combineTempatTanggal(
                            data.ayahTempatLahir,
                            data.ayahTanggalLahir
                          )}
                        />
                        <IdentityTableRow
                          label="5. Kewarganegaraan"
                          value={data.ayahKewarganegaraan || "-"}
                        />
                        <IdentityTableRow
                          label="6. Agama"
                          value={data.ayahAgama || "-"}
                        />
                        <IdentityTableRow
                          label="7. Pekerjaan"
                          value={data.ayahPekerjaan || "-"}
                        />
                        <IdentityTableRow
                          label="8. Alamat"
                          value={renderMultiline(data.ayahAlamat)}
                        />
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full text-[14px] leading-relaxed print:text-[11px]">
              <tbody>
                <tr>
                  <td className="w-6 align-top text-lg text-[14px]">B.</td>
                  <td className="align-top">
                    <table className="w-full text-[14px] leading-relaxed print:text-[11px]">
                      <tbody>
                        <IdentityTableRow
                          label="1. Nama lengkap dan alias"
                          value={data.ibuNama || "-"}
                        />
                        <IdentityTableRow
                          label="2. Binti"
                          value={data.ibuBinti || "-"}
                        />
                        <IdentityTableRow
                          label="3. Nomor Induk Kependudukan"
                          value={data.ibuNik || "-"}
                        />
                        <IdentityTableRow
                          label="4. Tempat dan tanggal lahir"
                          value={combineTempatTanggal(
                            data.ibuTempatLahir,
                            data.ibuTanggalLahir
                          )}
                        />
                        <IdentityTableRow
                          label="5. Kewarganegaraan"
                          value={data.ibuKewarganegaraan || "-"}
                        />
                        <IdentityTableRow
                          label="6. Agama"
                          value={data.ibuAgama || "-"}
                        />
                        <IdentityTableRow
                          label="7. Pekerjaan"
                          value={data.ibuPekerjaan || "-"}
                        />
                        <IdentityTableRow
                          label="8. Alamat"
                          value={renderMultiline(data.ibuAlamat)}
                        />
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-[14px] leading-relaxed print:mt-4">
            Adalah ayah dan ibu kandung dari:
          </p>

          <div className="mt-3 print:mt-2">
            <table className="w-full text-[15px] leading-relaxed print:text-[12px]">
              <tbody>
                <IdentityTableRow
                  label="1. Nama lengkap dan alias"
                  value={data.anakNama || "-"}
                />
                <IdentityTableRow
                  label="2. Bin/Binti"
                  value={data.anakBinti || "-"}
                />
                <IdentityTableRow
                  label="3. Nomor Induk Kependudukan"
                  value={data.anakNik || "-"}
                />
                <IdentityTableRow
                  label="4. Tempat dan tanggal lahir"
                  value={combineTempatTanggal(
                    data.anakTempatLahir,
                    data.anakTanggalLahir
                  )}
                />
                <IdentityTableRow
                  label="5. Kewarganegaraan"
                  value={data.anakKewarganegaraan || "-"}
                />
                <IdentityTableRow
                  label="6. Agama"
                  value={data.anakAgama || "-"}
                />
                <IdentityTableRow
                  label="7. Pekerjaan"
                  value={data.anakPekerjaan || "-"}
                />
                <IdentityTableRow
                  label="8. Alamat"
                  value={renderMultiline(data.anakAlamat)}
                />
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[14px] leading-relaxed print:mt-4">
            Memberikan izin kepada anak kami untuk melakukan pernikahan dengan:
          </p>

          <div className="mt-3 print:mt-2">
            <table className="w-full text-[15px] leading-relaxed print:text-[12px]">
              <tbody>
                <IdentityTableRow
                  label="1. Nama lengkap dan alias"
                  value={data.calonPasanganNama || "-"}
                />
                <IdentityTableRow
                  label="2. Bin/Binti"
                  value={data.calonPasanganBin || "-"}
                />
                <IdentityTableRow
                  label="3. Nomor Induk Kependudukan"
                  value={data.calonPasanganNik || "-"}
                />
                <IdentityTableRow
                  label="4. Tempat dan tanggal lahir"
                  value={combineTempatTanggal(
                    data.calonPasanganTempatLahir,
                    data.calonPasanganTanggalLahir
                  )}
                />
                <IdentityTableRow
                  label="5. Kewarganegaraan"
                  value={data.calonPasanganKewarganegaraan || "-"}
                />
                <IdentityTableRow
                  label="6. Agama"
                  value={data.calonPasanganAgama || "-"}
                />
                <IdentityTableRow
                  label="7. Pekerjaan"
                  value={data.calonPasanganPekerjaan || "-"}
                />
                <IdentityTableRow
                  label="8. Alamat"
                  value={renderMultiline(data.calonPasanganAlamat)}
                />
              </tbody>
            </table>
          </div>

          <p className="mt-7 text-justify leading-relaxed print:mt-2 print:text-[14px]">
            Demikian surat izin ini dibuat dengan kesadaran tanpa ada paksaan
            dari siapapun dan untuk digunakan seperlunya.
          </p>

          <div className="mt-4 grid gap-12 text-[15px] leading-relaxed sm:grid-cols-2 print:mt-5 print:gap-10 print:text-[12px]">
            <div className="text-center">
              <p className="mb-2">&nbsp;</p>
              <p>Ayah/Wali/Pengampu</p>
              <div className="mt-20 print:mt-18">
                <p className="font-semibold uppercase tracking-wide">
                  {data.ayahNama || "........................"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="mb-2 text-right sm:text-right">
                {(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}
              </p>
              <p>Ibu/Wali/Pengampu</p>
              <div className="mt-20 print:mt-18">
                <p className="font-semibold uppercase tracking-wide">
                  {data.ibuNama || "........................"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
