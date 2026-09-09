"use client";

import Link from "next/link";
import { Wifi, Phone, MessageCircle, Lock } from "lucide-react";
import { waLink } from "@/lib/utils";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";

const FOOTER_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#paket", label: "Paket" },
  { href: "#promo", label: "Promo" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#cara-daftar", label: "Cara Daftar" },
  { href: "#kontak", label: "Kontak" },
];

export default function Footer({
  websiteName = "XL SATU WiFi",
  footerText = "Internet Rumah, Hidup Lebih Lancar",
  whatsappNumber = "083177522021",
  salesName = "Riki",
  salesPhone = "083177522021",
  instagram,
  facebook,
}: {
  websiteName?: string;
  footerText?: string;
  whatsappNumber?: string;
  salesName?: string;
  salesPhone?: string;
  instagram?: string | null;
  facebook?: string | null;
}) {
  const waUrl = waLink(
    whatsappNumber,
    "Halo, saya ingin bertanya tentang XL SATU WiFi."
  );

  return (
    <footer className="bg-[#042c5c] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <a href="#beranda" className="flex items-center gap-2 mb-4">
              <span className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
                <Wifi size={24} />
              </span>
              <span className="font-extrabold text-lg">{websiteName}</span>
            </a>
            <p className="text-sm text-blue-200/80 mb-5">{footerText}</p>
            <div className="flex gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl bg-green/80 hover:bg-green flex items-center justify-center transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-5">Menu</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-blue-200/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-5">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-xs text-blue-200/70">Sales</p>
                  <p className="text-sm font-semibold">{salesName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={16} />
                </span>
                <div>
                  <p className="text-xs text-blue-200/70">WhatsApp</p>
                  <p className="text-sm font-semibold">{salesPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-blue-200/70">
            © {new Date().getFullYear()} {websiteName}. All rights reserved.
          </p>
          <p className="text-xs text-blue-200/70">
            Developed by <span className="text-white font-medium">Sales {salesName}</span>
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-blue-200/70 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <Lock size={12} />
            Login Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}