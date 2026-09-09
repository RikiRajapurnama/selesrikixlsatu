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
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Paket tidak ditemukan." }, { status: 404 });
    }

    const { name, speed, price, oldPrice, description, badge, isOneTime, isActive, order } = body || {};

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        name: name !== undefined ? String(name).trim() : existing.name,
        speed: speed !== undefined ? String(speed).trim() : existing.speed,
        price: price !== undefined ? Number(price) : existing.price,
        oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : existing.oldPrice,
        description: description !== undefined ? description || null : existing.description,
        badge: badge !== undefined ? badge || null : existing.badge,
        isOneTime: isOneTime !== undefined ? Boolean(isOneTime) : existing.isOneTime,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Package PUT error:", error);
    return NextResponse.json({ error: "Gagal mengupdate paket." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Paket tidak ditemukan." }, { status: 404 });
    }

    await prisma.package.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Package DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus paket." }, { status: 500 });
  }
}