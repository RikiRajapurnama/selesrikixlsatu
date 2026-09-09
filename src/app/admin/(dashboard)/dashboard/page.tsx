import Link from "next/link";
import {
  Wifi,
  Package,
  Gift,
  Users,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [stats, recentRegistrations] = await Promise.all([
    prisma.$transaction([
      prisma.package.count(),
      prisma.package.count({ where: { isActive: true } }),
      prisma.promo.count(),
      prisma.promo.count({ where: { isActive: true } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "baru" } }),
      prisma.serviceArea.count(),
      prisma.benefit.count(),
    ]),
    prisma.registration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { package: true },
    }),
  ]);

  const [
    totalPackages,
    activePackages,
    totalPromos,
    activePromos,
    totalRegistrations,
    newRegistrations,
    totalAreas,
    totalBenefits,
  ] = stats;

  const cards = [
    {
      title: "Total Paket",
      value: totalPackages,
      sub: `${activePackages} aktif`,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      href: "/admin/packages",
    },
    {
      title: "Promo",
      value: totalPromos,
      sub: `${activePromos} aktif`,
      icon: Gift,
      color: "from-red-500 to-red-600",
      href: "/admin/promo",
    },
    {
      title: "Total Pendaftaran",
      value: totalRegistrations,
      sub: `${newRegistrations} baru`,
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      href: "/admin/registrations",
    },
    {
      title: "Area Layanan",
      value: totalAreas,
      sub: `${totalBenefits} keunggulan`,
      icon: MapPin,
      color: "from-cyan-500 to-cyan-600",
      href: "/admin/areas",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-7">
        <span className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
          <Sparkles size={20} />
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-dark">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">Ringkasan website & sales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="card p-5 shadow-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}
                >
                  <Icon size={22} />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-primary transition-colors"
                />
              </div>
              <p className="text-2xl font-extrabold text-dark">{card.value}</p>
              <p className="text-sm text-slate-500 font-medium">{card.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-dark flex items-center gap-2">
            <Users size={18} className="text-primary" />
            Pendaftaran Terbaru
          </h2>
          <Link
            href="/admin/registrations"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        {recentRegistrations.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            Belum ada pendaftaran.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                  <th className="pb-3 pr-4 font-medium">Nama</th>
                  <th className="pb-3 pr-4 font-medium">WhatsApp</th>
                  <th className="pb-3 pr-4 font-medium">Paket</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium text-dark">{r.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{r.phone}</td>
                    <td className="py-3 pr-4 text-slate-600">
                      {r.package?.name || "-"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          r.status === "baru"
                            ? "bg-blue-50 text-blue-600"
                            : r.status === "dihubungi"
                            ? "bg-amber-50 text-amber-600"
                            : r.status === "diproses"
                            ? "bg-violet-50 text-violet-600"
                            : r.status === "selesai"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}