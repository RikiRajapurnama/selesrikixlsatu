"use client";

import { MessageCircle, Phone, UserRound } from "lucide-react";
import { waLink } from "@/lib/utils";

export default function CTA({
  salesName,
  salesPhone,
}: {
  salesName: string;
  salesPhone: string;
}) {
  const waUrl = waLink(
    salesPhone,
    `Halo Kak ${salesName}, saya ingin daftar XL SATU WiFi sekarang.`
  );

  return (
    <section id="kontak" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero px-6 py-12 sm:p-14 text-center animate-slide-up">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green/20 rounded-full blur-3xl animate-blob" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Yuk, Segera Daftar <span className="text-gradient">XL SATU WiFi</span>
            </h2>
            <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Internet rumah cepat, stabil dan terjangkau.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-5 py-3.5">
                <span className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
                  <UserRound size={20} />
                </span>
                <div className="text-left">
                  <p className="text-white text-sm">Sales</p>
                  <p className="text-white font-bold">{salesName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-5 py-3.5">
                <span className="w-10 h-10 rounded-xl bg-green flex items-center justify-center text-white">
                  <Phone size={20} />
                </span>
                <div>
                  <p className="text-white/70 text-xs font-medium">WhatsApp</p>
                  <p className="text-white font-bold">{salesPhone}</p>
                </div>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green text-base !px-8 !py-4 !rounded-xl"
            >
              <MessageCircle size={20} />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}