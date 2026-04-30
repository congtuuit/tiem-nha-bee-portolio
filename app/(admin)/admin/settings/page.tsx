"use client";

import { useState, useEffect } from "react";
import { Save, Store, Phone, MapPin, Globe, MessageCircle, Info } from "lucide-react";
import { toast } from "sonner";

import { FacebookIcon, ZaloIcon } from "@/components/Icons";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    shop_name: "Tiệm Nhà Bee",
    phone: "",
    address: "",
    zalo_url: "",
    facebook_url: "",
    footer_text: "",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Failed to update settings");
      toast.success("Đã cập nhật cấu hình shop!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật cấu hình");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Cấu hình Shop</h1>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2">
            <Store className="w-5 h-5" />
            <span>Thông tin cơ bản</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tên Shop</label>
            <input
              type="text"
              value={config.shop_name}
              onChange={(e) => setConfig({ ...config, shop_name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={config.phone || ""}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="090..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Địa chỉ</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                value={config.address || ""}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all min-h-[80px]"
                placeholder="Địa chỉ cửa hàng..."
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2">
            <Globe className="w-5 h-5" />
            <span>Liên kết & Mạng xã hội</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Link Facebook</label>
            <div className="relative">
              <FacebookIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={config.facebook_url || ""}
                onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Link Zalo</label>
            <div className="relative">
              <ZaloIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={config.zalo_url || ""}
                onChange={(e) => setConfig({ ...config, zalo_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="https://zalo.me/..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Text chân trang (Footer)</label>
            <textarea
              value={config.footer_text || ""}
              onChange={(e) => setConfig({ ...config, footer_text: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all min-h-[80px]"
              placeholder="Tiệm Nhà Bee - Chuyên đồ handmade..."
            />
          </div>
        </div>

        {/* SEO Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2">
            <Info className="w-5 h-5" />
            <span>Cấu hình SEO (Mặc định cho toàn trang)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tiêu đề SEO (Meta Title)</label>
              <input
                type="text"
                value={config.meta_title || ""}
                onChange={(e) => setConfig({ ...config, meta_title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mô tả SEO (Meta Description)</label>
              <textarea
                value={config.meta_description || ""}
                onChange={(e) => setConfig({ ...config, meta_description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
