"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SuratNikahOption } from "@/data/surat-nikah-options";
import { formatDateIndonesian, type WaliNikahData } from "@/app/surat-nikah/types";

type PreviewWaliNikahProps = {
  surat: SuratNikahOption;
  data: WaliNikahData;
};

const WALI_RELATION_OPTIONS = [
  "Ayah kandung",
  "Kakek kandung",
  "Kakek buyut kandung",
  "Saudara laki-laki kandung seayah seibu",
  "Saudara laki-laki kandung seayah",
  "Anak laki-laki saudara laki-laki kandung seayah seibu",
  "Anak laki-laki saudara laki-laki kandung seayah",
  "Paman/Pak De sekandung",
  "Paman seayah",
  "Anak laki-laki paman sekandung",
  "Anak laki-laki paman seayah",
  "Cucu laki-laki paman sekandung",
  "Cucu laki-laki paman seayah",
  "Saudara laki-laki kakek sekandung",
  "Saudara laki-laki kakek seayah",
  "Anak laki-laki saudara laki-laki kakek sekandung",
  "Anak laki-laki saudara laki-laki kakek seayah",
  "Saudara laki-laki kakek buyut sekandung",
  "Saudara laki-laki kakek buyut seayah",
  "Anak laki-laki saudara laki-laki kakek buyut sekandung",
  "Anak laki-laki saudara laki-laki kakek buyut seayah",
];

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

const IdentityRow = ({ label, value }: { label: string; value: string | ReactNode }) => (
  <tr>
    <td className="w-[240px] align-top">{label}</td>
    <td className="w-4 align-top">:</td>
    <td className="align-top">{value}</td>
  </tr>
);

export function PreviewWaliNikah({ surat, data }: PreviewWaliNikahProps) {
  const router = useRouter();

  const tanggalSurat = useMemo(() => formatDateIndonesian(data.tanggalSurat), [data.tanggalSurat]);
  const tanggalNikah = useMemo(() => formatDateIndonesian(data.tanggalNikah), [data.tanggalNikah]);

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
            <p className="text-[18px] font-semibold uppercase">Pemerintah Kabupaten Banyumas</p>
            <p className="text-[17px] font-semibold uppercase">Kecamatan Patikraja</p>
            <p className="text-[17px] font-semibold uppercase">Kepala Desa Kedungwringin</p>
            <p className="text-[13px] capitalize tracking-wide">Jalan Raya Kedungwringin No. 01 Telp. 0281 6438935 Kode Pos 53171</p>
          </div>

          <div className="mt-6 text-center leading-tight">
            <p className="text-[18px] font-semibold uppercase">Surat Keterangan Wali Nikah</p>
            <p className="text-[14px]">
              Nomor : <span className="underline decoration-slate-700 decoration-dotted">{data.nomorSurat || "........"}</span>
            </p>
          </div>

          <p className="mt-6 text-justify leading-relaxed">Yang bertanda tangan di bawah ini menerangkan dengan sesungguhnya bahwa seorang laki-laki:</p>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
            <tbody>
              <IdentityRow label="1. Nama" value={data.waliNama || "-"} />
              <IdentityRow label="2. Bin" value={data.waliBin || "-"} />
              <IdentityRow label="3. Tempat/tanggal lahir" value={combineTempatTanggal(data.waliTempatLahir, data.waliTanggalLahir)} />
              <IdentityRow label="4. Warganegara" value={data.waliKewarganegaraan || "-"} />
              <IdentityRow label="5. Agama" value={data.waliAgama || "-"} />
              <IdentityRow label="6. Pekerjaan" value={data.waliPekerjaan || "-"} />
              <IdentityRow label="7. Alamat" value={renderMultiline(data.waliAlamat)} />
            </tbody>
          </table>

          <p className="mt-6 leading-relaxed">Orang tersebut adalah wali nikah dari:</p>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
            <tbody>
              <IdentityRow label="1. Nama" value={data.mempelaiNama || "-"} />
              <IdentityRow label="2. Binti" value={data.mempelaiBinti || "-"} />
              <IdentityRow label="3. Tempat/tanggal lahir" value={combineTempatTanggal(data.mempelaiTempatLahir, data.mempelaiTanggalLahir)} />
              <IdentityRow label="4. Warganegara" value={data.mempelaiKewarganegaraan || "-"} />
              <IdentityRow label="5. Agama" value={data.mempelaiAgama || "-"} />
              <IdentityRow label="6. Pekerjaan" value={data.mempelaiPekerjaan || "-"} />
              <IdentityRow label="7. Alamat" value={renderMultiline(data.mempelaiAlamat)} />
            </tbody>
          </table>

          <p className="mt-6 leading-relaxed">Dengan seorang laki-laki:</p>

          <table className="mt-4 w-full text-[15px] leading-relaxed">
            <tbody>
              <IdentityRow label="1. Nama" value={data.pasanganNama || "-"} />
              <IdentityRow label="2. Bin" value={data.pasanganBin || "-"} />
              <IdentityRow label="3. Tempat/tanggal lahir" value={combineTempatTanggal(data.pasanganTempatLahir, data.pasanganTanggalLahir)} />
              <IdentityRow label="4. Warganegara" value={data.pasanganKewarganegaraan || "-"} />
              <IdentityRow label="5. Agama" value={data.pasanganAgama || "-"} />
              <IdentityRow label="6. Pekerjaan" value={data.pasanganPekerjaan || "-"} />
              <IdentityRow label="7. Alamat" value={renderMultiline(data.pasanganAlamat)} />
            </tbody>
          </table>

          <p className="mt-6 leading-relaxed">
            Menikah di: {data.tempatNikah || ".........................................................."}
          </p>
          <p className="leading-relaxed">
            Pada hari/tanggal: {(data.hariNikah || "...") + ", " + (tanggalNikah !== "-" ? tanggalNikah : "....................")}
          </p>
          <p className="leading-relaxed">Sebab: {data.sebab || "-"}</p>

          <p className="mt-6 leading-relaxed">Hubungan wali terhadap perempuan tersebut di atas adalah sebagai berikut:</p>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            {WALI_RELATION_OPTIONS.map((item) => (
              <li key={item} className={item.toLowerCase() === data.hubunganWali.toLowerCase() ? "font-semibold text-slate-900" : ""}>
                {item}
              </li>
            ))}
          </ol>

          {data.hubunganWali && !WALI_RELATION_OPTIONS.some((option) => option.toLowerCase() === data.hubunganWali.toLowerCase()) && (
            <p className="mt-3 text-[14px] italic text-slate-700">
              Catatan hubungan wali: {data.hubunganWali}
            </p>
          )}

          <p className="mt-6 text-justify leading-relaxed">
            Demikian surat keterangan ini dibuat dengan mengingat sumpah jabatan dan untuk digunakan seperlunya.
          </p>

          <div className="mt-10 grid gap-8 text-[15px] leading-relaxed sm:grid-cols-2">
            <div className="text-center">
              <p>Mengetahui</p>
              <p className="mt-1">Kepala KUA Patikraja</p>
              <div className="mt-16">
                <p className="font-semibold uppercase tracking-wide">{data.kepalaKua || "........................"}</p>
              </div>
            </div>
            <div className="text-center">
              <p>{(data.tempatSurat || "Kedungwringin") + ", " + tanggalSurat}</p>
              <p className="mt-1">Kepala Desa Kedungwringin</p>
              <div className="mt-16">
                <p className="font-semibold uppercase tracking-wide">{data.kepalaDesa || "........................"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
