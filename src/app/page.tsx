import type { CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bgDecoration from "@/assets/bg_ajukan_surat.png";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import iconSuratKeterangan from "@/assets/ic_surat_keterangan.png";
import iconSuratNikah from "@/assets/ic_surat_nikah.png";
import iconSuratPengantar from "@/assets/ic_surat_pengantar.png";

type SuratMenuItem = {
  title: string;
  icon: StaticImageData;
  href?: string;
  disabled?: boolean;
};

const SURAT_MENU: SuratMenuItem[] = [
  {
    title: "Surat Keterangan",
    icon: iconSuratKeterangan,
    disabled: true,
  },
  {
    title: "Surat Nikah",
    icon: iconSuratNikah,
    href: "/surat-nikah",
  },
  {
    title: "Surat Pengantar",
    icon: iconSuratPengantar,
    disabled: true,
  },
];

function SuratCard({ item }: { item: SuratMenuItem }) {
  const isLink = Boolean(item.href) && !item.disabled;

  const cardStyle: CSSProperties = {
    backgroundColor: "#EAECF0",
    backgroundImage:
      "linear-gradient(138.32deg, rgba(0,0,0,0.5) 8.26%, rgba(255,255,255,0.5) 91.02%)",
    backgroundBlendMode: "soft-light",
    border: "1px solid rgba(255,255,255,0.4)",
  };

  const cardContent = (
    <div
      style={cardStyle}
      className={`flex h-full flex-col items-center justify-center gap-6 rounded-[36px] p-12 text-center transition-all duration-200 shadow-[5px_5px_7px_rgba(174,174,192,0.5),_-5px_-5px_8px_rgba(242,244,248,1)] ${
        isLink
          ? "group-hover:-translate-y-1 group-hover:shadow-[7px_7px_12px_rgba(174,174,192,0.45),_-7px_-7px_12px_rgba(242,244,248,0.9)] group-focus-visible:ring-4 group-focus-visible:ring-primary/20 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[#EBEFF3]"
          : "cursor-default opacity-60"
      }`}
    >
      <Image
        src={item.icon}
        alt={item.title}
        className="h-40 w-40 object-contain"
        priority
      />
      <p className="text-xl font-semibold text-slate-800">{item.title}</p>
    </div>
  );

  if (isLink && item.href) {
    return (
      <Link href={item.href} className="group block focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return (
    <div aria-disabled className="block">
      {cardContent}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EBEFF3] font-sans">
      <div className="pointer-events-none absolute bottom-0 right-0 select-none">
        <Image
          src={bgDecoration}
          alt="Dekorasi gelombang"
          className="w-[220px] sm:w-[260px] md:w-[320px] lg:w-[380px]"
          priority
        />
      </div>

      <header className="relative z-10 flex w-full items-center justify-between px-6 pt-10 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-full bg-white shadow-[6px_6px_12px_rgba(200,205,215,0.35),_-6px_-6px_12px_rgba(255,255,255,0.9)]">
            <Image
              src={logoDesa}
              alt="Logo Desa Kedungwringin"
              fill
              sizes="48px"
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-base font-semibold text-slate-900 sm:text-lg">
            Desa Kedungwringin
          </span>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-[18px] bg-[#ff6435] px-5 py-2.5 text-sm font-semibold text-white shadow-[8px_8px_18px_rgba(203,47,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.65)] transition-all duration-200 hover:shadow-[12px_12px_24px_rgba(203,47,0,0.35),_-8px_-8px_20px_rgba(255,255,255,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff6435]/20 focus-visible:ring-offset-4 focus-visible:ring-offset-[#EBEFF3] active:scale-[0.98]"
        >
          Admin Login
        </Link>
      </header>

      <section
        id="ajukan-surat"
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-24 pt-20 sm:px-10"
      >
        <div className="max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Ajukan Surat
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Silakan pilih jenis surat yang ingin diajukan melalui layanan Desa
            Kedungwringin.
          </p>
        </div>

        <div className="mt-16 grid w-full gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-16">
          {SURAT_MENU.map((item) => (
            <SuratCard key={item.title} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
