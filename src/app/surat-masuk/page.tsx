"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, FileText, Package, PieChart, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { NIKAH_BUNDLE_CODES } from "@/data/surat-form-meta";

type SuratFormEntryListItem = {
  id: string;
  jenis_surat: string;
  kategori: string;
  slug: string;
  title: string;
  nomor_surat: string | null;
  tanggal_surat: string | null;
  pemohon_nama: string;
  pemohon_nik: string | null;
  status: string;
  bundle_key: string | null;
  created_at: string;
};

type SummaryResponse = {
  total: number;
  byCategory: Record<string, number>;
  byJenis: Record<string, number>;
  monthly: Array<{ label: string; count: number }>;
};

type NikahBundleResponse = {
  bundleKey: string;
  pemohonNama: string;
  pemohonNik: string | null;
  lastUpdated: string;
  completed: boolean;
  missing: string[];
  forms: Array<{
    id: string;
    jenis: string;
    slug: string;
    title: string;
    created_at: string;
    nomor_surat: string | null;
  }>;
};

const CATEGORY_LABELS: Record<string, string> = {
  nikah: "Surat Nikah",
  keterangan: "Surat Keterangan",
  pengantar: "Surat Pengantar",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const basePreviewPath = (kategori: string) => {
  if (kategori === "nikah") return "/surat-nikah";
  if (kategori === "keterangan") return "/surat-keterangan";
  return "/surat-pengantar";
};

const monthLabel = (label: string) => {
  const [year, month] = label.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "short" });
};

