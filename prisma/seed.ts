import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@xlwifi.com" },
    update: { password: passwordHash },
    create: {
      email: "admin@xlwifi.com",
      password: passwordHash,
      name: "Admin",
      role: "admin",
    },
  });

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      websiteName: "XL SATU WiFi",
      whatsappNumber: "083177522021",
      footerText: "Internet Rumah, Hidup Lebih Lancar",
      salesName: "Riki",
      salesPhone: "083177522021",
      salesDesc: "Sales XL SATU WiFi",
    },
  });

  await prisma.banner.upsert({
    where: { id: "banner-default" },
    update: {},
    create: {
      id: "banner-default",
      title: "Nikmati Internet Rumah Super Cepat dengan XL SATU WiFi",
      subtitle:
        "Solusi internet rumah untuk keluarga, belajar, bekerja, streaming, gaming, dan hiburan tanpa batas.",
      badge: "Internet Cepat • Stabil • Terjangkau",
      ctaText: "Chat WhatsApp",
      ctaSecondary: "Daftar Sekarang",
      isActive: true,
    },
  });

  await prisma.promo.deleteMany();
  await prisma.package.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.serviceArea.deleteMany();
  await prisma.registration.deleteMany();

  const promos = [
    {
      title: "Bayar 4 Bulan Langsung, Lebih Untung!",
      description: "Bonus Nonton 3 Bulan",
      price: "650000",
      oldPrice: "780000",
      badge: "PROMO TERBATAS",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      isActive: true,
      order: 1,
    },
    {
      title: "Paket 50 Mbps Spesial",
      description: "Bayar 4 bulan langsung sekaligus, bonus nonton 3 bulan",
      price: "650000",
      oldPrice: "740000",
      badge: "BEST VALUE",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      isActive: true,
      order: 2,
    },
    {
      title: "Paket 100 Mbps Spesial",
      description: "Bayar 4 bulan langsung, lebih hemat dan bonus nonton",
      price: "850000",
      oldPrice: "950000",
      badge: "BEST SELLER",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      isActive: true,
      order: 3,
    },
  ];

  for (const promo of promos) {
    await prisma.promo.create({ data: promo });
  }

  const packages = [
    {
      name: "Paket 100 Mbps",
      speed: "100 Mbps",
      price: 219000,
      oldPrice: 259000,
      description:
        "Cocok untuk keluarga kecil, streaming dan bekerja dari rumah",
      badge: "PALING POPULER",
      isActive: true,
      order: 1,
    },
    {
      name: "Paket 250 Mbps",
      speed: "250 Mbps",
      price: 229000,
      oldPrice: 279000,
      description:
        "Cocok untuk keluarga, streaming lancar dan gaming online",
      badge: "BEST SELLER",
      isActive: true,
      order: 2,
    },
    {
      name: "Paket 350 Mbps",
      speed: "350 Mbps",
      price: 279000,
      oldPrice: 329000,
      description:
        "Untuk keluarga besar, banyak perangkat dan aktivitas berat",
      badge: "Recommended",
      isActive: true,
      order: 3,
    },
    {
      name: "Paket 400 Mbps",
      speed: "400 Mbps",
      price: 300000,
      oldPrice: 359000,
      description:
        "Kecepatan maksimal untuk gaming, streaming 4K dan kantor rumah",
      badge: null,
      isActive: true,
      order: 4,
    },
    {
      name: "Sekali Bayar 50 Mbps",
      speed: "50 Mbps",
      price: 650000,
      oldPrice: 780000,
      description: "Bayar 4 bulan langsung, bonus nonton 3 bulan",
      badge: "Sekali Bayar",
      isOneTime: true,
      isActive: true,
      order: 5,
    },
    {
      name: "Sekali Bayar 100 Mbps",
      speed: "100 Mbps",
      price: 850000,
      oldPrice: 950000,
      description: "Bayar 4 bulan langsung, bonus nonton 3 bulan",
      badge: "Sekali Bayar",
      isOneTime: true,
      isActive: true,
      order: 6,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }

  const benefits = [
    { title: "Jaringan Luas", description: "Coverage luas untuk kebutuhan internet rumah", icon: "Wifi", isActive: true, order: 1 },
    { title: "Kecepatan Tinggi", description: "Streaming, gaming dan meeting lebih lancar", icon: "Zap", isActive: true, order: 2 },
    { title: "Harga Terjangkau", description: "Pilihan paket sesuai kebutuhan", icon: "Wallet", isActive: true, order: 3 },
    { title: "Pasang Mudah", description: "Proses pendaftaran cepat dan praktis", icon: "Settings", isActive: true, order: 4 },
    { title: "Customer Service", description: "Siap membantu kebutuhan pelanggan", icon: "Headphones", isActive: true, order: 5 },
    { title: "Koneksi Stabil", description: "Jaringan stabil untuk semua aktivitas online", icon: "Wifi", isActive: true, order: 6 },
    { title: "Streaming Lancar", description: "Nonton film dan video tanpa buffering", icon: "Play", isActive: true, order: 7 },
    { title: "Gaming Lancar", description: "Pengalaman gaming online tanpa lag", icon: "Gamepad2", isActive: true, order: 8 },
    { title: "Bisa Banyak Perangkat", description: "Support banyak perangkat sekaligus", icon: "Smartphone", isActive: true, order: 9 },
    { title: "Harga Terjangkau", description: "Harga bersahabat untuk semua", icon: "BadgePercent", isActive: true, order: 10 },
    { title: "Customer Service", description: "Layanan pelanggan yang responsif", icon: "LifeBuoy", isActive: true, order: 11 },
  ];

  for (const benefit of benefits) {
    await prisma.benefit.create({ data: benefit });
  }

  const areas = [
    { city: "Jakarta", district: "Jakarta Selatan", description: "Tersedia di area Jakarta Selatan", isActive: true },
    { city: "Jakarta", district: "Jakarta Timur", description: "Tersedia di area Jakarta Timur", isActive: true },
    { city: "Depok", district: "Cimanggis", description: "Tersedia di area Cimanggis, Depok", isActive: true },
    { city: "Bekasi", district: "Bekasi Timur", description: "Tersedia di area Bekasi Timur", isActive: true },
    { city: "Bogor", district: "Cibinong", description: "Tersedia di area Cibinong, Bogor", isActive: true },
    { city: "Tangerang", district: "BSD", description: "Tersedia di area BSD, Tangerang", isActive: true },
  ];

  for (const area of areas) {
    await prisma.serviceArea.create({ data: area });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
