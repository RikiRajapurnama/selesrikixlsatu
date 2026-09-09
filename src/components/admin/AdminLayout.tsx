"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  Wifi,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  MessageSquare,
  Settings as SettingsIcon,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/promo", label: "Promo", icon: Gift },
  { href: "/admin/packages", label: "Paket WiFi", icon: Wifi },
  { href: "/admin/banner", label: "Banner", icon: ImageIcon },
  { href: "/admin/benefits", label: "Keunggulan", icon: Sparkles },
  { href: "/admin/areas", label: "Area Layanan", icon: MapPin },
  { href: "/admin/registrations", label: "Pendaftaran", icon: MessageSquare },
  { href: "/admin/settings", label: "Pengaturan Website", icon: SettingsIcon },
  { href: "/admin/profile", label: "Profil Sales", icon: UserRound },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
          <Wifi size={22} />
        </span>
        <div className="leading-tight">
          <p className="font-bold text-white text-sm">XL SATU WiFi</p>
          <p className="text-blue-200/60 text-xs">Admin Dashboard</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-sidebar-link ${active ? "active" : ""}`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-link"
        >
          <Wifi size={18} />
          Lihat Website
        </Link>
        <button onClick={handleLogout} className="admin-sidebar-link w-full text-left">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 admin-sidebar z-40">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 admin-sidebar animate-slide-up">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white">
            <Wifi size={18} />
          </span>
          <div className="leading-tight">
            <p className="font-bold text-dark text-sm">XL SATU WiFi</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>

      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}