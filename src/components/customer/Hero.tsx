"use client";

import { MessageCircle, ArrowRight, Zap, Star, BadgeCheck } from "lucide-react";
import { waLink } from "@/lib/utils";

type HeroProps = {
  banner?: {
    title: string;
    subtitle: string;
    badge: string;
    ctaText: string;
    ctaSecondary: string;
    image?: string | null;
  } | null;
  whatsappNumber: string;
};

export default function Hero({ banner, whatsappNumber }: HeroProps) {
  const title = banner?.title || "Nikmati Internet Rumah Super Cepat dengan XL SATU WiFi";
  const subtitle =
    banner?.subtitle ||
    "Solusi internet rumah untuk keluarga, belajar, bekerja, streaming, gaming, dan hiburan tanpa batas.";
  const badge = banner?.badge || "Internet Cepat • Stabil • Terjangkau";
  const ctaText = banner?.ctaText || "Chat WhatsApp";
  const ctaSecondary = banner?.ctaSecondary || "Daftar Sekarang";

  const waUrl = waLink(
    whatsappNumber,
    "Halo Kak Riki, saya tertarik dengan paket XL SATU WiFi. Bisa minta informasi paket yang tersedia?"
  );

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center pt-24 pb-14 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-hero -z-10" />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-blob -z-10" />
      <div className="absolute bottom-10 -left-10 w-80 h-80 bg-green/25 rounded-full blur-3xl animate-blob -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center w-full">
        <div className="text-white animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-medium backdrop-blur-sm mb-6">
            <BadgeCheck size={16} className="text-green-300" />
            {badge}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-extrabold leading-tight lg:leading-[1.15] mb-5">
            {title.split(" dengan ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300">
              {" "}
              {title.includes(" dengan ")
                ? title.split(" dengan ")[1]
                : "XL SATU WiFi"}
            </span>
          </h1>

          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn !bg-green !text-white !py-3.5 !px-7 text-base !rounded-xl hover:!shadow-[0_12px_30px_rgba(0,184,148,0.4)]"
            >
              <MessageCircle size={20} />
              {ctaText}
            </a>
            <a
              href="#paket"
              className="btn !bg-white/15 backdrop-blur-sm !text-white !py-3.5 !px-7 text-base !rounded-xl border border-white/25 hover:!bg-white/25"
            >
              {ctaSecondary}
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10">
            <div className="flex items-center gap-2">
              <span className="flex text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </span>
              <span className="text-sm text-white/85">Dipercaya Pelanggan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/85">
              <Zap size={18} className="text-yellow-300" />
              Pemasangan Cepat
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md lg:max-w-lg animate-float">
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/25 p-6 sm:p-8 shadow-2xl">
              <div className="rounded-2xl bg-gradient-to-b from-[#0057b8] to-[#00aeef] p-5 text-center">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 border border-white/25 mb-3">
                  <Zap size={32} className="text-white" />
                </span>
                <p className="text-white font-bold text-lg">Router XL SATU WiFi</p>
                <p className="text-white/80 text-sm">
                  Kecepatan hingga 400 Mbps
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5 text-center">
                {[
                  { v: "≥94%", l: "Koneksi Stabil" },
                  { v: "24/7", l: "Bebas Worry" },
                  { v: "400M", l: "Max Speed" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="bg-white/10 rounded-xl border border-white/15 py-3"
                  >
                    <p className="text-white font-bold text-lg sm:text-xl">{s.v}</p>
                    <p className="text-white/75 text-[11px] sm:text-xs">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}