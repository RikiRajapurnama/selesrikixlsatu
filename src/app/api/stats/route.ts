import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [
      totalPackages,
      activePackages,
      totalPromos,
      activePromos,
      totalRegistrations,
      newRegistrations,
      totalAreas,
      totalBenefits,
    ] = await Promise.all([
      prisma.package.count(),
      prisma.package.count({ where: { isActive: true } }),
      prisma.promo.count(),
      prisma.promo.count({ where: { isActive: true } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "baru" } }),
      prisma.serviceArea.count(),
      prisma.benefit.count(),
    ]);

    return NextResponse.json({
      totalPackages,
      activePackages,
      totalPromos,
      activePromos,
      totalRegistrations,
      newRegistrations,
      totalAreas,
      totalBenefits,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Gagal mengambil statistik." }, { status: 500 });
  }
}