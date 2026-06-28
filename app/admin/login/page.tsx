"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loading } from "@/components/Loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        throw error;
      }

      // Keep loading as true while redirecting
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      {loading && <Loading fullScreen text="Đang xác thực và chuyển hướng..." />}

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-amber-500/5 border border-neutral-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 rotate-3">
            <span className="text-white text-2xl font-black">B</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Quản trị viên</h1>
          <p className="text-sm text-neutral-500 mt-1">Đăng nhập để quản lý cửa hàng</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="admin@tiemnhabee.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-xl text-red-500 text-xs text-center font-medium animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-neutral-900/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}
