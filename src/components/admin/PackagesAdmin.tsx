"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Wifi } from "lucide-react";
import {
  Modal,
  ConfirmDialog,
  Toast,
  EmptyState,
  Loading,
  StatusToggle,
} from "@/components/admin/ui";
import { formatRupiah } from "@/lib/utils";

type PackageItem = {
  id: string;
  name: string;
  speed: string;
  price: number;
  oldPrice?: number | null;
  description?: string | null;
  badge?: string | null;
  isOneTime: boolean;
  isActive: boolean;
  order: number;
};

type FormData = {
  name: string;
  speed: string;
  price: string;
  oldPrice: string;
  description: string;
  badge: string;
  isOneTime: boolean;
  isActive: boolean;
  order: string;
};

const emptyForm: FormData = {
  name: "",
  speed: "",
  price: "",
  oldPrice: "",
  description: "",
  badge: "",
  isOneTime: false,
  isActive: true,
  order: "0",
};

export default function PackagesAdmin() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PackageItem | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/package");
      if (res.ok) {
        setPackages(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(pkg: PackageItem) {
    setEditId(pkg.id);
    setForm({
      name: pkg.name,
      speed: pkg.speed,
      price: String(pkg.price),
      oldPrice: pkg.oldPrice ? String(pkg.oldPrice) : "",
      description: pkg.description || "",
      badge: pkg.badge || "",
      isOneTime: pkg.isOneTime,
      isActive: pkg.isActive,
      order: String(pkg.order),
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

    if (!form.name.trim() || !form.speed.trim() || !form.price) {
      setFormError("Nama, kecepatan dan harga wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/package/${editId}` : "/api/package";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          isOneTime: form.isOneTime,
          isActive: form.isActive,
          order: Number(form.order || 0),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Gagal menyimpan.");
        setSaving(false);
        return;
      }

      setModalOpen(false);
      setToast({ type: "success", message: editId ? "Paket berhasil diupdate." : "Paket berhasil ditambahkan." });
      fetchPackages();
    } catch {
      setFormError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(pkg: PackageItem) {
    try {
      await fetch(`/api/package/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      fetchPackages();
    } catch {
      setToast({ type: "error", message: "Gagal mengubah status." });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/package/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteTarget(null);
        setToast({ type: "success", message: "Paket dihapus." });
        fetchPackages();
      } else {
        setToast({ type: "error", message: "Gagal menghapus paket." });
      }
    } catch {
      setToast({ type: "error", message: "Gagal menghapus paket." });
    } finally {
      setDeleting(false);
    }
  }

  const sorted = [...packages].sort((a, b) => Number(a.isOneTime) - Number(b.isOneTime) || a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-dark">Kelola Paket WiFi</h1>
          <p className="text-sm text-slate-500">Tambah, edit dan kelola paket internet</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-sm">
          <Plus size={17} />
          Tambah Paket
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : packages.length === 0 ? (
        <EmptyState message="Belum ada paket. Klik Tambah Paket untuk membuat." />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                <th className="px-5 py-3.5 font-medium">Paket</th>
                <th className="px-3 py-3.5 font-medium">Harga</th>
                <th className="px-3 py-3.5 font-medium">Jenis</th>
                <th className="px-3 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((pkg) => (
                <tr key={pkg.id} className={`border-b border-slate-50 ${!pkg.isActive ? "opacity-60" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                        <Wifi size={17} />
                      </span>
                      <div>
                        <p className="font-semibold text-dark">{pkg.name}</p>
                        <p className="text-xs text-slate-400">{pkg.speed}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="font-semibold text-primary">{formatRupiah(pkg.price)}</span>
                    {pkg.oldPrice && (
                      <span className="text-xs text-slate-400 line-through block">
                        {formatRupiah(pkg.oldPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${pkg.isOneTime ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                      {pkg.isOneTime ? "Sekali Bayar" : "Bulanan"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <StatusToggle active={pkg.isActive} onToggle={() => handleToggle(pkg)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(pkg)} className="btn btn-ghost !py-1.5 !px-3 text-xs" aria-label="Edit">
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(pkg)}
                        className="btn btn-ghost !py-1.5 !px-3 text-xs text-red-500 hover:bg-red-50"
                        aria-label="Hapus"
                      >
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Paket" : "Tambah Paket"} wide>
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{formError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nama Paket *</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Paket 100 Mbps" />
            </div>
            <div>
              <label className="form-label">Kecepatan *</label>
              <input name="speed" value={form.speed} onChange={handleChange} className="form-input" placeholder="100 Mbps" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Harga *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} className="form-input" placeholder="219000" />
            </div>
            <div>
              <label className="form-label">Harga Coret</label>
              <input name="oldPrice" type="number" value={form.oldPrice} onChange={handleChange} className="form-input" placeholder="259000" />
            </div>
          </div>
          <div>
            <label className="form-label">Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-input min-h-[70px]" placeholder="Cocok untuk keluarga kecil..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Badge</label>
              <input name="badge" value={form.badge} onChange={handleChange} className="form-input" placeholder="BEST SELLER" />
            </div>
            <div>
              <label className="form-label">Urutan Tampilan</label>
              <input name="order" type="number" value={form.order} onChange={handleChange} className="form-input" placeholder="1" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="isOneTime" checked={form.isOneTime} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
              Paket Sekali Bayar
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
              Aktif
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1 disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Hapus paket "${deleteTarget?.name}"?`}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}