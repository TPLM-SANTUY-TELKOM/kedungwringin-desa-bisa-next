"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Simulasi login sederhana
        if (email === "admin@kedungwringin.desa.id" && password === "admin123") {
          toast({
            title: "Login Berhasil",
            description: "Selamat datang kembali!",
          });
          // Redirect ke dashboard (akan dibuat nanti)
          router.push("/dashboard");
        } else {
          toast({
            title: "Login Gagal",
            description: "Email atau password salah",
            variant: "destructive",
          });
        }
      } else {
        // Simulasi registrasi sederhana
        if (!fullName.trim()) {
          toast({
            title: "Nama Lengkap Wajib Diisi",
            description: "Silakan isi nama lengkap Anda",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Pendaftaran Berhasil",
          description: "Akun Anda telah dibuat. Silakan login.",
        });
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Sistem Layanan Desa Kedungwringin
            </CardTitle>
            <CardDescription className="mt-2">
              {isLogin ? "Masuk ke sistem" : "Daftar akun baru"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kedungwringin.desa.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </button>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>Demo Login:</strong><br />
              Email: admin@kedungwringin.desa.id<br />
              Password: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
