import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(promos);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data promo." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, price, oldPrice, badge, image, startDate, endDate, isActive, order } = body || {};

    if (!title || !description) {
      return NextResponse.json(
        { error: "Judul dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    const promo = await prisma.promo.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        price: String(price || "0"),
        oldPrice: oldPrice ? String(oldPrice) : null,
        badge: badge || null,
        image: image || null,
        startDate: startDate || null,
        endDate: endDate || null,
        isActive: isActive === undefined ? true : Boolean(isActive),
        order: Number(order || 0),
      },
    });

    revalidatePath("/");
    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error("Promo POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan promo." },
      { status: 500 }
    );
  }
}