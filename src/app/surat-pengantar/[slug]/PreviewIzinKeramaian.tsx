"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratPengantarOption } from "@/data/surat-pengantar-options";
import { formatDateIndonesian, type SuratPengantarIzinKeramaianData } from "@/app/surat-pengantar/types";

import { SuratPengantarHeader } from "./SuratPengantarHeader";

type PreviewIzinKeramaianProps = {
  surat: SuratPengantarOption;
  data: SuratPengantarIzinKeramaianData;
};

export function PreviewIzinKeramaian({ surat, data }: PreviewIzinKeramaianProps) {
  const router = useRouter();

  const alamatLengkap = [
    data.alamat.trim(),
    data.rt ? `RT.${data.rt.padStart(3, "0")}` : "",
    data.rw ? `RW.${data.rw.padStart(3, "0")}` : "",
  ]
    .filter(Boolean)
    .join(" / ");

  const alamatWilayah = `DESA ${data.kelurahan.toUpperCase()} KECAMATAN ${data.kecamatan.toUpperCase()} KABUPATEN ${data.kabupaten.toUpperCase()}`;

  const formatWaktuRange = (start: string, end: string) => {
    const render = (value: string) => (value ? value : "...");
    if (!start && !end) {
      return "-";
    }
    if (start && end) {
      return `${start} - ${end} WIB`;
    }
    return `${render(start)} ${end ? "- " + end : ""}`.trim();
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
          <p className="font-semibold text-slate-700">Preview - {surat.title}</p>
          <p className="text-xs uppercase tracking-wide">Periksa kembali sebelum mencetak</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-300 bg-white p-4 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-7 py-6 font-['Times_New_Roman',serif] text-[12px] leading-[1.4] text-slate-900 print:px-9 print:py-8 print:text-[12px] print-sheet">
          <SuratPengantarHeader />
          <div className="text-center leading-tight">
            <p className="text-[16px] font-bold uppercase underline">Surat Pengantar Ijin Keramaian</p>
            <p className="text-[12px] font-semibold">Nomor: {data.nomorSurat || "-"}</p>
          </div>

          <div className="mt-4 space-y-3 text-[12px] leading-[1.4]">
            <p>
              Yang bertanda tangan di bawah ini kami Kepala Desa {data.kelurahan} Kecamatan {data.kecamatan} Kabupaten {data.kabupaten} Provinsi Jawa Tengah, menerangkan bahwa :
            </p>
          </div>

          <table className="mt-3 w-full text-[12px] leading-[1.4]">
            <tbody className="[&>tr>td]:align-top">
              <tr>
                <td className="w-[240px]">Nama Lengkap</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">{data.nama || "-"}</td>
              </tr>
              <tr>
                <td>Tempat/Tanggal Lahir</td>
                <td className="pr-3">:</td>
                <td>{data.tempatLahir || "-"} / {formatDateIndonesian(data.tanggalLahir)}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">{data.jenisKelamin || "-"}</td>
              </tr>
              <tr>
                <td>Agama</td>
                <td className="pr-3">:</td>
                <td>{data.agama || "-"}</td>
              </tr>
              <tr>
                <td>Kewarganegaraan</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">{data.kewarganegaraan || "-"}</td>
              </tr>
              <tr>
                <td>No. KTP/NIK</td>
                <td className="pr-3">:</td>
                <td>{data.nik || "-"}</td>
              </tr>
              <tr>
                <td>Pekerjaan</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">{data.pekerjaan || "-"}</td>
              </tr>
              <tr>
                <td>Alamat Pemohon</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">
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
                <td>Maksud Keramaian</td>
                <td className="pr-3">:</td>
                <td>{data.maksudKeramaian || "-"}</td>
              </tr>
              <tr>
                <td>Tanggal Penyelenggaraan</td>
                <td className="pr-3">:</td>
                <td>{data.tanggalPenyelenggaraan ? formatDateIndonesian(data.tanggalPenyelenggaraan) : "-"}</td>
              </tr>
              <tr>
                <td>Waktu Penyelenggaraan</td>
                <td className="pr-3">:</td>
                <td>{formatWaktuRange(data.waktuMulai, data.waktuSelesai)}</td>
              </tr>
              <tr>
                <td>Jenis Hiburan</td>
                <td className="pr-3">:</td>
                <td>{data.jenisHiburan || "-"}</td>
              </tr>
              <tr>
                <td>Jumlah Undangan</td>
                <td className="pr-3">:</td>
                <td>{data.jumlahUndangan || "0"} Orang</td>
              </tr>
              <tr>
                <td>Tempat Penyelenggaraan</td>
                <td className="pr-3">:</td>
                <td>{data.tempatPenyelenggaraan || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 space-y-3 text-[12px] leading-[1.4]">
            <p>
              Berdasarkan Surat Pernyataan dari Ketua Rukun Tetangga {data.suratPernyataanRT || "..."} Nomor {data.suratPernyataanRTNo || "..."} Tanggal {data.suratPernyataanRTTanggal ? formatDateIndonesian(data.suratPernyataanRTTanggal) : "..."}, maka dengan ini menerangkan atas permohonan yang bersangkutan dapat dilaksanakan dengan ketentuan sebagai berikut:
            </p>
            <ol className="ml-8 list-decimal space-y-2">
              <li>
                Pada waktu dilaksanakan keramaian harus disertai dengan ketentraman dan ketertiban dalam lingkungan, baik hubungan dengan tetangga, menghargai waktu-waktu ibadah dalam menciptakan kerukunan umat beragama maupun kebersihan lingkungan setelah selesai
              </li>
              <li>
                Pada waktu dilaksanakan keramaian tidak dibenarkan/dilarang melakukan hal-hal yang bertentangan dengan ketentuan yang berlaku dan adat-istiadat bangsa;
              </li>
              <li>
                Bilamana akan mempergunakan jalan umum, terlebih dahulu harus Ijin dari DLLAJ dan Kepolisian atau Instansi terkait.
              </li>
            </ol>
            <p className="mt-3">
              Demikian Surat Keterangan Keramaian ini diberikan untuk dipergunakan sebagaimana mestinya.
            </p>
          </div>

          <div className="mt-5 space-y-2 text-[12px] leading-[1.4]">
            <div className="flex w-full items-center gap-2">
              <span className="w-[80px]">No. Reg</span>
              <span>:</span>
              <span className="flex-1">
                <span className="inline-flex min-h-[20px] w-full items-center border-b border-black">
                  {data.noReg ? data.noReg : "\u00A0"}
                </span>
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-[80px]">Tanggal</span>
              <span>:</span>
              <span className="flex-1">
                <span className="inline-flex min-h-[20px] w-full items-center border-b border-black">
                  {data.tanggalReg ? formatDateIndonesian(data.tanggalReg) : "\u00A0"}
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
                    {(data.tempatSurat || "-")}, {formatDateIndonesian(data.tanggalSurat)}
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
    </div>
  );
}
