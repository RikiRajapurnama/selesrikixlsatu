"use client";

import { MapPin, MessageCircle, Building2 } from "lucide-react";
import { waLink } from "@/lib/utils";

type Area = {
  id: string;
  city: string;
  district?: string | null;
  description?: string | null;
};

export default function ServiceAreas({
  areas,
  whatsappNumber,
}: {
  areas: Area[];
  whatsappNumber: string;
}) {
  const grouped = areas.reduce<Record<string, Area[]>>((acc, area) => {
    if (!acc[area.city]) acc[area.city] = [];
    acc[area.city].push(area);
    return acc;
  }, {});

  const waUrl = waLink(
    whatsappNumber,
    "Halo Kak Riki, saya ingin cek ketersediaan area layanan XL SATU WiFi di lokasi saya."
  );

  return (
    <section id="area" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-green text-sm font-semibold mb-4">
            <MapPin size={15} />
            Area Layanan
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Area Layanan <span className="text-gradient">XL SATU WiFi</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Tersedia di berbagai wilayah. Cek ketersediaan area terlebih dahulu.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {areas.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-slate-500">
                Belum ada area layanan yang terdaftar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(grouped).map(([city, cityAreas], i) => (
                <div
                  key={city}
                  className="card p-5 sm:p-6 shadow-hover animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 text-green flex items-center justify-center">
                      <Building2 size={20} />
                    </span>
                    <h3 className="font-bold text-dark">{city}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {cityAreas.map((a) => (
                      <li
                        key={a.id}
                        className="text-sm text-slate-600 flex items-center gap-1.5"
                      >
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        {a.district || a.city}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <MessageCircle size={18} />
              Cek Area Layanan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}