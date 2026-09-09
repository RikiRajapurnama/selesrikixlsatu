"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Wifi, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#paket", label: "Paket XL WiFi" },
  { href: "#promo", label: "Promo" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#cara-daftar", label: "Cara Daftar" },
  { href: "#area", label: "Area Layanan" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar({
  websiteName = "XL SATU WiFi",
  whatsappNumber = "083177522021",
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waUrl = waLink(
    whatsappNumber,
    "Halo Kak Riki, saya tertarik dengan paket XL SATU WiFi. Bisa minta informasi paket yang tersedia?"
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/95 backdrop-blur-md shadow-soft py-2"
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#beranda" className="flex items-center gap-2 shrink-0">
          <span className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-cloud">
            <Wifi size={22} />
          </span>
          <div className="leading-tight">
            <span className="font-extrabold text-base sm:text-lg text-dark block">
              {websiteName}
            </span>
            <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
              Internet Rumah Super Cepat
            </span>
          </div>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-primary hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn btn-green !px-4 !py-2.5 !text-sm"
          >
            <MessageCircle size={16} />
            Daftar Sekarang
          </a>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 text-primary hover:bg-blue-100 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-white z-40 overflow-y-auto animate-fade-in">
          <div className="p-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3.5 rounded-xl text-slate-700 font-medium hover:bg-blue-50 hover:text-primary transition-colors border-b border-slate-50"
              >
                {link.label}
              </a>
            ))}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 btn btn-green w-full"
            >
              <MessageCircle size={18} />
              Daftar Sekarang
            </a>
            <p className="text-center text-xs text-slate-400 mt-4">
              Sales: Riki • {whatsappNumber}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}