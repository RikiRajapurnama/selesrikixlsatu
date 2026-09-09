"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import {
  Modal,
  ConfirmDialog,
  Toast,
  EmptyState,
  Loading,
  StatusToggle,
} from "@/components/admin/ui";

type Area = {
  id: string;
  city: string;
  district?: string | null;
  description?: string | null;
  isActive: boolean;
};

type FormData = {
  city: string;
  district: string;
  description: string;
  isActive: boolean;
};

const emptyForm: FormData = { city: "", district: "", description: "", isActive: true };

export default function AreasAdmin() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Area | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchAreas = useCallback(async () => {
    try {
      const res = await fetch("/api/area");
      if (res.ok) setAreas(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(area: Area) {
    setEditId(area.id);
    setForm({
      city: area.city,
      district: area.district || "",
      description: area.description || "",
      isActive: area.isActive,
    });
    setFormError("");
    setModalOpen(true);
  }

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
    if (!form.city.trim()) {
      setFormError("Nama kota wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/area/${editId}` : "/api/area";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isActive: form.isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Gagal menyimpan.");
        setSaving(false);
        return;
      }
      setModalOpen(false);
      setToast({ type: "success", message: editId ? "Area diupdate." : "Area ditambahkan." });
      fetchAreas();
    } catch {
      setFormError("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(area: Area) {
    try {
      await fetch(`/api/area/${area.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !area.isActive }),
      });
      fetchAreas();
    } catch {
      setToast({ type: "error", message: "Gagal mengubah status." });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/area/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteTarget(null);
        setToast({ type: "success", message: "Area dihapus." });
        fetchAreas();
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-dark">Area Layanan</h1>
          <p className="text-sm text-slate-500">Kelola area ketersediaan layanan</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-sm">
          <Plus size={17} />
          Tambah Area
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : areas.length === 0 ? (
        <EmptyState message="Belum ada area layanan." />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                <th className="px-5 py-3.5 font-medium">Kota</th>
                <th className="px-3 py-3.5 font-medium">Kecamatan</th>
                <th className="px-3 py-3.5 font-medium">Keterangan</th>
                <th className="px-3 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id} className={`border-b border-slate-50 ${!area.isActive ? "opacity-60" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-green flex items-center justify-center shrink-0">
                        <MapPin size={15} />
                      </span>
                      <span className="font-semibold text-dark">{area.city}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-slate-600">{area.district || "-"}</td>
                  <td className="px-3 py-4 text-slate-500 max-w-[220px] truncate">{area.description || "-"}</td>
                  <td className="px-3 py-4">
                    <StatusToggle active={area.isActive} onToggle={() => handleToggle(area)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(area)} className="btn btn-ghost !py-1.5 !px-3 text-xs" aria-label="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteTarget(area)} className="btn btn-ghost !py-1.5 !px-3 text-xs text-red-500 hover:bg-red-50" aria-label="Hapus">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Area" : "Tambah Area"}>
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{formError}</div>
          )}
          <div>
            <label className="form-label">Nama Kota *</label>
            <input name="city" value={form.city} onChange={handleChange} className="form-input" placeholder="Jakarta" />
          </div>
          <div>
            <label className="form-label">Kecamatan</label>
            <input name="district" value={form.district} onChange={handleChange} className="form-input" placeholder="Jakarta Selatan" />
          </div>
          <div>
            <label className="form-label">Keterangan</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-input min-h-[60px]" placeholder="Tersedia di area Jakarta Selatan" />
          </div>
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-emerald-600" />
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

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message={`Hapus area "${deleteTarget?.city}"?`} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}