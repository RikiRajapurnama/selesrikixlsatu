"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${
          wide ? "max-w-2xl" : "max-w-md"
        } animate-slide-up`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-bold text-dark">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  message: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-up">
        <span className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={26} />
        </span>
        <h3 className="font-bold text-dark text-lg mb-2">Konfirmasi Hapus</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-danger flex-1 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[60] animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm ${
          type === "success" ? "bg-green" : "bg-red-500"
        }`}
      >
        <span>{message}</span>
        <button onClick={onClose} aria-label="Close notification">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-slate-500">{message}</p>
    </div>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <Loader2 size={28} className="animate-spin text-primary" />
      <p className="text-sm text-slate-500">{label || "Memuat..."}</p>
    </div>
  );
}

export function StatusToggle({
  active,
  onToggle,
  disabled,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
        active ? "bg-green" : "bg-slate-300"
      }`}
      aria-label="Toggle status"
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
          active ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}