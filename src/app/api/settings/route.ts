import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil pengaturan." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const existing = await prisma.settings.findUnique({ where: { id: "singleton" } });

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: {
        websiteName: body.websiteName !== undefined ? String(body.websiteName).trim() : existing?.websiteName,
        logo: body.logo !== undefined ? body.logo || null : existing?.logo,
        whatsappNumber: body.whatsappNumber !== undefined ? String(body.whatsappNumber).trim() : existing?.whatsappNumber,
        instagram: body.instagram !== undefined ? body.instagram || null : existing?.instagram,
        facebook: body.facebook !== undefined ? body.facebook || null : existing?.facebook,
        footerText: body.footerText !== undefined ? String(body.footerText).trim() : existing?.footerText,
        googleMaps: body.googleMaps !== undefined ? body.googleMaps || null : existing?.googleMaps,
        salesName: body.salesName !== undefined ? String(body.salesName).trim() : existing?.salesName,
        salesPhone: body.salesPhone !== undefined ? String(body.salesPhone).trim() : existing?.salesPhone,
        salesPhoto: body.salesPhoto !== undefined ? body.salesPhoto || null : existing?.salesPhoto,
        salesDesc: body.salesDesc !== undefined ? String(body.salesDesc).trim() : existing?.salesDesc,
        salesArea: body.salesArea !== undefined ? body.salesArea || null : existing?.salesArea,
      },
      create: {
        id: "singleton",
        websiteName: String(body.websiteName || "XL SATU WiFi").trim(),
        whatsappNumber: String(body.whatsappNumber || "083177522021").trim(),
        footerText: String(body.footerText || "Internet Rumah, Hidup Lebih Lancar"),
        salesName: String(body.salesName || "Riki").trim(),
        salesPhone: String(body.salesPhone || "083177522021").trim(),
        salesDesc: String(body.salesDesc || "Sales XL SATU WiFi"),
        instagram: body.instagram || null,
        facebook: body.facebook || null,
        googleMaps: body.googleMaps || null,
        logo: body.logo || null,
        salesPhoto: body.salesPhoto || null,
        salesArea: body.salesArea || null,
      },
    });

    revalidatePath("/");
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}