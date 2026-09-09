"use client";

import { MessageCircle, Check, Zap, Coins } from "lucide-react";
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

export default function OneTimePayments({
  packages,
  whatsappNumber,
}: {
  packages: PackageItem[];
  whatsappNumber: string;
}) {
  const oneTime = packages.filter((p) => p.isOneTime);

  if (oneTime.length === 0) return null;

  return (
    <section id="sekali-bayar" className="py-16 sm:py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-blob" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-sm font-semibold mb-4">
            <Coins size={15} />
            Promo Sekali Bayar
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Sekali Bayar, <span className="text-gradient">Lebih Untung!</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Bayar 4 bulan langsung dan dapatkan bonus nonton 3 bulan. Lebih
            hemat untuk internet rumah kamu!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {oneTime.map((pkg, i) => {
            const waUrl = waLink(
              whatsappNumber,
              `Halo Kak Riki, saya tertarik dengan paket XL SATU WiFi ${pkg.name} dengan kecepatan ${pkg.speed}. Saya ingin mendaftar.`
            );
            return (
              <div
                key={pkg.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-slide-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center">
                      <Zap size={24} />
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
                      <p className="text-white/75 text-sm">{pkg.speed}</p>
                    </div>
                  </div>
                  {pkg.badge && (
                    <span className="px-3 py-1 rounded-full bg-green text-white text-[11px] font-bold whitespace-nowrap">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {formatRupiah(pkg.price)}
                  </span>
                  {pkg.oldPrice && (
                    <span className="text-white/50 line-through text-sm mb-1.5">
                      {formatRupiah(pkg.oldPrice)}
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm mb-5">
                  {pkg.description || "Bayar langsung 4 bulan, lebih hemat"}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {[
                    "Bayar 4 bulan langsung",
                    "Bonus Nonton 3 Bulan",
                    "Hemat lebih banyak",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-white/90 text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-green/30 text-green flex items-center justify-center shrink-0">
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
                  className="btn btn-green w-full"
                >
                  <MessageCircle size={17} />
                  Pilih Paket Ini
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}