"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, UserCheck, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

interface Stats {
  totalPenduduk: number;
  totalSurat: number;
  totalAktif: number;
}

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
      const [pendudukRes, suratRes] = await Promise.all([
        supabase.from("penduduk").select("status", { count: "exact" }),
        supabase.from("surat").select("*", { count: "exact" }),
      ]);

      const totalPenduduk = pendudukRes.count || 0;
      const totalAktif = pendudukRes.data?.filter((p) => p.status === "Aktif").length || 0;
      const totalSurat = suratRes.count || 0;

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
      color: "bg-primary",
    },
    {
      title: "Penduduk Aktif",
      value: stats.totalAktif,
      icon: UserCheck,
      color: "bg-secondary",
    },
    {
      title: "Total Surat",
      value: stats.totalSurat,
      icon: FileText,
      color: "bg-accent",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
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
            <CardTitle>Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push("/penduduk")}
              variant="outline"
              className="h-24 text-left justify-start"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Data Penduduk</p>
                  <p className="text-sm text-muted-foreground">
                    Kelola data penduduk desa
                  </p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => router.push("/surat")}
              variant="outline"
              className="h-24 text-left justify-start"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-secondary" />
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
              className="h-24 text-left justify-start"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Inbox className="h-6 w-6 text-accent-foreground" />
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
