"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { ConfirmDialog, Toast, EmptyState, Loading } from "@/components/admin/ui";
import { formatDate, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/admin/WhatsAppIcon";

type Registration = {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  note?: string | null;
  status: string;
  createdAt: string;
  package?: { name: string } | null;
};

const STATUS_OPTIONS = ["baru", "dihubungi", "diproses", "selesai", "batal"];

const STATUS_STYLES: Record<string, string> = {
  baru: "bg-blue-50 text-blue-600",
  dihubungi: "bg-amber-50 text-amber-600",
  diproses: "bg-violet-50 text-violet-600",
  selesai: "bg-green-50 text-green-600",
  batal: "bg-red-50 text-red-600",
};

export default function RegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch("/api/registration");
      if (res.ok) setRegistrations(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  async function handleStatusChange(reg: Registration, status: string) {
    try {
      const res = await fetch("/api/registration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reg.id, status }),
      });
      if (res.ok) {
        setToast({ type: "success", message: "Status diperbarui." });
        fetchRegistrations();
      } else {
        setToast({ type: "error", message: "Gagal mengubah status." });
      }
    } catch {
      setToast({ type: "error", message: "Gagal mengubah status." });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/registration?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteTarget(null);
        setToast({ type: "success", message: "Pendaftaran dihapus." });
        fetchRegistrations();
      } else {
        setToast({ type: "error", message: "Gagal menghapus." });
      }
    } catch {
      setToast({ type: "error", message: "Gagal menghapus." });
    } finally {
      setDeleting(false);
    }
  }

  const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = registrations.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-dark">Pendaftaran</h1>
        <p className="text-sm text-slate-500">Calon pelanggan yang mendaftar</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {STATUS_OPTIONS.map((s) => (
          <div key={s} className="card p-4 text-center">
            <p className="text-2xl font-extrabold text-dark">{counts[s] || 0}</p>
            <p className="text-xs text-slate-500 font-semibold capitalize">{s}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : registrations.length === 0 ? (
        <EmptyState message="Belum ada pendaftaran." />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                <th className="px-5 py-3.5 font-medium">Nama</th>
                <th className="px-3 py-3.5 font-medium">WhatsApp</th>
                <th className="px-3 py-3.5 font-medium">Paket</th>
                <th className="px-3 py-3.5 font-medium">Alamat</th>
                <th className="px-3 py-3.5 font-medium">Tanggal</th>
                <th className="px-3 py-3.5 font-medium">Status</th>
                <th className="px-3 py-3.5 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-dark">{reg.name}</p>
                    {reg.note && <p className="text-xs text-slate-400 truncate max-w-[140px]">{reg.note}</p>}
                  </td>
                  <td className="px-3 py-4 text-slate-600">{reg.phone}</td>
                  <td className="px-3 py-4 text-slate-600">{reg.package?.name || "-"}</td>
                  <td className="px-3 py-4 text-slate-500 max-w-[160px] truncate">{reg.address || "-"}</td>
                  <td className="px-3 py-4 text-slate-500 whitespace-nowrap">{formatDate(reg.createdAt)}</td>
                  <td className="px-3 py-4">
                    <select
                      value={reg.status}
                      onChange={(e) => handleStatusChange(reg, e.target.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold border-transparent outline-none cursor-pointer ${STATUS_STYLES[reg.status] || "bg-slate-100 text-slate-600"}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex gap-2">
                      <a
                        href={waLink(reg.phone, `Halo ${reg.name}, saya ${reg.status === "selesai" ? "" : ""}Riki dari XL SATU WiFi. Terima kasih sudah mendaftar, kami akan segera memproses pendaftaran Anda.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost !py-1.5 !px-3 text-xs text-green"
                        aria-label="Chat WhatsApp"
                      >
                        <WhatsAppIcon size={15} />
                      </a>
                      <button
                        onClick={() => setDeleteTarget(reg)}
                        className="btn btn-ghost !py-1.5 !px-3 text-xs text-red-500 hover:bg-red-50"
                        aria-label="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message={`Hapus pendaftaran "${deleteTarget?.name}"?`} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}