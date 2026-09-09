import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XL SATU WiFi - Internet Rumah Cepat & Stabil",
  description:
    "Daftar XL SATU WiFi bersama Sales Riki. Pilih paket internet rumah cepat, stabil dan terjangkau.",
  keywords: [
    "XL SATU WiFi",
    "internet rumah",
    "wifi cepat",
    "paket internet",
    "Sales Riki",
    "wifi murah",
  ],
  openGraph: {
    title: "XL SATU WiFi - Internet Rumah Cepat & Stabil",
    description:
      "Daftar XL SATU WiFi bersama Sales Riki. Pilih paket internet rumah cepat, stabil dan terjangkau.",
    type: "website",
    locale: "id_ID",
    siteName: "XL SATU WiFi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let settings = { websiteName: "XL SATU WiFi" };
  try {
    const s = await prisma.settings.findUnique({ where: { id: "singleton" } });
    if (s) settings = s;
  } catch {
    settings = { websiteName: "XL SATU WiFi" };
  }

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0057B8" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}