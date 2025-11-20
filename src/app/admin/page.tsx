"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoDesa from "@/assets/ic_logo_banyumas.png";
import bglogin from "@/assets/bg_login.png";
import Image from "next/image";
import { Images, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email === "admin@kedungwringin.desa.id" && password === "admin123") {
        toast({
          title: "Login Berhasil ✅",
          description: "Selamat datang di sistem desa.",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Login Gagal ❌",
          description: "Email atau password salah.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-gray-900">
      {/* BAGIAN KIRI - FORM LOGIN */}
      <div className="flex flex-col justify-center px-10 md:px-16 bg-gray-50 border-r border-gray-200">
        <div className="max-w-md mx-auto w-full space-y-6">
          {/* Tombol Kembali */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Halaman Utama
          </Link>

          {/* Logo & Judul */}
          <div className="flex items-center gap-3">
            <Image
              src={logoDesa}
              alt="Logo Desa Kedungwringin"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
            <h1 className="text-2xl font-bold tracking-tight text-black">
              Desa Kedungwringin
            </h1>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl font-bold mb-2 leading-tight text-gray-900">
              Dashboard Admin
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Halaman login khusus untuk petugas administrasi dan perangkat Desa
              Kedungwringin.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <div>
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            {/* <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-orange-500"
                  defaultChecked
                />
                <span>Ingat saya</span>
              </label>
            </div> */}

            <Button
              type="submit"
              className="mt-4 w-full inline-flex items-center justify-center rounded-[18px] px-6 py-3 text-base font-semibold text-white border-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff6435]/20 focus-visible:ring-offset-4 focus-visible:ring-offset-[#EBEFF3] active:scale-[0.98]"
              disabled={loading}
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, #FC5132 0%, #FC5132 100%)",
                boxShadow:
                  "2.42px 2.42px 4.83px 0px #BDC2C7BF, 4.83px 4.83px 7.25px 0px #BDC2C740, -2.42px -2.42px 4.83px 0px #FFFFFFBF, -4.83px -4.83px 7.25px 0px #FFFFFF40, inset 2.42px 2.42px 4.83px 0px #FFFFFFBF, inset 4.83px 4.83px 7.25px 0px #FFFFFF40, inset -2.42px -2.42px 4.83px 0px #FC5132BF, inset -4.83px -4.83px 7.25px 0px #FC513240",
              }}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center relative bg-gray-100">
        {/* Background Image */}

        <Image
          src={bglogin}
          alt="Logo Desa Kedungwringin"
          width={500}
          height={500}
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
