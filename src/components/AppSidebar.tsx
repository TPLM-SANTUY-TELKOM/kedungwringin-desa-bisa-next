"use client";

import { Home, Users, FileText, LogOut, Inbox, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoDesa from "@/assets/ic_logo_banyumas.png";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Data Penduduk", url: "/penduduk", icon: Users, adminOnly: true },
  { title: "Buat Surat", url: "/surat", icon: FileText },
  { title: "Surat Masuk", url: "/surat-masuk", icon: Inbox },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isAdmin = true; // Sementara hardcode sebagai admin

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const getNavCls = (active: boolean) => {
    if (active) {
      return "bg-sidebar-accent text-sidebar-accent-foreground shadow-md font-semibold";
    }
    return "bg-muted/30 hover:bg-muted/60 hover:text-sidebar-foreground text-sidebar-foreground/70 border border-transparent hover:border-sidebar-border/50";
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center p-2 shadow-sm border border-sidebar-border">
            <Image
              src={logoDesa}
              alt="Logo Desa Kedungwringin"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Desa Kedungwringin</h2>
            <p className="text-xs text-sidebar-foreground/70">Sistem Layanan Terpadu</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sidebar-foreground/70 text-sm font-medium px-2 mb-2">Menu Utama</h3>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                // Skip admin-only items if user is not admin
                if (item.adminOnly && !isAdmin) return null;
                
                const active = isActive(item.url);
                
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${getNavCls(active)}`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-sidebar-border p-4 space-y-2">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-sidebar-foreground">admin@kedungwringin.desa.id</p>
          <p className="text-xs text-sidebar-foreground/70">Administrator</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-muted/30 hover:bg-muted/60 hover:text-sidebar-foreground text-sidebar-foreground/70 border border-transparent hover:border-sidebar-border/50"
        >
          <Globe className="h-5 w-5 shrink-0" />
          <span>Halaman Utama</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => {
            // Handle logout
            window.location.href = "/admin";
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
