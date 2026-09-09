import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const VALID_STATUSES = ["baru", "dihubungi", "diproses", "selesai", "batal"];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      include: { package: true },
    });
    return NextResponse.json(registrations);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil pendaftaran." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, packageId, address, note, photoHouse, photoKtp } = body || {};

    if (!name || !phone) {
      return NextResponse.json({ error: "Nama dan nomor WhatsApp wajib diisi." }, { status: 400 });
    }

    const sanitizeBase64 = (value: unknown) =>
      typeof value === "string" && value.startsWith("data:image/") && value.length <= 600000
        ? value
        : null;

    const registration = await prisma.registration.create({
      data: {
        name: String(name).trim().slice(0, 100),
        phone: String(phone).trim().slice(0, 20),
        email: email ? String(email).trim().slice(0, 100) : null,
        packageId: packageId || null,
        address: address || null,
        note: note || null,
        photoHouse: sanitizeBase64(photoHouse),
        photoKtp: sanitizeBase64(photoKtp),
        status: "baru",
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Registration POST error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pendaftaran." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body || {};

    if (!id || !status) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }

    const existing = await prisma.registration.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Pendaftaran tidak ditemukan." }, { status: 404 });
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Registration PUT error:", error);
    return NextResponse.json({ error: "Gagal mengupdate pendaftaran." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan." }, { status: 400 });
    }

    const existing = await prisma.registration.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Pendaftaran tidak ditemukan." }, { status: 404 });
    }

    await prisma.registration.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Registration DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus pendaftaran." }, { status: 500 });
  }
}