"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wifi, Loader2, AlertCircle, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal. Periksa kembali email dan password.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-blob" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand text-white shadow-2xl mb-4">
            <Wifi size={32} />
          </span>
          <h1 className="text-white text-2xl font-extrabold">XL SATU WiFi</h1>
          <p className="text-white/75 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-up">
          <h2 className="font-bold text-lg text-dark mb-6 text-center">
            Masuk Admin
          </h2>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={17} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">
                Email / Username
              </label>
              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  className="form-input !pl-10"
                  placeholder="admin@xlwifi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="form-input !pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full !py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/60 text-xs mt-6">
          © 2024 XL SATU WiFi. Sales: Riki
        </p>
      </div>
    </div>
  );
}