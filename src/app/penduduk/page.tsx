"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { db } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  kewarganegaraan?: "WNI" | "WNA";
  nama_ayah?: string | null;
  nama_ibu?: string | null;
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
  no_paspor?: string | null;
  no_kitap?: string | null;
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
  nama_ayah: string;
  nama_ibu: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: PendudukData["jenis_kelamin"] | "";
  golongan_darah: NonNullable<PendudukData["golongan_darah"]> | "";
  agama: PendudukData["agama"] | "";
  kewarganegaraan: "WNI" | "WNA" | "";
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
  no_paspor: string;
  no_kitap: string;
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

const PENDIDIKAN_OPTIONS = [
  "Tidak/Belum Sekolah",
  "Belum Tamat SD/Sederajat",
  "Tamat SD/Sederajat",
  "SLTP/Sederajat",
  "SLTA/Sederajat",
  "Diploma I/II",
  "Akademi/Diploma III/S.Muda",
  "Diploma IV/Strata I",
  "Strata II",
  "Strata III",
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

type RekapFilter =
  | "all"
  | "cerai-hidup-laki"
  | "cerai-hidup-perempuan"
  | "cerai-mati-laki"
  | "cerai-mati-perempuan";

const REKAP_FILTER_CONFIG: Record<
  Exclude<RekapFilter, "all">,
  { status: Extract<StatusKawin, "Cerai Hidup" | "Cerai Mati">; gender: PendudukData["jenis_kelamin"] }
> = {
  "cerai-hidup-laki": { status: "Cerai Hidup", gender: "Laki-laki" },
  "cerai-hidup-perempuan": { status: "Cerai Hidup", gender: "Perempuan" },
  "cerai-mati-laki": { status: "Cerai Mati", gender: "Laki-laki" },
  "cerai-mati-perempuan": { status: "Cerai Mati", gender: "Perempuan" },
};

const defaultFormValues: PendudukFormValues = {
  nik: "",
  no_kk: "",
  nama: "",
  nama_ayah: "",
  nama_ibu: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  golongan_darah: "",
  agama: "",
  kewarganegaraan: "WNI",
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
  no_paspor: "",
  no_kitap: "",
};

const toFormValues = (data: PendudukData): PendudukFormValues => ({
  nik: data.nik ?? "",
  no_kk: data.no_kk ?? "",
  nama: data.nama ?? "",
  nama_ayah: data.nama_ayah ?? "",
  nama_ibu: data.nama_ibu ?? "",
  tempat_lahir: data.tempat_lahir ?? "",
  tanggal_lahir: data.tanggal_lahir ? data.tanggal_lahir.slice(0, 10) : "",
  jenis_kelamin: data.jenis_kelamin ?? "",
  golongan_darah: data.golongan_darah ?? "",
  agama: data.agama ?? "",
  kewarganegaraan: data.kewarganegaraan ?? "WNI",
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
  no_paspor: data.no_paspor ?? "",
  no_kitap: data.no_kitap ?? "",
});

export default function PendudukPage() {
  const [pendudukList, setPendudukList] = useState<PendudukData[]>([]);
  const [filteredList, setFilteredList] = useState<PendudukData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rekapFilter, setRekapFilter] = useState<RekapFilter>("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<PendudukData | null>(null);
  const [formValues, setFormValues] =
    useState<PendudukFormValues>(defaultFormValues);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAdmin = true; // Sementara hardcode sebagai admin
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "custom">(10);
  const [customItemsPerPage, setCustomItemsPerPage] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const rekapCounts = useMemo(() => {
    const counts = {
      total: pendudukList.length,
      ceraiHidup: {
        "Laki-laki": 0,
        Perempuan: 0,
      } as Record<PendudukData["jenis_kelamin"], number>,
      ceraiMati: {
        "Laki-laki": 0,
        Perempuan: 0,
      } as Record<PendudukData["jenis_kelamin"], number>,
    };

    for (const penduduk of pendudukList) {
      if (penduduk.status_kawin === "Cerai Hidup") {
        counts.ceraiHidup[penduduk.jenis_kelamin] += 1;
      } else if (penduduk.status_kawin === "Cerai Mati") {
        counts.ceraiMati[penduduk.jenis_kelamin] += 1;
      }
    }

    return counts;
  }, [pendudukList]);

  const getRekapLabel = (value: RekapFilter) => {
    switch (value) {
      case "cerai-hidup-laki":
        return `Cerai Hidup · Laki-laki (${rekapCounts.ceraiHidup["Laki-laki"]})`;
      case "cerai-hidup-perempuan":
        return `Cerai Hidup · Perempuan (${rekapCounts.ceraiHidup.Perempuan})`;
      case "cerai-mati-laki":
        return `Cerai Mati · Laki-laki (${rekapCounts.ceraiMati["Laki-laki"]})`;
      case "cerai-mati-perempuan":
        return `Cerai Mati · Perempuan (${rekapCounts.ceraiMati.Perempuan})`;
      default:
        return `Semua (${rekapCounts.total})`;
    }
  };

  const filterPenduduk = (
    query: string,
    list: PendudukData[],
    rekap: RekapFilter
  ) => {
    const trimmed = query.trim();
    const lowered = trimmed.toLowerCase();

    const baseList =
      trimmed === ""
        ? list
        : list.filter(
            (p) =>
              p.nama.toLowerCase().includes(lowered) ||
              p.nik.includes(trimmed)
          );

    if (rekap === "all") return baseList;

    const { status, gender } = REKAP_FILTER_CONFIG[rekap];

    return baseList.filter(
      (penduduk) =>
        penduduk.status_kawin === status && penduduk.jenis_kelamin === gender
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
    setFilteredList(filterPenduduk(searchQuery, pendudukList, rekapFilter));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchQuery, pendudukList, rekapFilter]);

  // Pagination calculations
  const actualItemsPerPage = useMemo(() => {
    if (itemsPerPage === "custom") {
      const custom = parseInt(customItemsPerPage);
      return isNaN(custom) || custom < 1 ? 10 : custom;
    }
    return itemsPerPage;
  }, [itemsPerPage, customItemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredList.length / actualItemsPerPage);
  }, [filteredList.length, actualItemsPerPage]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * actualItemsPerPage;
    const endIndex = startIndex + actualItemsPerPage;
    return filteredList.slice(startIndex, endIndex);
  }, [filteredList, currentPage, actualItemsPerPage]);

  const paginationInfo = useMemo(() => {
    const start = filteredList.length === 0 ? 0 : (currentPage - 1) * actualItemsPerPage + 1;
    const end = Math.min(currentPage * actualItemsPerPage, filteredList.length);
    return { start, end };
  }, [currentPage, actualItemsPerPage, filteredList.length]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table
      tableContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true);
      setItemsPerPage("custom");
    } else {
      setShowCustomInput(false);
      setItemsPerPage(parseInt(value));
      setCurrentPage(1);
    }
  };

  // Handle custom items per page input
  const handleCustomItemsPerPageChange = (value: string) => {
    setCustomItemsPerPage(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = tableContainer;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

      // Update shadow indicators using data attributes
      if (canScrollLeft) {
        tableContainer.setAttribute('data-scroll-left', 'true');
      } else {
        tableContainer.setAttribute('data-scroll-left', 'false');
      }

      if (canScrollRight) {
        tableContainer.setAttribute('data-scroll-right', 'true');
      } else {
        tableContainer.setAttribute('data-scroll-right', 'false');
      }
    };

    // Initial check
    handleScroll();

    tableContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      tableContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [filteredList]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setSearchQuery(trimmed);
    setFilteredList(filterPenduduk(trimmed, pendudukList, rekapFilter));
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

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
    
    // Validasi untuk NIK dan No. KK - hanya angka
    if (name === "nik" || name === "no_kk") {
      const numericValue = value.replace(/\D/g, ""); // Hapus semua karakter non-digit
      setFormValues((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    // Auto-calculate umur when tanggal_lahir changes
    if (name === "tanggal_lahir") {
      const age = calculateAge(value);
      setFormValues((prev) => ({ ...prev, [name]: value, umur: String(age) }));
      return;
    }
    
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
      nama_ayah: formValues.nama_ayah.trim() || null,
      nama_ibu: formValues.nama_ibu.trim() || null,
      tempat_lahir: formValues.tempat_lahir.trim(),
      tanggal_lahir: formValues.tanggal_lahir,
      jenis_kelamin: formValues.jenis_kelamin as PendudukData["jenis_kelamin"],
      agama: formValues.agama as PendudukData["agama"],
      kewarganegaraan:
        (formValues.kewarganegaraan as "WNI" | "WNA") || "WNI",
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
      no_paspor: formValues.no_paspor.trim() || null,
      no_kitap: formValues.no_kitap.trim() || null,
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
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
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status Perkawinan
                </label>
                <Select
                  value={rekapFilter}
                  onValueChange={(value) => setRekapFilter(value as RekapFilter)}
                >
                  <SelectTrigger className="h-14 w-[260px] rounded-full border-2 border-foreground/80 px-6 text-base">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{getRekapLabel("all")}</SelectItem>
                    <SelectItem value="cerai-hidup-laki">
                      {getRekapLabel("cerai-hidup-laki")}
                    </SelectItem>
                    <SelectItem value="cerai-hidup-perempuan">
                      {getRekapLabel("cerai-hidup-perempuan")}
                    </SelectItem>
                    <SelectItem value="cerai-mati-laki">
                      {getRekapLabel("cerai-mati-laki")}
                    </SelectItem>
                    <SelectItem value="cerai-mati-perempuan">
                      {getRekapLabel("cerai-mati-perempuan")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => openForm()}
                className="h-14 rounded-full px-8 text-base font-semibold gap-2 border-0 text-white md:self-end"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #FC5132 0%, #FC5132 100%)",
                  boxShadow:
                    "2.42px 2.42px 4.83px 0px #BDC2C7BF, 4.83px 4.83px 7.25px 0px #BDC2C740, -2.42px -2.42px 4.83px 0px #FFFFFFBF, -4.83px -4.83px 7.25px 0px #FFFFFF40, inset 2.42px 2.42px 4.83px 0px #FFFFFFBF, inset 4.83px 4.83px 7.25px 0px #FFFFFF40, inset -2.42px -2.42px 4.83px 0px #FC5132BF, inset -4.83px -4.83px 7.25px 0px #FC513240",
                }}
              >
                <Plus className="h-5 w-5 text-white" />
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
            <div 
              ref={tableContainerRef}
              className="overflow-x-auto rounded-xl border border-border scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
            >
              <table className="min-w-[1500px] w-full text-sm">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th className="sticky left-0 z-30 bg-muted p-4 text-center font-semibold whitespace-nowrap border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)] min-w-[60px] w-[60px]">
                      No
                    </th>
                    <th className="sticky left-[60px] z-30 bg-muted p-4 text-left font-semibold whitespace-nowrap border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)] min-w-[140px]">
                      NIK
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      No. KK
                    </th>
                    <th className="sticky left-[200px] z-30 bg-muted p-4 text-left font-semibold whitespace-nowrap border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)] min-w-[180px]">
                      Nama
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Nama Ayah
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Nama Ibu
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      TTL
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      JK
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Gol. Darah
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Agama
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Kewarganegaraan
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Pendidikan
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Pekerjaan
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Status Kawin
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Status Perkawinan
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Alamat lengkap
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      No. Akta Lahir
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      No. Paspor
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      No. KITAP
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Umur
                    </th>
                    <th className="p-4 text-left font-semibold whitespace-nowrap">
                      Status
                    </th>
                    <th className="sticky right-0 z-30 bg-muted p-4 text-center font-semibold border-l border-border min-w-[120px] w-[120px] shadow-[-2px_0_4px_rgba(0,0,0,0.1)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedList.map((penduduk, index) => {
                    const rowNumber = (currentPage - 1) * actualItemsPerPage + index + 1;
                    return (
                    <tr key={penduduk.id} className="group hover:bg-muted/30">
                      <td className="sticky left-0 z-20 bg-background p-4 text-center font-semibold align-top group-hover:bg-muted border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)] min-w-[60px] w-[60px]">
                        {rowNumber}
                      </td>
                      <td className="sticky left-[60px] z-20 bg-background p-4 font-mono text-xs uppercase tracking-wide align-top group-hover:bg-muted border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)] min-w-[140px]">
                        {penduduk.nik}
                      </td>
                      <td className="p-4 align-top">
                        <span className="font-mono text-xs uppercase tracking-wide">
                          {penduduk.no_kk || "-"}
                        </span>
                      </td>
                      <td className="sticky left-[200px] z-20 bg-background p-4 font-semibold align-top group-hover:bg-muted border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)] min-w-[180px]">
                        {penduduk.nama}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.nama_ayah || "-"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.nama_ibu || "-"}
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex flex-col">
                          <span className="capitalize">
                            {penduduk.tempat_lahir}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTanggal(penduduk.tanggal_lahir)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.jenis_kelamin}
                      </td>
                      <td className="p-4 uppercase align-top">
                        {penduduk.golongan_darah
                          ? penduduk.golongan_darah
                          : "-"}
                      </td>
                      <td className="p-4 align-top">{penduduk.agama}</td>
                      <td className="p-4 align-top">
                        {penduduk.kewarganegaraan ?? "WNI"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.pendidikan || "-"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.pekerjaan || "-"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.status_kawin}
                      </td>
                      <td className="p-4 align-top">
                        {resolveStatusPerkawinan(penduduk)}
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex flex-col">
                          <span>{penduduk.alamat}</span>
                          <span className="text-xs text-muted-foreground">
                            Dusun {penduduk.dusun || "-"} · RT{" "}
                            {penduduk.rt || "-"} / RW {penduduk.rw || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.no_akta_lahir || "-"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.no_paspor || "-"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.no_kitap || "-"}
                      </td>
                      <td className="p-4 align-top">
                        {penduduk.umur ?? "-"}
                      </td>
                      <td className="p-4 align-top">
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
                      <td className="sticky right-0 z-20 bg-background p-4 group-hover:bg-muted border-l border-border min-w-[120px] w-[120px] shadow-[-2px_0_4px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center justify-center gap-2 flex-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(penduduk)}
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(penduduk.id!)}
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          {!loading && filteredList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
              {/* Items per page selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground whitespace-nowrap">
                  Tampilkan:
                </label>
                <div className="flex items-center gap-2">
                  <Select
                    value={itemsPerPage === "custom" ? "custom" : String(itemsPerPage)}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-[100px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomInput && (
                    <Input
                      type="number"
                      min="1"
                      value={customItemsPerPage}
                      onChange={(e) => handleCustomItemsPerPageChange(e.target.value)}
                      placeholder="Jumlah"
                      className="w-20 h-9"
                    />
                  )}
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    per halaman
                  </span>
                </div>
              </div>

              {/* Page info */}
              <div className="text-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{paginationInfo.start}</span> -{" "}
                <span className="font-semibold text-foreground">{paginationInfo.end}</span> dari{" "}
                <span className="font-semibold text-foreground">{filteredList.length}</span> data
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Page numbers */}
                {totalPages > 0 && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-9 w-9 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
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
                        inputMode="numeric"
                        pattern="[0-9]*"
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
                        inputMode="numeric"
                        pattern="[0-9]*"
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
                      <Label htmlFor="nama_ayah">Nama ayah</Label>
                      <Input
                        id="nama_ayah"
                        name="nama_ayah"
                        value={formValues.nama_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama ayah"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama_ibu">Nama ibu</Label>
                      <Input
                        id="nama_ibu"
                        name="nama_ibu"
                        value={formValues.nama_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama ibu"
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
                      <Label htmlFor="kewarganegaraan">Kewarganegaraan</Label>
                      <select
                        id="kewarganegaraan"
                        name="kewarganegaraan"
                        value={formValues.kewarganegaraan}
                        onChange={(event) =>
                          handleSelectChange("kewarganegaraan")(event.target.value)
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pendidikan">Pendidikan</Label>
                      <Select
                        value={formValues.pendidikan}
                        onValueChange={handleSelectChange("pendidikan")}
                      >
                        <SelectTrigger id="pendidikan">
                          <SelectValue placeholder="Pilih pendidikan" />
                        </SelectTrigger>
                        <SelectContent>
                          {PENDIDIKAN_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="no_paspor">No. paspor (opsional)</Label>
                      <Input
                        id="no_paspor"
                        name="no_paspor"
                        value={formValues.no_paspor}
                        onChange={handleInputChange}
                        placeholder="Masukkan nomor paspor (jika ada)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="no_kitap">No. KITAP (opsional)</Label>
                      <Input
                        id="no_kitap"
                        name="no_kitap"
                        value={formValues.no_kitap}
                        onChange={handleInputChange}
                        placeholder="Masukkan nomor KITAP (jika ada)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="umur">Umur (otomatis)</Label>
                      <Input
                        id="umur"
                        name="umur"
                        type="number"
                        min={0}
                        value={formValues.umur}
                        onChange={handleInputChange}
                        placeholder="Otomatis dari tanggal lahir"
                        readOnly
                        disabled
                        className="bg-muted cursor-not-allowed"
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
