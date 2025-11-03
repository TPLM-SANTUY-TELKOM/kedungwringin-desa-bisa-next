"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { db } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

type StatusKawin = "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati";
type StatusPerkawinan = "Belum menikah" | "Menikah" | "Duda" | "Janda";

const STATUS_PERKAWINAN: Record<
  StatusKawin,
  Exclude<StatusPerkawinan, "Janda">
> = {
  "Belum Kawin": "Belum menikah",
  Kawin: "Menikah",
  "Cerai Hidup": "Duda", // default, will be adjusted using jenis_kelamin
  "Cerai Mati": "Duda", // default, will be adjusted using jenis_kelamin
};

const formatTanggal = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
  status_kawin: StatusKawin;
  status_perkawinan?: StatusPerkawinan;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  status: "Aktif" | "Pindah" | "Meninggal";
  golongan_darah?:
    | "A"
    | "B"
    | "AB"
    | "O"
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";
  no_akta_lahir?: string | null;
  umur?: number | null;
}

const resolveStatusPerkawinan = (penduduk: PendudukData): StatusPerkawinan => {
  if (penduduk.status_perkawinan) return penduduk.status_perkawinan;
  const dasar =
    STATUS_PERKAWINAN[penduduk.status_kawin] ?? ("Menikah" as const);
  if (dasar === "Duda") {
    if (penduduk.jenis_kelamin === "Perempuan") return "Janda";
    return "Duda";
  }
  return dasar;
};

type PendudukFormValues = {
  nik: string;
  no_kk: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: PendudukData["jenis_kelamin"] | "";
  golongan_darah: NonNullable<PendudukData["golongan_darah"]> | "";
  agama: PendudukData["agama"] | "";
  pendidikan: string;
  pekerjaan: string;
  status_kawin: StatusKawin | "";
  alamat: string;
  dusun: string;
  rt: string;
  rw: string;
  status: PendudukData["status"] | "";
  no_akta_lahir: string;
  umur: string;
};

const GOLONGAN_DARAH_OPTIONS: Array<
  NonNullable<PendudukData["golongan_darah"]>
