"use client";

import { ClipboardList, Phone, FileText, CalendarCheck, PlugZap } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Pilih Paket",
    desc: "Pilih paket XL SATU WiFi yang sesuai dengan kebutuhanmu",
  },
  {
    icon: Phone,
    title: "Hubungi Sales",
    desc: "Chat WhatsApp untuk informasi lebih lanjut",
  },
  {
    icon: FileText,
    title: "Isi Data Pendaftaran",
    desc: "Lengkapi data diri untuk proses pendaftaran",
  },
  {
    icon: CalendarCheck,
    title: "Tentukan Jadwal Pemasangan",
    desc: "Atur jadwal pemasangan sesuai keinginanmu",
  },
  {
    icon: PlugZap,
    title: "Internet Siap Digunakan",
    desc: "Nikmati internet rumah super cepat tanpa hambatan",
  },
];

export default function HowToOrder() {
  return (
    <section id="cara-daftar" className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-4">
            Mudah & Praktis
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Cara <span className="text-gradient">Daftar</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Daftar XL SATU WiFi sangat mudah, cukup ikuti langkah berikut:
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[35px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-secondary to-green rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={i}
                  className="relative card p-5 text-center shadow-hover animate-slide-up"
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  <div className="relative mx-auto w-fit">
                    <div className="w-[70px] h-[70px] rounded-2xl bg-gradient-brand flex items-center justify-center text-white mx-auto shadow-card">
                      <StepIcon size={28} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-green text-green text-xs font-bold flex items-center justify-center shadow">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-dark text-sm mt-4 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}