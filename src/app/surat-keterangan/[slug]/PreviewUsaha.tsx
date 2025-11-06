"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { SuratKeteranganOption } from "@/data/surat-keterangan-options";
import type { SuratKeteranganUsahaData } from "@/app/surat-keterangan/types";
import logoDesa from "@/assets/ic_logo_banyumas.png";

type PreviewUsahaProps = {
  surat: SuratKeteranganOption;
  data: SuratKeteranganUsahaData;
};

function formatDateIndonesian(dateString: string): string {
  if (!dateString) return "";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function PreviewUsaha({ surat, data }: PreviewUsahaProps) {
  const router = useRouter();

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 print:mt-0 print:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push(`/surat-keterangan/${surat.slug}`)} className="rounded-full border-slate-300 px-6">
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

      <div className="rounded-4xl border border-slate-300 bg-white p-6 shadow-[12px_12px_36px_rgba(197,205,214,0.35)] print-wrapper">
        <div className="mx-auto max-w-[720px] px-10 py-8 font-['Times_New_Roman',serif] text-[15px] text-slate-900 print-sheet">
          {/* Header */}
          <div className="border-b-[3px] border-black pb-3 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="relative h-20 w-20">
                <Image src={logoDesa} alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <p className="text-[16px] font-bold uppercase">Pemerintah Desa Kedungwringin</p>
                <p className="text-[14px] font-bold uppercase">Kecamatan Patikraja Kabupaten Banyumas</p>
                <p className="text-[18px] font-bold uppercase">Kepala Desa</p>
                <p className="text-[12px]">Jl. Raya Kedungwringin No.1 Kedungwringin Kode Pos 53171</p>
                <p className="text-[12px]">Telp. (0281) 6438935</p>
                <p className="text-[11px] italic">e-mail : kedungwringinbalaldesaku@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mt-6 text-center">
            <p className="text-[16px] font-bold uppercase underline">Surat Keterangan Usaha</p>
            <p className="text-[13px]">Nomor : {data.nomorSurat}</p>
          </div>

          <div className="mt-2 text-left">
            <p className="text-[13px]">Kode Desa : 02122013</p>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-3 text-[14px] leading-relaxed">
            <p className="text-justify">Yang bertanda tangan di bawah ini kami Kepala Desa Kedungwringin Kecamatan Patikraja Kabupaten Banyumas Provinsi Jawa Tengah, menerangkan bahwa :</p>
          </div>

          <table className="mt-4 w-full text-[14px] leading-relaxed">
            <tbody className="[&>tr>td]:py-1 [&>tr>td]:align-top">
              <tr>
                <td className="w-[50px]">1.</td>
                <td className="w-[200px]">Nama Lengkap</td>
                <td className="pr-3">:</td>
                <td className="font-semibold uppercase">{data.nama}</td>
              </tr>
              <tr>
                <td>2.</td>
                <td>Jenis Kelamin</td>
                <td className="pr-3">:</td>
                <td className="uppercase">{data.jenisKelamin}</td>
              </tr>
              <tr>
                <td>3.</td>
                <td>Tempat/Tanggal Lahir</td>
                <td className="pr-3">:</td>
                <td className="uppercase">{data.tempatTanggalLahir}</td>
              </tr>
              <tr>
                <td>4.</td>
                <td>Kewarganegaraan</td>
                <td className="pr-3">:</td>
                <td className="uppercase">{data.kewarganegaraan}</td>
              </tr>
              <tr>
                <td>5.</td>
                <td>No. KTP/NIK</td>
                <td className="pr-3">:</td>
                <td>{data.nik}</td>
              </tr>
              <tr>
                <td>6.</td>
                <td>Pekerjaan</td>
                <td className="pr-3">:</td>
                <td className="uppercase">{data.pekerjaan}</td>
              </tr>
              <tr>
                <td>7.</td>
                <td>Alamat</td>
                <td className="pr-3">:</td>
                <td className="uppercase">{data.alamat}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 space-y-3 text-[14px] leading-relaxed">
            <p className="text-justify">Berdasarkan Surat Keterangan dari Ketua Rukun Tetangga Nomor Tanggal, bahwa yang bersangkutan betul warga Desa Kedungwringin dan menurut pengakuan yang bersangkutan mempunyai usaha <strong>{data.jenisUsaha}</strong>.</p>
            <p className="text-justify">Surat keterangan ini diperlukan untuk <strong>{data.keperluan}</strong>.</p>
            <p className="text-justify">Demikian Surat Keterangan ini kami buat atas permintaan yang bersangkutan dan dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          {/* Signature */}
          <div className="mt-10 flex justify-end">
            <div className="w-[280px] text-center">
              <p className="text-[14px]">Kedungwringin, {formatDateIndonesian(data.tanggalSurat)}</p>
              <p className="text-[14px] font-bold uppercase">Kepala Desa</p>
              <div className="my-16"></div>
              <p className="text-[14px] font-bold uppercase underline">{data.kepalaDesa}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
