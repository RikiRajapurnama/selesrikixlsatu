"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Settings as SettingsIcon } from "lucide-react";

const emptyForm = {
  websiteName: "",
  logo: "",
  whatsappNumber: "",
  instagram: "",
  facebook: "",
  footerText: "",
  googleMaps: "",
};

export default function WebsiteSettingsAdmin() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setForm({
            websiteName: data.websiteName || "",
            logo: data.logo || "",
            whatsappNumber: data.whatsappNumber || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            footerText: data.footerText || "",
            googleMaps: data.googleMaps || "",
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
    fetchSettings();
  }, [fetchSettings]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.websiteName.trim()) {
      setFormError("Nama website wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Gagal menyimpan.");
      } else {
        setToast({ type: "success", message: "Pengaturan disimpan." });
      }
    } catch {
      setFormError("Terjadi kesalahan.");
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
        <h1 className="text-xl sm:text-2xl font-extrabold text-dark flex items-center gap-2.5">
          <SettingsIcon size={24} className="text-primary" />
          Pengaturan Website
        </h1>
        <p className="text-sm text-slate-500">Informasi umum website & kontak</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5 animate-slide-up">
        {formError && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{formError}</div>
        )}

        <div>
          <label className="form-label">Nama Website</label>
          <input name="websiteName" value={form.websiteName} onChange={handleChange} className="form-input" placeholder="XL SATU WiFi" />
        </div>

        <div>
          <label className="form-label">Logo (URL)</label>
          <input name="logo" value={form.logo} onChange={handleChange} className="form-input" placeholder="https://gambar.com/logo.png" />
        </div>

        <div>
          <label className="form-label">Nomor WhatsApp</label>
          <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="form-input" placeholder="083177522021" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Instagram (URL)</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} className="form-input" placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="form-label">Facebook (URL)</label>
            <input name="facebook" value={form.facebook} onChange={handleChange} className="form-input" placeholder="https://facebook.com/..." />
          </div>
        </div>

        <div>
          <label className="form-label">Footer Text</label>
          <input name="footerText" value={form.footerText} onChange={handleChange} className="form-input" placeholder="Internet Rumah, Hidup Lebih Lancar" />
        </div>

        <div>
          <label className="form-label">Google Maps (embed URL)</label>
          <textarea name="googleMaps" value={form.googleMaps} onChange={handleChange} className="form-input min-h-[70px]" placeholder="https://maps.google.com/..." />
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? <><Loader2 size={17} className="animate-spin" /> Menyimpan...</> : <><Save size={17} /> Simpan Pengaturan</>}
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