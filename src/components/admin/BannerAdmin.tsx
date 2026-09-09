"use client";

import { useEffect, useState, useCallback } from "react";
import { ImageIcon, Save, Loader2 } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaSecondary: string;
  image?: string | null;
  isActive: boolean;
};

const emptyForm = {
  id: "",
  title: "",
  subtitle: "",
  badge: "",
  ctaText: "",
  ctaSecondary: "",
  image: "",
  isActive: true,
};

export default function BannerAdmin() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchBanner = useCallback(async () => {
    try {
      const res = await fetch("/api/banner");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const b = data[0];
          setForm({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            badge: b.badge,
            ctaText: b.ctaText,
            ctaSecondary: b.ctaSecondary,
            image: b.image || "",
            isActive: b.isActive,
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) {
      setFormError("Hero title wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Gagal menyimpan.");
      } else {
        setToast({ type: "success", message: "Banner berhasil disimpan." });
      }
    } catch {
      setFormError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <Loader2 size={28} className="animate-spin text-primary" />
        <p className="text-sm text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-dark">Kelola Banner</h1>
        <p className="text-sm text-slate-500">Ubah konten hero & banner utama website</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5 animate-slide-up">
        {formError && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{formError}</div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
            <ImageIcon size={20} />
          </span>
          <div>
            <p className="font-semibold text-dark text-sm">Hero Section</p>
            <p className="text-xs text-slate-400">Tampil di bagian paling atas website</p>
          </div>
        </div>

        <div>
          <label className="form-label">Hero Title</label>
          <textarea
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-input min-h-[90px]"
            placeholder="Nikmati Internet Rumah Super Cepat dengan XL SATU WiFi"
          />
        </div>

        <div>
          <label className="form-label">Hero Subtitle</label>
          <textarea
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="form-input min-h-[80px]"
            placeholder="Solusi internet rumah untuk keluarga..."
          />
        </div>

        <div>
          <label className="form-label">Badge</label>
          <input
            name="badge"
            value={form.badge}
            onChange={handleChange}
            className="form-input"
            placeholder="Internet Cepat • Stabil • Terjangkau"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Tombol Utama</label>
            <input name="ctaText" value={form.ctaText} onChange={handleChange} className="form-input" placeholder="Chat WhatsApp" />
          </div>
          <div>
            <label className="form-label">Tombol Kedua</label>
            <input name="ctaSecondary" value={form.ctaSecondary} onChange={handleChange} className="form-input" placeholder="Daftar Sekarang" />
          </div>
        </div>

        <div>
          <label className="form-label">Gambar Hero (URL)</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="form-input"
            placeholder="https://gambar.com/router-xl.png"
          />
          <p className="text-xs text-slate-400 mt-1">Kosongkan untuk memakai gambar default.</p>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
          Aktifkan banner ini
        </label>

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? <><Loader2 size={17} className="animate-spin" /> Menyimpan...</> : <><Save size={17} /> Simpan Banner</>}
        </button>
      </form>

      {toast && (
        <div className="fixed top-4 right-4 z-[60] animate-slide-up">
          <div className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm ${toast.type === "success" ? "bg-green" : "bg-red-500"}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}