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
    const existing = await prisma.benefit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Keunggulan tidak ditemukan." }, { status: 404 });
    }

    const { title, description, icon, isActive, order } = body || {};

    const benefit = await prisma.benefit.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existing.title,
        description: description !== undefined ? String(description).trim() : existing.description,
        icon: icon !== undefined ? icon || "Wifi" : existing.icon,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(benefit);
  } catch (error) {
    console.error("Benefit PUT error:", error);
    return NextResponse.json({ error: "Gagal mengupdate keunggulan." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.benefit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Keunggulan tidak ditemukan." }, { status: 404 });
    }
    await prisma.benefit.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Benefit DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus keunggulan." }, { status: 500 });
  }
}