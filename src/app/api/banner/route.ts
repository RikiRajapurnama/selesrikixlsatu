import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const banner = await prisma.banner.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil banner." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, subtitle, badge, ctaText, ctaSecondary, image, isActive } = body || {};

    let banner;
    if (id) {
      const existing = await prisma.banner.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Banner tidak ditemukan." }, { status: 404 });
      }
      banner = await prisma.banner.update({
        where: { id },
        data: {
          title: title !== undefined ? String(title).trim() : existing.title,
          subtitle: subtitle !== undefined ? String(subtitle).trim() : existing.subtitle,
          badge: badge !== undefined ? String(badge).trim() : existing.badge,
          ctaText: ctaText !== undefined ? String(ctaText).trim() : existing.ctaText,
          ctaSecondary: ctaSecondary !== undefined ? String(ctaSecondary).trim() : existing.ctaSecondary,
          image: image !== undefined ? image || null : existing.image,
          isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        },
      });
    } else {
      banner = await prisma.banner.create({
        data: {
          title: String(title || "Banner Baru"),
          subtitle: String(subtitle || ""),
          badge: String(badge || ""),
          ctaText: String(ctaText || "Chat WhatsApp"),
          ctaSecondary: String(ctaSecondary || "Daftar Sekarang"),
          image: image || null,
          isActive: isActive === undefined ? true : Boolean(isActive),
        },
      });
    }

    revalidatePath("/");
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner error:", error);
    return NextResponse.json({ error: "Gagal menyimpan banner." }, { status: 500 });
  }
}