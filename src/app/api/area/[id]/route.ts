import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const existing = await prisma.serviceArea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Area tidak ditemukan." }, { status: 404 });
    }

    const { city, district, description, isActive } = body || {};

    const area = await prisma.serviceArea.update({
      where: { id },
      data: {
        city: city !== undefined ? String(city).trim() : existing.city,
        district: district !== undefined ? district || null : existing.district,
        description: description !== undefined ? description || null : existing.description,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    revalidatePath("/");
    return NextResponse.json(area);
  } catch (error) {
    console.error("Area PUT error:", error);
    return NextResponse.json({ error: "Gagal mengupdate area." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.serviceArea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Area tidak ditemukan." }, { status: 404 });
    }
    await prisma.serviceArea.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Area DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus area." }, { status: 500 });
  }
}