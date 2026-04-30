import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { FacebookIcon, ZaloIcon } from "@/components/Icons";

interface FooterProps {
  config: {
    shop_name: string;
    phone?: string | null;
    address?: string | null;
    zalo_url?: string | null;
    facebook_url?: string | null;
    footer_text?: string | null;
  } | null;
}

export function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-amber-600">{config?.shop_name || "Tiệm Nhà Bee"}</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            {config?.footer_text || "Chuyên đồ handmade, quà tặng ý nghĩa và độc đáo dành cho bạn và những người thân yêu."}
          </p>
          <div className="flex gap-4">
            {config?.facebook_url && (
              <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-100 rounded-full text-neutral-600 hover:bg-amber-100 hover:text-amber-600 transition-all">
                <FacebookIcon size={20} />
              </a>
            )}
            {config?.zalo_url && (
              <a href={config.zalo_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-100 rounded-full text-neutral-600 hover:bg-amber-100 hover:text-amber-600 transition-all">
                <ZaloIcon size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-900">Liên hệ</h4>
          <ul className="space-y-3">
            {config?.phone && (
              <li className="flex items-center gap-3 text-neutral-600 text-sm">
                <Phone className="w-4 h-4 text-amber-500" />
                <a href={`tel:${config.phone}`} className="hover:text-amber-600">{config.phone}</a>
              </li>
            )}
            {config?.address && (
              <li className="flex items-start gap-3 text-neutral-600 text-sm">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5" />
                <span>{config.address}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-900">Liên kết</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/san-pham" className="text-neutral-600 text-sm hover:text-amber-600">Sản phẩm</Link>
            </li>
            <li>
              <Link href="/ve-chung-toi" className="text-neutral-600 text-sm hover:text-amber-600">Về chúng tôi</Link>
            </li>
            <li>
              <Link href="/chinh-sach" className="text-neutral-600 text-sm hover:text-amber-600">Chính sách mua hàng</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t text-center text-neutral-400 text-xs">
        &copy; {currentYear} {config?.shop_name || "Tiệm Nhà Bee"}. All rights reserved.
      </div>
    </footer>
  );
}
