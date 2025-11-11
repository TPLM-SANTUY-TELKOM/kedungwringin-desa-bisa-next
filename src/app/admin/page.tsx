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
import { Images } from "lucide-react";

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

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-orange-500"
                  defaultChecked
                />
                <span>Ingat saya</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all"
              disabled={loading}
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