export default function SuratMasukPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [entries, setEntries] = useState<SuratFormEntryListItem[]>([]);
  const [bundles, setBundles] = useState<NikahBundleResponse[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingBundles, setLoadingBundles] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const response = await fetch("/api/surat-form-entries/summary", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Gagal memuat ringkasan surat");
      }
      const data = (await response.json()) as SummaryResponse;
      setSummary(data);
    } catch (error: unknown) {
      toast({
        title: "Ringkasan gagal dimuat",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data ringkasan.",
        variant: "destructive",
      });
    } finally {
      setLoadingSummary(false);
    }
  }, [toast]);

  const fetchEntries = useCallback(async () => {
    try {
      setLoadingEntries(true);
      const params = new URLSearchParams({
        limit: "50",
      });
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (kategoriFilter) params.append("kategori", kategoriFilter);
      if (jenisFilter) params.append("jenis", jenisFilter);
      const response = await fetch(`/api/surat-form-entries?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Gagal memuat surat masuk");
      }
      const data = await response.json();
      setEntries(data.entries ?? []);
    } catch (error: unknown) {
      toast({
        title: "Tidak dapat memuat daftar surat",
        description: error instanceof Error ? error.message : "Periksa koneksi anda dan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoadingEntries(false);
    }
  }, [kategoriFilter, jenisFilter, searchQuery, toast]);

  const fetchBundles = useCallback(async () => {
    try {
      setLoadingBundles(true);
      const response = await fetch("/api/surat-form-entries/bundles", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Gagal memuat rekap nikah");
      }
      const data = await response.json();
      setBundles(data.bundles ?? []);
    } catch (error: unknown) {
      toast({
        title: "Tidak dapat memuat rekap nikah",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data.",
        variant: "destructive",
      });
    } finally {
      setLoadingBundles(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSummary();
    fetchBundles();
  }, [fetchSummary, fetchBundles]);

  useEffect(() => {
    const handler = setTimeout(() => {
      void fetchEntries();
    }, 350);
    return () => clearTimeout(handler);
  }, [fetchEntries]);

  const jenisOptions = useMemo(() => {
    if (!summary) return [];
    if (kategoriFilter) {
      return Object.keys(summary.byJenis).filter((jenis) => jenis.toLowerCase().includes(kategoriFilter));
    }
    return Object.keys(summary.byJenis);
  }, [kategoriFilter, summary]);

  const chartData = summary?.monthly ?? [];
  const chartMax = chartData.reduce((max, point) => Math.max(max, point.count), 1);

  const openPreview = (entry: SuratFormEntryListItem, target: "_blank" | "_self" = "_blank") => {
    const path = `${basePreviewPath(entry.kategori)}/${entry.slug}/preview?entryId=${entry.id}&from=surat-masuk`;
    window.open(path, target, "noopener,noreferrer");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Surat Masuk</h1>
          <p className="text-muted-foreground">
            Pantau statistik surat, riwayat pengajuan, serta rekap otomatis N1-N6.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["nikah", "keterangan", "pengantar"].map((category) => (
            <Card key={category} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {CATEGORY_LABELS[category]}
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-3xl font-bold">{summary?.byCategory[category] ?? 0}</p>
                )}
                <p className="text-xs text-muted-foreground">Total pengajuan {CATEGORY_LABELS[category].toLowerCase()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Aktivitas Surat Bulanan</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={fetchSummary}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <div className="flex h-32 items-end gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <div className="h-24 w-6 animate-pulse rounded bg-muted" />
                    <span className="h-3 w-10 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data surat yang tersimpan.</p>
            ) : (
              <div className="flex items-end gap-4">
                {chartData.map((point) => {
                  const height = Math.max((point.count / chartMax) * 120, 8);
                  return (
                    <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-6 rounded-t-lg bg-gradient-to-t from-primary to-orange-400"
                        style={{ height }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">{monthLabel(point.label)}</span>
                      <span className="text-xs font-semibold">{point.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter &amp; Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Cari Nomor / Nama / NIK</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Ketik kata kunci..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kategori Surat</Label>
                <Select
                  value={kategoriFilter || undefined}
                  onValueChange={(value) => setKategoriFilter(value === "__all" ? "" : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Semua kategori</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jenis Surat</Label>
                <Select
                  value={jenisFilter || undefined}
                  onValueChange={(value) => setJenisFilter(value === "__all" ? "" : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Semua jenis</SelectItem>
                    {jenisOptions.map((jenis) => (
                      <SelectItem key={jenis} value={jenis}>
                        {jenis.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Riwayat Surat ({entries.length})</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={fetchEntries}>
              Muat ulang
            </Button>
          </CardHeader>
          <CardContent>
            {loadingEntries ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Memuat data surat masuk...</div>
            ) : entries.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Tidak ada surat yang sesuai dengan filter saat ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="p-3">Nomor</th>
                      <th className="p-3">Jenis</th>
                      <th className="p-3">Pemohon</th>
                      <th className="p-3">NIK</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-mono text-xs">{entry.nomor_surat ?? "-"}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase">
                            {entry.jenis_surat}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{entry.pemohon_nama}</td>
                        <td className="p-3 font-mono text-xs">{entry.pemohon_nik ?? "-"}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{formatDate(entry.tanggal_surat ?? entry.created_at)}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPreview(entry)}
                            title="Lihat preview"
                          >
                            <Eye className="mr-1 h-4 w-4" />
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

        <Card className="shadow-card">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Rekap Otomatis N1 - N6</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={fetchBundles}>
              Muat ulang
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingBundles ? (
              <div className="text-sm text-muted-foreground">Memuat data rekap nikah...</div>
            ) : bundles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada paket surat nikah yang terekam.</p>
            ) : (
              <div className="space-y-4">
                {bundles.map((bundle) => {
                  const sortedForms = [...bundle.forms].sort((a, b) => {
                    const aIndex = NIKAH_BUNDLE_CODES.indexOf(a.jenis.toUpperCase());
                    const bIndex = NIKAH_BUNDLE_CODES.indexOf(b.jenis.toUpperCase());
                    return aIndex - bIndex;
                  });
                  return (
                    <div
                      key={bundle.bundleKey}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{bundle.pemohonNama}</p>
                        <p className="text-sm text-muted-foreground">
                          NIK: {bundle.pemohonNik ?? "-"} • {sortedForms.length} dokumen
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          bundle.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {bundle.completed ? "Lengkap" : `Kurang ${bundle.missing.length} dokumen`}
                      </span>
                      {bundle.completed && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            router.push(
                              `/surat-nikah/bundles/${encodeURIComponent(bundle.bundleKey)}/preview?from=surat-masuk`,
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Paket
                        </Button>
                      )}
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {sortedForms.map((form) => (
                        <div
                          key={form.id}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-semibold">{form.jenis}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(form.created_at)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              window.open(
                                `/surat-nikah/${form.slug}/preview?entryId=${form.id}&from=surat-masuk`,
                                "_blank",
                              )
                            }
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Preview
                          </Button>
                        </div>
                      ))}
                    </div>
                    {!bundle.completed && bundle.missing.length > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Dokumen kurang: {bundle.missing.map((item) => `Model ${item}`).join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
