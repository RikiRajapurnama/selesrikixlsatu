import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const benefits = await prisma.benefit.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(benefits);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data keunggulan." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, icon, isActive, order } = body || {};

    if (!title || !description) {
      return NextResponse.json({ error: "Judul dan deskripsi wajib diisi." }, { status: 400 });
    }

    const benefit = await prisma.benefit.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        icon: icon || "Wifi",
        isActive: isActive === undefined ? true : Boolean(isActive),
        order: Number(order || 0),
      },
    });

    revalidatePath("/");
    return NextResponse.json(benefit, { status: 201 });
  } catch (error) {
    console.error("Benefit POST error:", error);
    return NextResponse.json({ error: "Gagal menyimpan keunggulan." }, { status: 500 });
  }
}