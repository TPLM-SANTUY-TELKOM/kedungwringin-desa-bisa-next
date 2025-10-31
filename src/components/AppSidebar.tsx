"use client";

import { Home, Users, FileText, LogOut, Building2, Inbox } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
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

  const getNavCls = (active: boolean) =>
    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "";

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Building2 className="h-6 w-6 text-sidebar-accent-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Desa Kedungwringin</h2>
            <p className="text-xs text-sidebar-foreground/70">Sistem Layanan Terpadu</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sidebar-foreground/70 text-sm font-medium px-2 mb-2">Menu Utama</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                // Skip admin-only items if user is not admin
                if (item.adminOnly && !isAdmin) return null;
                
                const active = isActive(item.url);
                
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${getNavCls(active)}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-sidebar-foreground">admin@kedungwringin.desa.id</p>
          <p className="text-xs text-sidebar-foreground/70">Administrator</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => {
            // Handle logout
            window.location.href = "/admin";
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
