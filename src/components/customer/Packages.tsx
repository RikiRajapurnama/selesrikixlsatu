"use client";

import { MessageCircle, Check, Wifi, Star } from "lucide-react";
import { formatRupiah, waLink } from "@/lib/utils";

type PackageItem = {
  id: string;
  name: string;
  speed: string;
  price: number;
  oldPrice?: number | null;
  description?: string | null;
  badge?: string | null;
  isOneTime: boolean;
};

const FEATURES = [
  "Unlimited Kuota Internet",
  "Kecepatan Stabil",
  "Bisa Banyak Perangkat",
  "Garansi Pemasangan",
];

function PackageCard({
  pkg,
  whatsappNumber,
}: {
  pkg: PackageItem;
  whatsappNumber: string;
}) {
  const waUrl = waLink(
    whatsappNumber,
    `Halo Kak Riki, saya tertarik dengan paket XL SATU WiFi ${pkg.name} dengan kecepatan ${pkg.speed}. Saya ingin mendaftar.`
  );

  const isHighlighted = pkg.badge === "BEST SELLER" || pkg.badge === "PALING POPULER";

  return (
    <div
      className={`card p-6 sm:p-7 shadow-hover animate-slide-up relative flex flex-col ${
        isHighlighted ? "border-2 border-primary" : ""
      }`}
    >
      {isHighlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-brand text-white text-xs font-bold shadow-lg whitespace-nowrap">
          <Star size={13} fill="currentColor" />
          {pkg.badge}
        </span>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
            <Wifi size={22} />
          </span>
          <div>
            <h3 className="font-bold text-dark text-base sm:text-lg leading-tight">
              {pkg.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{pkg.speed}</p>
          </div>
        </div>
        {pkg.description && (
          <p className="text-sm text-slate-500 leading-relaxed mt-2">
            {pkg.description}
          </p>
        )}
      </div>

      <div className="mb-5">
        <div className="flex items-end gap-2 flex-wrap">
          <span className="text-3xl font-extrabold text-dark">
            {formatRupiah(pkg.price)}
          </span>
          <span className="text-sm text-slate-400 mb-1">/ bulan</span>
        </div>
        {pkg.oldPrice && (
          <span className="text-slate-400 line-through text-sm block mt-1">
            {formatRupiah(pkg.oldPrice)}
          </span>
        )}
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {FEATURES.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <span className="w-5 h-5 rounded-full bg-green/10 text-green flex items-center justify-center shrink-0">
              <Check size={12} strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary w-full"
      >
        <MessageCircle size={17} />
        Pilih Paket
      </a>
    </div>
  );
}

export default function PackagesSection({
  packages,
  whatsappNumber,
}: {
  packages: PackageItem[];
  whatsappNumber: string;
}) {
  const monthly = packages.filter((p) => !p.isOneTime);

  return (
    <section id="paket" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-4">
            Pilihan Paket
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Pilihan Paket <span className="text-gradient">XL SATU WiFi</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Pilih paket yang paling sesuai dengan kebutuhan internet keluarga
            kamu.
          </p>
        </div>

        {monthly.length === 0 ? (
          <div className="text-center card p-10">
            <p className="text-slate-500">Belum ada paket tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {monthly.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}