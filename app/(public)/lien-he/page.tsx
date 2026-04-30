import { getShopConfig } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Phone, MapPin, Mail, MessageCircle, Clock } from "lucide-react";
import { FacebookIcon, ZaloIcon } from "@/components/Icons";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: `Liên hệ | ${shopConfig?.shop_name || "Tiệm Nhà Bee"}`,
    description: "Liên hệ với Tiệm Nhà Bee để được tư vấn về các sản phẩm handmade, len sợi và các khóa học móc len.",
  };
}

export default async function ContactPage() {
  const shopConfig = await getShopConfig();
  
  // Handle Map URL / Iframe
  let mapUrl = "";
  if (shopConfig?.map_embed_url) {
    try {
      let rawMap = shopConfig.map_embed_url;
      // Decode Base64
      if (!rawMap.includes("<iframe") && !rawMap.startsWith("http")) {
        rawMap = Buffer.from(rawMap, 'base64').toString('utf-8');
      }
      
      // Extract src from iframe tag
      if (rawMap.includes("<iframe")) {
        const match = rawMap.match(/src=["']([^"']+)["']/);
        mapUrl = match ? match[1] : "";
      } else {
        mapUrl = rawMap;
      }
    } catch (e) {
      console.error("Failed to parse map_embed_url", e);
    }
  }
  
  return (
    <div className="space-y-12 pb-12">
      <Breadcrumbs items={[{ label: "Liên hệ" }]} />

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left: Contact Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Liên hệ với chúng tôi</h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Bạn có thắc mắc về sản phẩm hoặc muốn đặt làm theo yêu cầu? Đừng ngần ngại liên hệ với Tiệm Nhà Bee qua các kênh dưới đây.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Điện thoại</h3>
                <p className="text-neutral-600">{shopConfig?.phone || "Đang cập nhật"}</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Địa chỉ</h3>
                <p className="text-neutral-600 line-clamp-2">{shopConfig?.address || "Đang cập nhật"}</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <ZaloIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Zalo</h3>
                <a href={shopConfig?.zalo_url || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chat ngay</a>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#0866FF]/10 rounded-2xl flex items-center justify-center text-[#0866FF]">
                <FacebookIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Facebook</h3>
                <a href={shopConfig?.facebook_url || "#"} target="_blank" rel="noopener noreferrer" className="text-[#0866FF] hover:underline">Ghé thăm Fanpage</a>
              </div>
            </div>
          </div>

          <div className="p-8 bg-neutral-900 rounded-[2rem] text-white space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-500" />
              Thời gian làm việc
            </h3>
            <div className="space-y-3 opacity-90">
              {Array.isArray(shopConfig?.working_hours) && (shopConfig.working_hours as any[]).length > 0 ? (
                (shopConfig.working_hours as any[]).map((item) => (
                  <div key={item.day} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0 last:pb-0">
                    <span>{item.day}</span>
                    <span className="font-medium">
                      {item.active ? `${item.open} - ${item.close}` : <span className="text-white/40 italic">Nghỉ</span>}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span>Thứ 2 - Thứ 7</span>
                    <span className="font-medium">08:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chủ nhật</span>
                    <span className="font-medium">09:00 - 18:00</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Map/Form Placeholder */}
        <div className="h-[600px] bg-neutral-200 rounded-[3rem] overflow-hidden relative group shadow-2xl shadow-neutral-200/50">
          {mapUrl ? (
            <iframe 
              src={mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] contrast-[1.1] brightness-[0.95]"
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 p-12 text-center bg-neutral-100">
              <div className="space-y-4">
                <MapPin className="w-16 h-16 mx-auto opacity-20" />
                <p className="font-medium">Bản đồ chưa được cấu hình</p>
                <p className="text-sm opacity-60 text-balance">
                  Admin có thể vào mục <strong>Cài đặt</strong> để dán mã nhúng Google Maps vào đây.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
