import { prisma } from "@/lib/prisma";

export async function getSiteData() {
  const [settings, banner, promos, packages, benefits, areas] =
    await Promise.all([
      prisma.settings.findUnique({ where: { id: "singleton" } }),
      prisma.banner.findFirst({ where: { isActive: true } }),
      prisma.promo.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: [{ isOneTime: "asc" }, { order: "asc" }],
      }),
      prisma.benefit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.serviceArea.findMany({
        where: { isActive: true },
        orderBy: { city: "asc" },
      }),
    ]);

  return {
    settings:
      settings || {
        websiteName: "XL SATU WiFi",
        whatsappNumber: "083177522021",
        footerText: "Internet Rumah, Hidup Lebih Lancar",
        salesName: "Riki",
        salesPhone: "083177522021",
        salesDesc: "Sales XL SATU WiFi",
        logo: null,
        instagram: null,
        facebook: null,
        googleMaps: null,
        salesPhoto: null,
        salesArea: null,
      },
    banner,
    promos,
    packages,
    benefits,
    areas,
  };
}