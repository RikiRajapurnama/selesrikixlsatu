"use client";

import { MessageCircle, Phone, UserRound, BadgeCheck } from "lucide-react";
import { waLink, generateInitials } from "@/lib/utils";

type SalesCardProps = {
  salesName: string;
  salesPhone: string;
  salesDesc: string;
  salesPhoto?: string | null;
};

export function SalesCard({
  salesName,
  salesPhone,
  salesDesc,
  salesPhoto,
}: SalesCardProps) {
  const waUrl = waLink(
    salesPhone,
    `Halo Kak ${salesName}, saya tertarik dengan paket XL SATU WiFi. Bisa minta informasi paket yang tersedia?`
  );

  return (
    <div className="card p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-100">
      <div className="flex items-center gap-1 mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-primary uppercase">
          <BadgeCheck size={14} />
          Hubungi Sales
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-card">
            {salesPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={salesPhoto}
                alt={salesName}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <UserRound size={32} />
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green rounded-full border-2 border-white" />
        </div>
        <div>
          <p className="font-bold text-lg text-dark">{salesName}</p>
          <p className="text-sm text-slate-500">{salesDesc}</p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mt-1">
            <Phone size={14} className="text-green" />
            {salesPhone}
          </p>
        </div>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-green w-full mt-5"
      >
        <MessageCircle size={18} />
        Chat WhatsApp
      </a>
    </div>
  );
}

export function FloatingWhatsApp({ phone }: { phone: string }) {
  const waUrl = waLink(
    phone,
    "Halo Kak Riki, saya tertarik dengan paket XL SATU WiFi. Bisa minta informasi paket yang tersedia?"
  );

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green text-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,184,148,0.4)] hover:scale-110 transition-transform animate-pulse-soft"
    >
      <MessageCircle size={26} />
    </a>
  );
}