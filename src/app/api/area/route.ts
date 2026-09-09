import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const areas = await prisma.serviceArea.findMany({
      orderBy: [{ city: "asc" }, { district: "asc" }],
    });
    return NextResponse.json(areas);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil area layanan." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { city, district, description, isActive } = body || {};

    if (!city) {
      return NextResponse.json({ error: "Kota wajib diisi." }, { status: 400 });
    }

    const area = await prisma.serviceArea.create({
      data: {
        city: String(city).trim(),
        district: district || null,
        description: description || null,
        isActive: isActive === undefined ? true : Boolean(isActive),
      },
    });

    revalidatePath("/");
    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error("Area POST error:", error);
    return NextResponse.json({ error: "Gagal menyimpan area." }, { status: 500 });
  }
}