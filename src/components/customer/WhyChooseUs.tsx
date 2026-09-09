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

export default function WhyChooseUs({ benefits }: { benefits: Benefit[] }) {
  const why = benefits.slice(5);

  if (why.length === 0) return null;

  const validItems = why.filter((b) => b.title && b.description);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Mengapa Harus Pilih <span className="text-gradient">XL SATU?</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Alasan ribuan keluarga mempercayakan internet rumah mereka kepada
            kami.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {validItems.map((b, i) => {
            const Icon = ICON_MAP[b.icon || "Wifi"] || Wifi;
            return (
              <div
                key={b.id}
                className="card p-5 sm:p-6 shadow-hover animate-slide-up group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:bg-gradient-brand group-hover:text-white transition-all duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark text-base mb-1">{b.title}</h3>
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