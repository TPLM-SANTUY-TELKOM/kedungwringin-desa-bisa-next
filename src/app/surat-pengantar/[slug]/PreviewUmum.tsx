"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratPengantarOption } from "@/data/surat-pengantar-options";
import { formatDateIndonesian, type SuratPengantarUmumData } from "@/app/surat-pengantar/types";

type PreviewUmumProps = {
  surat: SuratPengantarOption;
  data: SuratPengantarUmumData;
};

export function PreviewUmum({ surat, data }: PreviewUmumProps) {
  const router = useRouter();

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

      <div className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper">
        <div className="mx-auto max-w-[720px] border border-slate-400 px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet">
          <div className="text-center leading-tight">
            <p className="text-[18px] font-bold uppercase">Surat Pengantar</p>
            <p className="text-[14px] font-semibold">Nomor: {data.nomorSurat || "-"}</p>
          </div>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
            <p>
              Yang bertanda tangan di bawah ini, Kepala Desa {data.kelurahan} Kecamatan {data.kecamatan} Kabupaten {data.kabupaten}, menerangkan dengan sebenarnya bahwa:
            </p>
          </div>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
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

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
            <p>
              Demikian Surat Keterangan ini dibuat untuk dipergunakan seperlunya.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="mb-16">Pemohon</p>
              <p className="font-semibold">({data.nama || "................................"})</p>
            </div>
            <div>
              <p className="mb-16">Mengetahui</p>
              <p className="font-semibold">{data.mengetahuiJabatan || ""}</p>
              <div className="mt-20">
                <p className="font-semibold underline">{data.mengetahuiNama || "................................"}</p>
              </div>
            </div>
            <div>
              <p className="mb-2">{data.tempatSurat || "-"}, {formatDateIndonesian(data.tanggalSurat)}</p>
              <p className="mb-16">Kepala Desa {data.kelurahan}</p>
              <div className="mt-16">
                <p className="font-semibold underline">{data.kepalaDesa || "................................"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

