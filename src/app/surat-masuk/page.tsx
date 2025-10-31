"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Search, Eye, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface SuratWithPenduduk {
  id: string;
  nomor_surat: string;
  jenis_surat: string;
  keperluan: string;
  tanggal_surat: string;
  pejabat_ttd: string;
  penduduk: {
    nama: string;
    nik: string;
  };
}

const JENIS_SURAT_MAP: Record<string, string> = {
  SKTM: "Surat Keterangan Tidak Mampu",
  Domisili: "Surat Keterangan Domisili",
  Usaha: "Surat Keterangan Usaha",
  SKCK: "Surat Pengantar SKCK",
  N1: "Surat Pengantar Nikah N1",
  N2: "Surat Pengantar Nikah N2",
  N3: "Surat Pengantar Nikah N3",
  N4: "Surat Pengantar Nikah N4",
  N5: "Surat Pengantar Nikah N5",
};

export default function SuratMasukPage() {
  const { toast } = useToast();

  const [suratList, setSuratList] = useState<SuratWithPenduduk[]>([]);
  const [filteredList, setFilteredList] = useState<SuratWithPenduduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  useEffect(() => {
    fetchSurat();
  }, []);

  useEffect(() => {
    filterSurat();
  }, [searchQuery, filterJenis, suratList]);

  const fetchSurat = async () => {
    try {
      const { data, error } = await db
        .from("surat")
        .select(
          `
          *,
          penduduk:penduduk_id (
            nama,
            nik
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSuratList(data || []);
      setFilteredList(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSurat = () => {
    let filtered = [...suratList];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (surat) =>
          surat.nomor_surat.toLowerCase().includes(query) ||
          surat.penduduk.nama.toLowerCase().includes(query) ||
          surat.penduduk.nik.includes(query)
      );
    }

    if (filterJenis) {
      filtered = filtered.filter((surat) => surat.jenis_surat === filterJenis);
    }

    setFilteredList(filtered);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getBadgeColor = (jenis: string) => {
    const colors: Record<string, string> = {
      SKTM: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      Domisili: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      Usaha: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      SKCK: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      N1: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      N2: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      N3: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      N4: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      N5: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
    };
    return colors[jenis] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Surat Masuk</h1>
          <p className="text-muted-foreground">
            Kelola dan preview semua surat yang telah dibuat
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Cari Nomor Surat / Nama / NIK</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Ketik untuk mencari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenis">Filter Jenis Surat</Label>
                <select
                  id="jenis"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Semua Jenis Surat</option>
                  {Object.entries(JENIS_SURAT_MAP).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filterJenis && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterJenis("")}
              >
                Reset Filter
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Daftar Surat ({filteredList.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Memuat data...</div>
            ) : filteredList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || filterJenis
                  ? "Tidak ada surat yang sesuai dengan pencarian"
                  : "Belum ada surat masuk"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Nomor Surat</th>
                      <th className="text-left p-3 font-medium">Jenis Surat</th>
                      <th className="text-left p-3 font-medium">Nama Pemohon</th>
                      <th className="text-left p-3 font-medium">NIK</th>
                      <th className="text-left p-3 font-medium">Tanggal</th>
                      <th className="text-left p-3 font-medium">Keperluan</th>
                      <th className="text-right p-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((surat) => (
                      <tr key={surat.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-sm">
                          {surat.nomor_surat}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor(surat.jenis_surat)}`}>
                            {surat.jenis_surat}
                          </span>
                        </td>
                        <td className="p-3 font-medium">
                          {surat.penduduk.nama}
                        </td>
                        <td className="p-3 font-mono text-sm">
                          {surat.penduduk.nik}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(surat.tanggal_surat)}
                          </div>
                        </td>
                        <td className="p-3 max-w-xs truncate">
                          {surat.keperluan}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Handle preview
                              toast({
                                title: "Preview",
                                description: "Fitur preview akan dibuat",
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
