"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import {
  Modal,
  ConfirmDialog,
  Toast,
  EmptyState,
  Loading,
  StatusToggle,
} from "@/components/admin/ui";

type Benefit = {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  isActive: boolean;
  order: number;
};

type FormData = {
  title: string;
  description: string;
  icon: string;
  order: string;
  isActive: boolean;
};

const emptyForm: FormData = { title: "", description: "", icon: "Wifi", order: "0", isActive: true };

const ICON_OPTIONS = ["Wifi", "Zap", "Wallet", "Settings", "Headphones", "Play", "Gamepad2", "Smartphone", "BadgePercent", "LifeBuoy", "Shield"];

export default function BenefitsAdmin() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Benefit | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchBenefits = useCallback(async () => {
    try {
      const res = await fetch("/api/benefit");
      if (res.ok) setBenefits(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(benefit: Benefit) {
    setEditId(benefit.id);
    setForm({
      title: benefit.title,
      description: benefit.description,
      icon: benefit.icon || "Wifi",
      order: String(benefit.order),
      isActive: benefit.isActive,
    });
    setFormError("");
    setModalOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Judul dan deskripsi wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/benefit/${editId}` : "/api/benefit";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order || 0), isActive: form.isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Gagal menyimpan.");
        setSaving(false);
        return;
      }
      setModalOpen(false);
      setToast({ type: "success", message: editId ? "Keunggulan diupdate." : "Keunggulan ditambahkan." });
      fetchBenefits();
    } catch {
      setFormError("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(benefit: Benefit) {
    try {
      await fetch(`/api/benefit/${benefit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !benefit.isActive }),
      });
      fetchBenefits();
    } catch {
      setToast({ type: "error", message: "Gagal mengubah status." });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/benefit/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteTarget(null);
        setToast({ type: "success", message: "Keunggulan dihapus." });
        fetchBenefits();
      } else {
        setToast({ type: "error", message: "Gagal menghapus." });
      }
    } catch {
      setToast({ type: "error", message: "Gagal menghapus." });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-dark">Kelola Keunggulan</h1>
          <p className="text-sm text-slate-500">Keunggulan & alasan memilih XL SATU WiFi</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-sm">
          <Plus size={17} />
          Tambah
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : benefits.length === 0 ? (
        <EmptyState message="Belum ada keunggulan." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <div key={benefit.id} className={`card p-5 ${!benefit.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                  <Sparkles size={19} />
                </span>
                <StatusToggle active={benefit.isActive} onToggle={() => handleToggle(benefit)} />
              </div>
              <h3 className="font-bold text-dark text-sm mb-1">{benefit.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{benefit.description}</p>
              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button onClick={() => openEdit(benefit)} className="btn btn-ghost text-xs flex-1 !py-2">
                  <Pencil size={13} />
                  Edit
                </button>
                <button onClick={() => setDeleteTarget(benefit)} className="btn btn-ghost text-xs flex-1 !py-2 text-red-500 hover:bg-red-50">
                  <Trash2 size={13} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Keunggulan" : "Tambah Keunggulan"}>
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{formError}</div>
          )}
          <div>
            <label className="form-label">Judul *</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="Koneksi Stabil" />
          </div>
          <div>
            <label className="form-label">Deskripsi *</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-input min-h-[70px]" placeholder="Jaringan stabil untuk semua aktivitas online" />
          </div>
          <div>
            <label className="form-label">Icon</label>
            <select name="icon" value={form.icon} onChange={handleChange} className="form-input">
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Urutan Tampilan</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className="form-input" placeholder="1" />
          </div>
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
            Aktif
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1 disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message={`Hapus keunggulan "${deleteTarget?.title}"?`} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}