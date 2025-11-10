"use client";

import Image from "next/image";

import logoDesa from "@/assets/ic_logo_banyumas.png";

export function SuratPengantarHeader() {
  return (
    <header className="mb-6 flex flex-col items-center text-center text-[14px] text-black">
      <div className="flex w-full items-center gap-4">
        <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden">
          <Image src={logoDesa} alt="Logo Desa Kedungwringin" fill sizes="64px" className="object-contain" priority />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold uppercase leading-tight">
            Pemerintah Desa Kedungwringin
          </p>
          <p className="text-[14px] font-semibold uppercase leading-tight">
            Kecamatan Patikraja Kabupaten Banyumas
          </p>
          <p className="mt-1 text-[16px] font-bold uppercase leading-tight">
            Kepala Desa
          </p>
          <p className="mt-2 text-[12px] font-medium leading-tight normal-case">
            Jl. Raya Kedungwringin No. 1 Kedungwringin Kode Pos 53171
          </p>
          <p className="text-[12px] font-medium leading-tight normal-case">
            Telp. (0281) 6438935
          </p>
          <p className="text-[12px] font-medium leading-tight normal-case">
            e-mail : kedungwringinbalaidesaku@gmail.com
          </p>
        </div>
      </div>
      <div className="mt-3 h-[2px] w-full bg-black" />
      <p className="mt-1 w-full text-left text-[12px] font-semibold normal-case">Kode Desa : 02122013</p>
    </header>
  );
}


