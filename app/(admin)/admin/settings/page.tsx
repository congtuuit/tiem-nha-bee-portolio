"use client";

import { useState, useEffect } from "react";
import { Save, Store, Phone, MapPin, Globe, MessageCircle, Info, Clock } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/Loading";

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
    map_embed_url: "",
    working_hours: [] as { day: string; open: string; close: string; active: boolean }[],
  });

  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          // Decode map_embed_url if it exists
          let decodedMap = data.map_embed_url || "";
          try {
            if (decodedMap && !decodedMap.includes("<iframe")) {
              decodedMap = atob(decodedMap);
            }
          } catch (e) {
            console.warn("Failed to decode map_embed_url", e);
          }

          // Handle working_hours
          const hours = Array.isArray(data.working_hours) && data.working_hours.length > 0 
            ? data.working_hours 
            : daysOfWeek.map(d => ({ day: d, open: "08:00", close: "21:00", active: true }));

          setConfig((prev) => ({ 
            ...prev, 
            ...data, 
            map_embed_url: decodedMap,
            working_hours: hours
          }));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Encode map_embed_url to Base64
      const dataToSave = {
        ...config,
        map_embed_url: config.map_embed_url ? btoa(unescape(encodeURIComponent(config.map_embed_url))) : ""
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
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
    return <Loading text="Đang tải cấu hình..." />;
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
            <Clock className="w-5 h-5" />
            <span>Thời gian làm việc</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {config.working_hours.map((item, index) => (
              <div key={item.day} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center gap-3 min-w-[100px]">
                  <input
                    type="checkbox"
                    id={`day-${index}`}
                    checked={item.active}
                    onChange={(e) => {
                      const newHours = [...config.working_hours];
                      newHours[index].active = e.target.checked;
                      setConfig({ ...config, working_hours: newHours });
                    }}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor={`day-${index}`} className="font-bold text-slate-700 text-sm cursor-pointer select-none">
                    {item.day}
                  </label>
                </div>

                <div className="flex items-center gap-2 flex-grow justify-end">
                  {item.active ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={item.open}
                        onChange={(e) => {
                          const newHours = [...config.working_hours];
                          newHours[index].open = e.target.value;
                          setConfig({ ...config, working_hours: newHours });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                      <span className="text-slate-400 font-bold">→</span>
                      <input
                        type="time"
                        value={item.close}
                        onChange={(e) => {
                          const newHours = [...config.working_hours];
                          newHours[index].close = e.target.value;
                          setConfig({ ...config, working_hours: newHours });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic px-4">Tạm nghỉ</span>
                  )}
                </div>
              </div>
            ))}
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
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Mã nhúng bản đồ (Google Maps Iframe)</label>
              <textarea
                value={config.map_embed_url || ""}
                onChange={(e) => setConfig({ ...config, map_embed_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all min-h-[100px]"
                placeholder='<iframe src="..." ...></iframe>'
              />
              <p className="text-[10px] text-slate-400">
                Bạn có thể dán toàn bộ đoạn mã iframe từ Google Maps vào đây.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
