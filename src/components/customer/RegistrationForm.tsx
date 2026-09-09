"use client";

import { useState } from "react";
import { ClipboardList, CheckCircle2, Loader2 } from "lucide-react";

type PackageItem = {
  id: string;
  name: string;
  speed: string;
  isOneTime: boolean;
};

export default function RegistrationForm({
  packages,
}: {
  packages: PackageItem[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    packageId: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", packageId: "", address: "", note: "" });
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
              <label className="form-label">Alamat Pemasangan</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-input min-h-[70px]"
                placeholder="Alamat lengkap tempat pemasangan"
              />
            </div>

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