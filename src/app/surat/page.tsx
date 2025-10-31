"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

const suratTypes = [
  { id: "SKTM", name: "Surat Keterangan Tidak Mampu", code: "421" },
  { id: "Domisili", name: "Surat Keterangan Domisili", code: "470" },
  { id: "Usaha", name: "Surat Keterangan Usaha", code: "581" },
  { id: "SKCK", name: "Surat Pengantar SKCK", code: "145" },
  { id: "N1", name: "Surat Pengantar Nikah N1", code: "145" },
  { id: "N2", name: "Surat Pengantar Nikah N2", code: "145" },
  { id: "N3", name: "Surat Pengantar Nikah N3", code: "145" },
  { id: "N4", name: "Surat Pengantar Nikah N4", code: "145" },
  { id: "N5", name: "Surat Pengantar Nikah N5", code: "145" },
];

export default function SuratPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pelayanan Surat</h1>
          <p className="text-muted-foreground">Pilih jenis surat yang akan dibuat</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suratTypes.map((surat) => (
            <Card 
              key={surat.id} 
              className="p-6 hover:shadow-elevated transition-shadow cursor-pointer" 
              onClick={() => router.push(`/surat/form/${surat.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{surat.name}</h3>
                  <p className="text-sm text-muted-foreground">Kode: {surat.code}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
