"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, UserRound } from "lucide-react";

const emptyForm = {
  salesName: "",
  salesPhone: "",
  salesPhoto: "",
  salesDesc: "",
  salesArea: "",
};

export default function SalesProfileAdmin() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setForm({
            salesName: data.salesName || "",
            salesPhone: data.salesPhone || "",
            salesPhoto: data.salesPhoto || "",
            salesDesc: data.salesDesc || "",
            salesArea: data.salesArea || "",
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
    fetchProfile();
  }, [fetchProfile]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.salesName.trim() || !form.salesPhone.trim()) {
      setFormError("Nama dan nomor sales wajib diisi.");
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
        setToast({ type: "success", message: "Profil sales diperbarui." });
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
          <UserRound size={24} className="text-primary" />
          Profil Sales
        </h1>
        <p className="text-sm text-slate-500">Informasi sales yang tampil di website</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5 animate-slide-up">
        {formError && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{formError}</div>
        )}

        <div className="flex items-center gap-4">
          <span className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {form.salesName ? form.salesName.charAt(0).toUpperCase() : "R"}
          </span>
          <div>
            <p className="font-semibold text-dark">{form.salesName || "Riki"}</p>
            <p className="text-sm text-slate-500">{form.salesDesc || "Sales XL SATU WiFi"}</p>
          </div>
        </div>

        <div>
          <label className="form-label">Nama Sales *</label>
          <input name="salesName" value={form.salesName} onChange={handleChange} className="form-input" placeholder="Riki" />
        </div>

        <div>
          <label className="form-label">Nomor WhatsApp Sales *</label>
          <input name="salesPhone" value={form.salesPhone} onChange={handleChange} className="form-input" placeholder="083177522021" />
        </div>

        <div>
          <label className="form-label">Foto Sales (URL)</label>
          <input name="salesPhoto" value={form.salesPhoto} onChange={handleChange} className="form-input" placeholder="https://gambar.com/foto.png" />
        </div>

        <div>
          <label className="form-label">Deskripsi / Jabatan</label>
          <input name="salesDesc" value={form.salesDesc} onChange={handleChange} className="form-input" placeholder="Sales XL SATU WiFi" />
        </div>

        <div>
          <label className="form-label">Area Penjualan</label>
          <textarea name="salesArea" value={form.salesArea} onChange={handleChange} className="form-input min-h-[70px]" placeholder="Jakarta, Depok, Bekasi, Bogor, Tangerang" />
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? <><Loader2 size={17} className="animate-spin" /> Menyimpan...</> : <><Save size={17} /> Simpan Profil</>}
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