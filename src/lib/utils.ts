export function formatRupiah(amount: number | string | null | undefined) {
  const num = Number(amount || 0);
  return "Rp " + num.toLocaleString("id-ID");
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function waLink(
  phone: string,
  message: string = "Halo Kak, saya tertarik dengan paket XL SATU WiFi. Bisa minta informasinya?"
) {
  const num = phone.replace(/\D/g, "");
  const intl = num.startsWith("0") ? "62" + num.slice(1) : num;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

export function generateInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
