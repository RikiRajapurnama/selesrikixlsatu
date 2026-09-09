"use client";

import { Gift, Clock, BadgePercent, ArrowRight, Sparkles } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

type Promo = {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string | null;
  badge?: string | null;
  image?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export default function PromoSection({ promos }: { promos: Promo[] }) {
  if (promos.length === 0) {
    return (
      <section id="promo" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark">
              Promo <span className="text-gradient">XL SATU WiFi</span>
            </h2>
            <p className="text-slate-500 mt-3">
              Belum ada promo saat ini. Cek kembali nanti!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="promo" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-sm font-semibold mb-4">
            <Sparkles size={15} />
            Promo Spesial
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Promo <span className="text-gradient">XL SATU WiFi</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Dapatkan promo terbaik untuk pemasangan baru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promos.map((promo, i) => (
            <div
              key={promo.id}
              className="card overflow-hidden shadow-hover animate-slide-up relative"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {promo.badge && (
                <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                  <BadgePercent size={13} />
                  {promo.badge}
                </span>
              )}

              <div className="bg-gradient-hero p-6 pb-4 relative">
                <div className="absolute -bottom-3 right-6 text-white/10">
                  <Gift size={72} />
                </div>
                <span className="inline-flex items-center gap-2 text-white/85 text-xs font-semibold mb-2">
                  <Clock size={14} />
                  {promo.startDate ? `Berlaku ${promo.startDate}` : "Promo Terbatas"}
                  {promo.endDate ? ` - ${promo.endDate}` : ""}
                </span>
                <h3 className="text-white text-lg sm:text-xl font-bold leading-snug pr-12">
                  {promo.title}
                </h3>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-slate-600 text-sm mb-4">{promo.description}</p>

                <div className="flex items-end gap-2 mb-5">
                  <span className="text-2xl font-extrabold text-primary">
                    {formatRupiah(promo.price)}
                  </span>
                  {promo.oldPrice && (
                    <span className="text-slate-400 line-through text-sm mb-1">
                      {formatRupiah(promo.oldPrice)}
                    </span>
                  )}
                </div>

                <button className="btn btn-outline w-full text-sm">
                  Klaim Promo Ini
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}