"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { buildFullAddress, formatDateIndonesian, type FormN1Data } from "@/app/surat-nikah/types";

type PreviewN1Props = {
  surat: SuratNikahOption;
  data: FormN1Data;
};

export function PreviewN1({ surat, data }: PreviewN1Props) {
  const router = useRouter();

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
    ],
  );

  const renderMultiline = (value: string) => {
    if (!value || value.trim() === "") {
      return "-";
    }
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
    if (!tempat) {
      return formattedDate;
    }
    if (!tanggal || formattedDate === "-") {
      return tempat;
    }
    return `${tempat}, ${formattedDate}`;
  };

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
            <p className="text-[18px] font-semibold uppercase">Formulir Pengantar Nikah</p>
            <p className="text-[16px] font-semibold uppercase">Model N1</p>
          </div>

          <table className="mt-6 w-full text-[15px] leading-relaxed">
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

          <div className="mt-6 text-center leading-tight">
            <p className="text-[16px] font-semibold uppercase">Surat Pengantar Perkawinan</p>
            <p className="text-[14px]">
              Nomor : <span className="underline decoration-slate-700 decoration-dotted">{data.nomorSurat || "........"}</span>
            </p>
          </div>

          <p className="mt-6 text-justify leading-relaxed">Yang bertanda tangan di bawah ini menerangkan dengan sesungguhnya bahwa:</p>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
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
                <td>{combineTempatTanggal(data.tempatLahir, data.tanggalLahir)}</td>
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
              <tr>
                <td>9.</td>
                <td>Status Perkawinan</td>
                <td>:</td>
                <td>
                  <div className="space-y-1">
                    <p>
                      a. Laki-laki : {data.statusPerkawinanLaki || "-"}
                      {data.statusPerkawinanBeristriKe ? ` / beristri ke : ${data.statusPerkawinanBeristriKe}` : ""}
                    </p>
                    <p>b. Perempuan : {data.statusPerkawinanPerempuan || "-"}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>10.</td>
                <td>Nama istri/suami terdahulu</td>
                <td>:</td>
                <td>{data.namaPasanganTerdahulu || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
            <div>
              <p>Adalah benar anak dari pernikahan seorang pria:</p>
              <table className="mt-2 w-full leading-relaxed">
                <tbody className="[&>tr>td]:align-top [&>tr>td:nth-child(1)]:w-[220px] [&>tr>td:nth-child(2)]:w-4">
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
                    <td>{combineTempatTanggal(data.ayahTempatLahir, data.ayahTanggalLahir)}</td>
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
                </tbody>
              </table>
            </div>

            <div>
              <p>Dengan seorang wanita:</p>
              <table className="mt-2 w-full leading-relaxed">
                <tbody className="[&>tr>td]:align-top [&>tr>td:nth-child(1)]:w-[220px] [&>tr>td:nth-child(2)]:w-4">
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
                    <td>{combineTempatTanggal(data.ibuTempatLahir, data.ibuTanggalLahir)}</td>
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
            </div>
          </div>

          <p className="mt-6 text-justify leading-relaxed">
            Demikian, surat pengantar ini dibuat dengan mengingat sumpah jabatan dan untuk dipergunakan sebagaimana mestinya.
          </p>

          <div className="mt-10 flex justify-end text-[15px] leading-relaxed">
            <div className="w-[260px] text-center">
              <p>{(data.tempatSurat || "Kedungwringin") + ", " + formatDateIndonesian(data.tanggalSurat)}</p>
              <p className="mt-1">Kepala Desa {data.kantorDesa || data.tempatSurat || "-"}</p>
              <div className="mt-10 h-16" />
              <p className="font-semibold uppercase tracking-wide">{data.kepalaDesa || "........................"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