> = ["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AGAMA_OPTIONS: PendudukData["agama"][] = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];
const STATUS_KAWIN_OPTIONS: StatusKawin[] = [
  "Belum Kawin",
  "Kawin",
  "Cerai Hidup",
  "Cerai Mati",
];
const STATUS_PENDUDUK_OPTIONS: PendudukData["status"][] = [
  "Aktif",
  "Pindah",
  "Meninggal",
];

const defaultFormValues: PendudukFormValues = {
  nik: "",
  no_kk: "",
  nama: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  golongan_darah: "",
  agama: "",
  pendidikan: "",
  pekerjaan: "",
  status_kawin: "",
  alamat: "",
  dusun: "",
  rt: "",
  rw: "",
  status: "Aktif",
  no_akta_lahir: "",
  umur: "",
};

const toFormValues = (data: PendudukData): PendudukFormValues => ({
  nik: data.nik ?? "",
  no_kk: data.no_kk ?? "",
  nama: data.nama ?? "",
  tempat_lahir: data.tempat_lahir ?? "",
  tanggal_lahir: data.tanggal_lahir ? data.tanggal_lahir.slice(0, 10) : "",
  jenis_kelamin: data.jenis_kelamin ?? "",
  golongan_darah: data.golongan_darah ?? "",
  agama: data.agama ?? "",
  pendidikan: data.pendidikan ?? "",
  pekerjaan: data.pekerjaan ?? "",
  status_kawin: data.status_kawin ?? "",
  alamat: data.alamat ?? "",
  dusun: data.dusun ?? "",
  rt: data.rt ?? "",
  rw: data.rw ?? "",
  status: data.status ?? "Aktif",
  no_akta_lahir: data.no_akta_lahir ?? "",
  umur: data.umur ? String(data.umur) : "",
});

export default function PendudukPage() {
  const [pendudukList, setPendudukList] = useState<PendudukData[]>([]);
  const [filteredList, setFilteredList] = useState<PendudukData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<PendudukData | null>(null);
  const [formValues, setFormValues] =
    useState<PendudukFormValues>(defaultFormValues);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAdmin = true; // Sementara hardcode sebagai admin

  const filterPenduduk = (query: string, list: PendudukData[]) => {
    const trimmed = query.trim();
    if (trimmed === "") return list;
    const lowered = trimmed.toLowerCase();
    return list.filter(
      (p) => p.nama.toLowerCase().includes(lowered) || p.nik.includes(trimmed)
    );
  };

  const fetchPenduduk = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("penduduk")
        .select("*")
        .order("nama", { ascending: true });

      if (error) throw error;
      const withDerivedStatus = (data || []).map((item: PendudukData) => ({
        ...item,
        status_perkawinan: resolveStatusPerkawinan(item),
      }));
      setPendudukList(withDerivedStatus);
      setFilteredList(withDerivedStatus);
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
  }, [toast]);

  useEffect(() => {
    fetchPenduduk();
  }, [fetchPenduduk]);

  useEffect(() => {
    setFilteredList(filterPenduduk(searchQuery, pendudukList));
  }, [searchQuery, pendudukList]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setSearchQuery(trimmed);
    setFilteredList(filterPenduduk(trimmed, pendudukList));
  };

  const openForm = (data?: PendudukData) => {
    if (data) {
      setFormValues(toFormValues(data));
      setEditData(data);
    } else {
      setFormValues(defaultFormValues);
      setEditData(null);
    }
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (data: PendudukData) => openForm(data);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const { error } = await db.from("penduduk").delete().eq("id", id);

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
    setFormValues(defaultFormValues);
    setFormError(null);
    fetchPenduduk();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange =
    (name: keyof PendudukFormValues) => (value: string) => {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const requiredFields: Array<keyof PendudukFormValues> = [
      "nik",
      "no_kk",
      "nama",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "agama",
      "status_kawin",
      "alamat",
      "dusun",
      "rt",
      "rw",
      "status",
    ];

    const missing = requiredFields.filter((field) => {
      const value = formValues[field];
      return typeof value === "string" ? value.trim() === "" : !value;
    });

    if (missing.length > 0) {
      setFormError("Mohon lengkapi semua field wajib yang bertanda *.");
      return;
    }

    const umurValue = formValues.umur ? Number(formValues.umur) : null;

    const payload: Record<string, unknown> = {
      nik: formValues.nik.trim(),
      no_kk: formValues.no_kk.trim(),
      nama: formValues.nama.trim(),
      tempat_lahir: formValues.tempat_lahir.trim(),
      tanggal_lahir: formValues.tanggal_lahir,
      jenis_kelamin: formValues.jenis_kelamin as PendudukData["jenis_kelamin"],
      agama: formValues.agama as PendudukData["agama"],
      status_kawin: formValues.status_kawin as StatusKawin,
      alamat: formValues.alamat.trim(),
      dusun: formValues.dusun.trim(),
      rt: formValues.rt.trim(),
      rw: formValues.rw.trim(),
      status: formValues.status as PendudukData["status"],
      pendidikan: formValues.pendidikan.trim() || null,
      pekerjaan: formValues.pekerjaan.trim() || null,
      golongan_darah: formValues.golongan_darah
        ? formValues.golongan_darah
        : null,
      no_akta_lahir: formValues.no_akta_lahir.trim() || null,
      umur: umurValue !== null && Number.isNaN(umurValue) ? null : umurValue,
    };

    setIsSubmitting(true);
    try {
      let response;
      if (editData?.id) {
        response = await db
          .from("penduduk")
          .update(payload)
          .eq("id", editData.id);
      } else {
        response = await db.from("penduduk").insert(payload);
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Berhasil",
        description: editData
          ? "Data penduduk berhasil diperbarui."
          : "Data penduduk berhasil ditambahkan.",
      });

      handleFormClose();
    } catch (error) {
      console.error("Error saving penduduk:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Data Penduduk
            </h1>
            <p className="text-muted-foreground text-lg">
              Kelola data penduduk Desa Kedungwringin
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="search"
              >
                Cari penduduk
              </label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Cari berdasarkan nama atau NIK..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-full border-2 border-foreground/80 px-6 text-base shadow-sm"
                />
                <Search className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => openForm()}
                className="h-14 rounded-full px-8 text-base font-semibold gap-2"
              >
                <Plus className="h-5 w-5" />
                Tambah
              </Button>
            </div>
          </div>
        </div>

        <Card className="p-6 shadow-card">
          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th className="p-4 text-left font-semibold">NIK</th>
                    <th className="p-4 text-left font-semibold">Nama</th>
                    <th className="p-4 text-left font-semibold">TTL</th>
                    <th className="p-4 text-left font-semibold">JK</th>
                    <th className="p-4 text-left font-semibold">Gol. Darah</th>
                    <th className="p-4 text-left font-semibold">
                      Alamat lengkap
                    </th>
                    <th className="p-4 text-left font-semibold">
                      Status Perkawinan
                    </th>
                    <th className="p-4 text-left font-semibold">Agama</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredList.map((penduduk) => (
                    <tr key={penduduk.id} className="hover:bg-muted/30">
                      <td className="p-4 font-mono text-xs uppercase tracking-wide">
                        {penduduk.nik}
                      </td>
                      <td className="p-4 font-semibold">{penduduk.nama}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="capitalize">
                            {penduduk.tempat_lahir}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTanggal(penduduk.tanggal_lahir)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{penduduk.jenis_kelamin}</td>
                      <td className="p-4 uppercase">
                        {penduduk.golongan_darah
                          ? penduduk.golongan_darah
                          : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span>{penduduk.alamat}</span>
                          <span className="text-xs text-muted-foreground">
                            RT {penduduk.rt} / RW {penduduk.rw}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {resolveStatusPerkawinan(penduduk)}
                      </td>
                      <td className="p-4">{penduduk.agama}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex min-w-[6rem] justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                            penduduk.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : penduduk.status === "Pindah"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {penduduk.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {formError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {formError}
                    </div>
                  )}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nik">
                        NIK <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nik"
                        name="nik"
                        value={formValues.nik}
                        onChange={handleInputChange}
                        maxLength={16}
                        placeholder="Masukkan nomor induk kependudukan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="no_kk">
                        No. KK <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="no_kk"
                        name="no_kk"
                        value={formValues.no_kk}
                        onChange={handleInputChange}
                        maxLength={16}
                        placeholder="Masukkan nomor kartu keluarga"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama">
                        Nama lengkap <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nama"
                        name="nama"
                        value={formValues.nama}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempat_lahir">
                        Tempat lahir <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tempat_lahir"
                        name="tempat_lahir"
                        value={formValues.tempat_lahir}
                        onChange={handleInputChange}
                        placeholder="Contoh: Banyumas"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggal_lahir">
                        Tanggal lahir <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tanggal_lahir"
                        name="tanggal_lahir"
                        type="date"
                        value={formValues.tanggal_lahir}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jenis_kelamin">
                        Jenis kelamin <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="jenis_kelamin"
                        name="jenis_kelamin"
                        value={formValues.jenis_kelamin}
                        onChange={(event) =>
                          handleSelectChange("jenis_kelamin")(
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="golongan_darah">Golongan darah</Label>
                      <select
                        id="golongan_darah"
                        name="golongan_darah"
                        value={formValues.golongan_darah}
                        onChange={(event) =>
                          handleSelectChange("golongan_darah")(
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Pilih golongan darah</option>
                        {GOLONGAN_DARAH_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agama">
                        Agama <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="agama"
                        name="agama"
                        value={formValues.agama}
                        onChange={(event) =>
                          handleSelectChange("agama")(event.target.value)
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">Pilih agama</option>
                        {AGAMA_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pendidikan">Pendidikan</Label>
                      <Input
                        id="pendidikan"
                        name="pendidikan"
                        value={formValues.pendidikan}
                        onChange={handleInputChange}
                        placeholder="Contoh: SLTA/Sederajat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pekerjaan">Pekerjaan</Label>
                      <Input
                        id="pekerjaan"
                        name="pekerjaan"
                        value={formValues.pekerjaan}
                        onChange={handleInputChange}
                        placeholder="Contoh: Wiraswasta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status_kawin">
                        Status perkawinan{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="status_kawin"
                        name="status_kawin"
                        value={formValues.status_kawin}
                        onChange={(event) =>
                          handleSelectChange("status_kawin")(event.target.value)
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">Pilih status perkawinan</option>
                        {STATUS_KAWIN_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="alamat">
                        Alamat lengkap <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="alamat"
                        name="alamat"
                        value={formValues.alamat}
                        onChange={handleInputChange}
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dusun">
                        Dusun <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dusun"
                        name="dusun"
                        value={formValues.dusun}
                        onChange={handleInputChange}
                        placeholder="Contoh: Kedungwringin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rt">
                        RT <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rt"
                        name="rt"
                        value={formValues.rt}
                        onChange={handleInputChange}
                        placeholder="001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rw">
                        RW <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rw"
                        name="rw"
                        value={formValues.rw}
                        onChange={handleInputChange}
                        placeholder="001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">
                        Status penduduk <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="status"
                        name="status"
                        value={formValues.status}
                        onChange={(event) =>
                          handleSelectChange("status")(event.target.value)
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        {STATUS_PENDUDUK_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="no_akta_lahir">No. akta lahir</Label>
                      <Input
                        id="no_akta_lahir"
                        name="no_akta_lahir"
                        value={formValues.no_akta_lahir}
                        onChange={handleInputChange}
                        placeholder="Masukkan nomor akta lahir"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="umur">Umur</Label>
                      <Input
                        id="umur"
                        name="umur"
                        type="number"
                        min={0}
                        value={formValues.umur}
                        onChange={handleInputChange}
                        placeholder="Contoh: 34"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFormClose}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
