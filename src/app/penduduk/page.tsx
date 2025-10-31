"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export interface PendudukData {
  id?: string;
  nik: string;
  no_kk: string;
  nama: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: "Islam" | "Kristen" | "Katolik" | "Hindu" | "Buddha" | "Konghucu";
  pendidikan: string | null;
  pekerjaan: string | null;
  status_kawin: "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati";
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  status: "Aktif" | "Pindah" | "Meninggal";
}

export default function PendudukPage() {
  const [pendudukList, setPendudukList] = useState<PendudukData[]>([]);
  const [filteredList, setFilteredList] = useState<PendudukData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<PendudukData | null>(null);
  const { toast } = useToast();
  const isAdmin = true; // Sementara hardcode sebagai admin

  useEffect(() => {
    fetchPenduduk();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredList(pendudukList);
    } else {
      const filtered = pendudukList.filter(
        (p) =>
          p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nik.includes(searchQuery)
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, pendudukList]);

  const fetchPenduduk = async () => {
    try {
      const { data, error } = await supabase
        .from("penduduk")
        .select("*")
        .order("nama", { ascending: true });

      if (error) throw error;
      setPendudukList(data || []);
      setFilteredList(data || []);
    } catch (error) {
      console.error("Error fetching penduduk:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data penduduk",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data: PendudukData) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const { error } = await supabase.from("penduduk").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data penduduk berhasil dihapus",
      });
      fetchPenduduk();
    } catch (error) {
      console.error("Error deleting penduduk:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data penduduk",
        variant: "destructive",
      });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditData(null);
    fetchPenduduk();
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Akses Terbatas</h2>
            <p className="text-muted-foreground">
              Anda tidak memiliki akses untuk mengelola data penduduk.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Data Penduduk</h1>
            <p className="text-muted-foreground">Kelola data penduduk Desa Kedungwringin</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Penduduk
          </Button>
        </div>

        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">NIK</th>
                    <th className="text-left p-3 font-medium">Nama</th>
                    <th className="text-left p-3 font-medium">Jenis Kelamin</th>
                    <th className="text-left p-3 font-medium">Alamat</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((penduduk) => (
                    <tr key={penduduk.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{penduduk.nik}</td>
                      <td className="p-3 font-medium">{penduduk.nama}</td>
                      <td className="p-3">{penduduk.jenis_kelamin}</td>
                      <td className="p-3 text-sm">
                        {penduduk.alamat}, RT {penduduk.rt}/RW {penduduk.rw}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          penduduk.status === "Aktif" 
                            ? "bg-green-100 text-green-800" 
                            : penduduk.status === "Pindah"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {penduduk.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(penduduk)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(penduduk.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {editData ? "Edit Data Penduduk" : "Tambah Data Penduduk"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Form penduduk akan dibuat di sini. Untuk sementara, ini adalah placeholder.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleFormClose}>
                      Batal
                    </Button>
                    <Button onClick={handleFormClose}>
                      Simpan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
