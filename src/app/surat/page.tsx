"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useMemo, useState } from "react";

type SuratType = {
  id: string;
  name: string;
  code?: string;
  category: "keterangan" | "nikah" | "pengantar";
  slug: string;
};

const suratTypes: SuratType[] = [
  // Surat Keterangan
  {
    id: "SKU",
    name: "Surat Keterangan Umum",
    code: "SKU",
    category: "keterangan",
    slug: "surat-keterangan-umum",
  },
  {
    id: "SKBPK",
    name: "Surat Keterangan Belum Pernah Kawin",
    code: "SKBPK",
    category: "keterangan",
    slug: "surat-keterangan-belum-pernah-kawin",
  },
  {
    id: "SKDTT",
    name: "Surat Keterangan Domisili Tempat Tinggal",
    code: "SKDTT",
    category: "keterangan",
    slug: "surat-keterangan-domisili-tempat-tinggal",
  },
  {
    id: "SKUs",
    name: "Surat Keterangan Usaha",
    code: "SKUs",
    category: "keterangan",
    slug: "surat-keterangan-usaha",
  },
  {
    id: "SKWH",
    name: "Surat Keterangan Wali Hakim",
    code: "SKWH",
    category: "keterangan",
    slug: "surat-keterangan-wali-hakim",
  },
  {
    id: "SKDU",
    name: "Surat Keterangan Domisili Usaha",
    code: "SKDU",
    category: "keterangan",
    slug: "surat-keterangan-domisili-usaha",
  },
  {
    id: "SKTM",
    name: "Surat Keterangan Tidak Mampu",
    code: "SKTM",
    category: "keterangan",
    slug: "surat-keterangan-tidak-mampu",
  },
  // Surat Pengantar Nikah
  {
    id: "N1",
    name: "Formulir Pengantar Nikah",
    code: "N1",
    category: "nikah",
    slug: "formulir-pengantar-nikah",
  },
  {
    id: "N2",
    name: "Formulir Permohonan Kehendak Perkawinan",
    code: "N2",
    category: "nikah",
    slug: "formulir-permohonan-kehendak-perkawinan",
  },
  {
    id: "N3",
    name: "Formulir Surat Persetujuan Mempelai",
    code: "N3",
    category: "nikah",
    slug: "formulir-surat-persetujuan-mempelai",
  },
  {
    id: "N5",
    name: "Formulir Surat Izin Orang Tua",
    code: "N5",
    category: "nikah",
    slug: "formulir-surat-izin-orang-tua",
  },
  {
    id: "N6",
    name: "Formulir Surat Keterangan Kematian Suami/Istri",
    code: "N6",
    category: "nikah",
    slug: "formulir-surat-keterangan-kematian",
  },
  {
    id: "wali-nikah",
    name: "Surat Keterangan Wali Nikah",
    category: "nikah",
    slug: "surat-keterangan-wali-nikah",
  },
  {
    id: "pernyataan-belum-menikah",
    name: "Surat Pernyataan Belum Menikah",
    category: "nikah",
    slug: "surat-pernyataan-belum-menikah",
  },
  {
    id: "pengantar-numpang",
    name: "Surat Pengantar Numpang Nikah",
    category: "nikah",
    slug: "surat-pengantar-numpang-nikah",
  },
  // Surat Pengantar
  {
    id: "pengantar-umum",
    name: "Surat Pengantar Umum",
    category: "pengantar",
    slug: "surat-pengantar-umum",
  },
  {
    id: "pengantar-kepolisian",
    name: "Surat Pengantar Kepolisian",
    category: "pengantar",
    slug: "surat-pengantar-kepolisian",
  },
  {
    id: "pengantar-izin-keramaian",
    name: "Surat Pengantar Izin Keramaian",
    category: "pengantar",
    slug: "surat-pengantar-izin-keramaian",
  },
];

const getCategoryPath = (category: string) => {
  switch (category) {
    case "keterangan":
      return "/surat-keterangan";
    case "nikah":
      return "/surat-nikah";
    case "pengantar":
      return "/surat-pengantar";
    default:
      return "/surat";
  }
};

const categoryLabels = {
  keterangan: "A. Surat Keterangan",
  nikah: "B. Surat Pengantar Nikah",
  pengantar: "C. Surat Pengantar",
};

export default function SuratPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuratTypes = useMemo(() => {
    if (!searchQuery.trim()) {
      return suratTypes;
    }

    const query = searchQuery.toLowerCase().trim();
    return suratTypes.filter((surat) => {
      const nameMatch = surat.name.toLowerCase().includes(query);
      const codeMatch = surat.code?.toLowerCase().includes(query);
      return nameMatch || codeMatch;
    });
  }, [searchQuery]);

  const groupedSurat = useMemo(() => {
    const groups: { category: "keterangan" | "nikah" | "pengantar"; surats: SuratType[] }[] = [
      { category: "keterangan", surats: [] },
      { category: "nikah", surats: [] },
      { category: "pengantar", surats: [] },
    ];

    filteredSuratTypes.forEach((surat) => {
      const group = groups.find((g) => g.category === surat.category);
      if (group) {
        group.surats.push(surat);
      }
    });

    return groups.filter((group) => group.surats.length > 0);
  }, [filteredSuratTypes]);

  const handleSuratClick = (surat: SuratType) => {
    const categoryPath = getCategoryPath(surat.category);
    router.push(`${categoryPath}/${surat.slug}?from=admin`);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pelayanan Surat</h1>
          <p className="text-muted-foreground">Pilih jenis surat yang akan dibuat</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari surat berdasarkan nama atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {groupedSurat.map((group) => (
          <div key={group.category} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {categoryLabels[group.category]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.surats.map((surat) => (
                  <Card 
                    key={surat.id} 
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20" 
                    onClick={() => handleSuratClick(surat)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 text-foreground">{surat.name}</h3>
                        {surat.code && (
                          <p className="text-sm text-muted-foreground">Kode: {surat.code}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {surat.category === "keterangan" && "Surat Keterangan"}
                          {surat.category === "nikah" && "Surat Nikah"}
                          {surat.category === "pengantar" && "Surat Pengantar"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
