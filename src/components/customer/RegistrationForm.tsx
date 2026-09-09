"use client";

import { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Loader2,
  Camera,
  Home,
  CreditCard,
} from "lucide-react";

type PackageItem = {
  id: string;
  name: string;
  speed: string;
  isOneTime: boolean;
};

const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;

export default function RegistrationForm({
  packages,
}: {
  packages: PackageItem[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    packageId: "",
    address: "",
    note: "",
  });
  const [photoHouse, setPhotoHouse] = useState("");
  const [photoKtp, setPhotoKtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.readAsDataURL(file);
    });
  }

  async function handlePhoto(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File foto harus berupa gambar (JPG/PNG).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("Ukuran foto maksimal 1,5 MB. Silakan kompres foto kamu.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setter(dataUrl);
      setError("");
    } catch {
      setError("Gagal memproses foto. Coba lagi.");
    }
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    if (!photoHouse || !photoKtp) {
      setError("Foto depan rumah dan foto KTP wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photoHouse, photoKtp }),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          phone: "",
          email: "",
          packageId: "",
          address: "",
          note: "",
        });
        setPhotoHouse("");
        setPhotoKtp("");
      } else {
        setError("Gagal mengirim pendaftaran. Coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="daftar" className="py-16 sm:py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-4">
            <ClipboardList size={15} />
            Form Pendaftaran
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark mb-3">
            Daftar Sekarang, <span className="text-gradient">Internet Cepat!</span>
          </h2>
          <p className="text-slate-500">
            Isi formulir di bawah ini dan tim kami akan menghubungi kamu.
          </p>
        </div>

        {success ? (
          <div className="card p-10 text-center animate-slide-up">
            <span className="mx-auto w-16 h-16 rounded-full bg-green/10 text-green flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </span>
            <h3 className="font-bold text-dark text-lg mb-2">
              Pendaftaran Berhasil!
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Terima kasih! Kami akan segera menghubungi kamu melalui WhatsApp.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="btn btn-outline"
            >
              Daftar Lagi
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card p-6 sm:p-8 space-y-5 animate-slide-up"
          >
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nama Lengkap *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nama kamu"
                />
              </div>
              <div>
                <label className="form-label">Nomor WhatsApp *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="form-label">Pilih Paket</label>
              <select
                name="packageId"
                value={form.packageId}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Pilih paket (opsional)</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.speed}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Alamat Pemasangan *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-input min-h-[70px]"
                placeholder="Alamat lengkap tempat pemasangan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhotoUpload
                label="Foto Depan Rumah *"
                icon={<Home size={18} />}
                value={photoHouse}
                onChange={handlePhoto}
                setter={setPhotoHouse}
              />
              <PhotoUpload
                label="Foto KTP *"
                icon={<CreditCard size={18} />}
                value={photoKtp}
                onChange={handlePhoto}
                setter={setPhotoKtp}
              />
            </div>

            <p className="text-xs text-slate-400">
              Maksimal 1,5 MB per foto (JPG/PNG). Foto kamu aman dan hanya
              digunakan verifikasi pemasangan.
            </p>

            <div>
              <label className="form-label">Catatan (opsional)</label>
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                className="form-input"
                placeholder="Catatan tambahan"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full !py-3.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Pendaftaran"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function PhotoUpload({
  label,
  icon,
  value,
  onChange,
  setter,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => void;
  setter: (v: string) => void;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <label className="relative block w-full cursor-pointer">
        {value ? (
          <img
            src={value}
            alt={label}
            className="w-full h-32 object-cover rounded-xl border border-slate-200"
          />
        ) : (
          <span className="flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-primary hover:text-primary transition-colors">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
              <Camera size={18} />
            </span>
            <span className="text-xs font-medium flex items-center gap-1.5">
              {icon}
              Pilih Foto
            </span>
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onChange(e, setter)}
        />
      </label>
      <span className="mt-1 text-[11px] text-slate-400">
        {value ? "Tersimpan ✓" : "JPG/PNG, maks 1,5 MB"}
      </span>
    </div>
  );
}