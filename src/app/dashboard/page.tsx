"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/client";
import { Users, FileText, UserCheck, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

interface Stats {
  totalPenduduk: number;
  totalSurat: number;
  totalAktif: number;
}

type SuratSummaryResponse = {
  total: number;
  byCategory?: Record<string, number>;
  byJenis?: Record<string, number>;
  monthly?: Array<{ label: string; count: number }>;
};

type PendudukStatusRow = {
  status?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalPenduduk: 0,
    totalSurat: 0,
    totalAktif: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const suratSummaryPromise: Promise<SuratSummaryResponse | null> = fetch("/api/surat-form-entries/summary", {
        cache: "no-store",
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Gagal memuat rekap surat");
          }
          return (await response.json()) as SuratSummaryResponse;
        })
        .catch((error) => {
          console.error("Error fetching surat summary:", error);
          return null;
        });

      const [pendudukRes, suratSummary] = await Promise.all([
        db.from("penduduk").select("status", { count: "exact" }),
        suratSummaryPromise,
      ]);

      const totalPenduduk = pendudukRes.count || 0;
      const pendudukData = Array.isArray(pendudukRes.data) ? (pendudukRes.data as PendudukStatusRow[]) : [];
      const totalAktif = pendudukData.filter((p) => p.status === "Aktif").length;
      const totalSurat = suratSummary?.total ?? 0;

      setStats({
        totalPenduduk,
        totalSurat,
        totalAktif,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Penduduk",
      value: stats.totalPenduduk,
      icon: Users,
      color: "bg-orange-300",
    },
    {
      title: "Penduduk Aktif",
      value: stats.totalAktif,
      icon: UserCheck,
      color: "bg-green-300",
    },
    {
      title: "Total Surat",
      value: stats.totalSurat,
      icon: FileText,
      color: "bg-blue-300",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-gray-700">
            Selamat datang di Sistem Layanan Terpadu Desa Kedungwringin
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-card">
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statCards.map((stat, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} h-10 w-10 rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push("/penduduk")}
              variant="outline"
              className="h-24 text-left justify-start bg-gray-50"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-300 flex items-center justify-center ">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Data Penduduk</p>
                  <p className="text-sm ">
                    Kelola data penduduk desa
                  </p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => router.push("/surat")}
              variant="outline"
              className="h-24 text-left justify-start bg-gray-50"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Buat Surat</p>
                  <p className="text-sm text-muted-foreground">
                    Buat surat keterangan baru
                  </p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => router.push("/surat-masuk")}
              variant="outline"
              className="h-24 text-left justify-start bg-gray-50"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-200 flex items-center justify-center flex-shrink-0">
                  <Inbox className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Surat Masuk</p>
                  <p className="text-sm text-muted-foreground">
                    Lihat dan kelola surat masuk
                  </p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
