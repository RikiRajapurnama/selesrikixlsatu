"use client";

import {
  Wifi,
  Zap,
  Wallet,
  Settings,
  Headphones,
  Play,
  Gamepad2,
  Smartphone,
  BadgePercent,
  LifeBuoy,
  Shield,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Wifi,
  Zap,
  Wallet,
  Settings,
  Headphones,
  Play,
  Gamepad2,
  Smartphone,
  BadgePercent,
  LifeBuoy,
  Shield,
};

type Benefit = {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  order: number;
};

export default function Benefits({ benefits }: { benefits: Benefit[] }) {
  const mainBenefits = benefits.slice(0, 5);

  return (
    <section id="keunggulan" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-4">
            Keunggulan XL SATU WiFi
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Mengapa Memilih <span className="text-gradient">XL SATU?</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Kami memberikan pengalaman internet terbaik untuk rumah kamu dengan
            berbagai keunggulan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {mainBenefits.map((b, i) => {
            const Icon = ICON_MAP[b.icon || "Wifi"] || Wifi;
            return (
              <div
                key={b.id}
                className="card p-5 sm:p-6 shadow-hover animate-slide-up text-center"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center text-white mb-4 shadow-card">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-dark text-base mb-1.5">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}