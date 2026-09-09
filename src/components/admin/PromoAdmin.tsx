"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Gift } from "lucide-react";
import {
  Modal,
  ConfirmDialog,
  Toast,
  EmptyState,
  Loading,
  StatusToggle,
} from "@/components/admin/ui";
import { formatRupiah } from "@/lib/utils";

type Promo = {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string | null;
  badge?: string | null;
  image?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  order: number;
};

type FormData = {
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  badge: string;
  image: string;
  startDate: string;
  endDate: string;
  order: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  title: "",
  description: "",
  price: "",
  oldPrice: "",
  badge: "",
  image: "",
  startDate: "",
  endDate: "",
  order: "0",
  isActive: true,
};

export default function PromoAdmin() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formError, setFormError] = useState("");

  const fetchPromos = useCallback(async () => {
    try {
      const res = await fetch("/api/promo");
      if (res.ok) {
        const data = await res.json();
        setPromos(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(promo: Promo) {
    setEditId(promo.id);
    setForm({
      title: promo.title,
      description: promo.description,
      price: promo.price,
      oldPrice: promo.oldPrice || "",
      badge: promo.badge || "",
      image: promo.image || "",
      startDate: promo.startDate || "",
      endDate: promo.endDate || "",
      order: String(promo.order),
      isActive: promo.isActive,
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

    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Judul dan deskripsi wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/promo/${editId}` : "/api/promo";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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
      setToast({ type: "success", message: editId ? "Promo berhasil diupdate." : "Promo berhasil ditambahkan." });
      fetchPromos();
    } catch {
      setFormError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(promo: Promo) {
    try {
      await fetch(`/api/promo/${promo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      fetchPromos();
    } catch {
      setToast({ type: "error", message: "Gagal mengubah status." });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/promo/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteTarget(null);
        setToast({ type: "success", message: "Promo dihapus." });
        fetchPromos();
      } else {
        setToast({ type: "error", message: "Gagal menghapus promo." });
      }
    } catch {
      setToast({ type: "error", message: "Gagal menghapus promo." });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-dark">Kelola Promo</h1>
          <p className="text-sm text-slate-500">Tambah, edit dan kelola promo website</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary text-sm">
          <Plus size={17} />
          Tambah Promo
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : promos.length === 0 ? (
        <EmptyState message="Belum ada promo. Klik Tambah Promo untuk membuat." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <div key={promo.id} className={`card p-5 ${!promo.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <Gift size={20} />
                </span>
                <StatusToggle active={promo.isActive} onToggle={() => handleToggle(promo)} />
              </div>
              <h3 className="font-bold text-dark text-sm leading-snug mb-1.5">{promo.title}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{promo.description}</p>

              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-primary text-sm">{formatRupiah(promo.price)}</span>
                {promo.oldPrice && (
                  <span className="text-xs text-slate-400 line-through">{formatRupiah(promo.oldPrice)}</span>
                )}
              </div>
              {promo.badge && (
                <span className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[11px] font-semibold mb-3">
                  {promo.badge}
                </span>
              )}

              <div className="flex gap-2 mt-4 border-t border-slate-100 pt-4">
                <button
                  onClick={() => openEdit(promo)}
                  className="btn btn-ghost text-xs flex-1 !py-2"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(promo)}
                  className="btn btn-ghost text-xs flex-1 !py-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Promo" : "Tambah Promo"} wide>
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
              {formError}
            </div>
          )}
          <div>
            <label className="form-label">Judul Promo *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Bayar 4 Bulan Langsung, Lebih Untung!"
            />
          </div>
          <div>
            <label className="form-label">Deskripsi *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-input min-h-[80px]"
              placeholder="Bonus Nonton 3 Bulan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Harga</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="form-input"
                placeholder="650000"
              />
            </div>
            <div>
              <label className="form-label">Harga Coret {editId ? "(opsional)" : ""}</label>
              <input
                name="oldPrice"
                type="number"
                value={form.oldPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="780000"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Badge</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className="form-input"
                placeholder="PROMO TERBATAS"
              />
            </div>
            <div>
              <label className="form-label">Urutan Tampilan</label>
              <input
                name="order"
                type="number"
                value={form.order}
                onChange={handleChange}
                className="form-input"
                placeholder="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tanggal Mulai</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Tanggal Berakhir</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <div>
            <label className="form-label">Gambar (URL)</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="form-input"
              placeholder="https://gambar.com/promo.png"
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            Aktif (tampil di website)
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost flex-1">
              Batal
            </button>
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
        message={`Hapus promo "${deleteTarget?.title}"?`}
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}