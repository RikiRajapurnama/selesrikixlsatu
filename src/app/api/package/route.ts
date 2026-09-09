import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ isOneTime: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(packages);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data paket." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, speed, price, oldPrice, description, badge, isOneTime, isActive, order } = body || {};

    if (!name || !speed || !price) {
      return NextResponse.json(
        { error: "Nama, kecepatan dan harga wajib diisi." },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        name: String(name).trim(),
        speed: String(speed).trim(),
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        description: description || null,
        badge: badge || null,
        isOneTime: Boolean(isOneTime),
        isActive: isActive === undefined ? true : Boolean(isActive),
        order: Number(order || 0),
      },
    });

    revalidatePath("/");
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error("Package POST error:", error);
    return NextResponse.json({ error: "Gagal menyimpan paket." }, { status: 500 });
  }
}