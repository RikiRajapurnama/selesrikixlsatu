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
    const existing = await prisma.promo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Promo tidak ditemukan." }, { status: 404 });
    }

    const { title, description, price, oldPrice, badge, image, startDate, endDate, isActive, order } = body || {};

    const promo = await prisma.promo.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existing.title,
        description: description !== undefined ? String(description).trim() : existing.description,
        price: price !== undefined ? String(price) : existing.price,
        oldPrice: oldPrice !== undefined ? (oldPrice ? String(oldPrice) : null) : existing.oldPrice,
        badge: badge !== undefined ? badge || null : existing.badge,
        image: image !== undefined ? image || null : existing.image,
        startDate: startDate !== undefined ? startDate || null : existing.startDate,
        endDate: endDate !== undefined ? endDate || null : existing.endDate,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(promo);
  } catch (error) {
    console.error("Promo PUT error:", error);
    return NextResponse.json({ error: "Gagal mengupdate promo." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.promo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Promo tidak ditemukan." }, { status: 404 });
    }

    await prisma.promo.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Promo DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus promo." }, { status: 500 });
  }
}