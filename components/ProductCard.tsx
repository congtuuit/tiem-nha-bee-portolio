import { ImageWithSkeleton } from './ui/ImageWithSkeleton';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { ZaloIcon, FacebookIcon } from '@/components/Icons';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: any; // Using any for simplicity with Prisma types
  contactUrl?: string;
}

export function ProductCard({ product, contactUrl = "https://m.me/tiemnhabee" }: ProductCardProps) {
  const isZalo = contactUrl.includes("zalo.me");
  const isFacebook = contactUrl.includes("facebook.com") || contactUrl.includes("m.me");
  
  const priceFormatted = product.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))
    : 'Liên hệ';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col h-full">
      {/* Image Link */}
      <Link href={`/san-pham/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-neutral-100 block">
        {product.cover_image ? (
          <ImageWithSkeleton
            src={product.cover_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-amber-600 shadow-sm">
            Handmade
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col gap-3 mt-auto">
          <span className="text-base font-bold text-amber-500">{priceFormatted}</span>
          
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 w-full py-2 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.98]",
              isFacebook ? "bg-[#0866FF] hover:bg-[#0055D4]" : 
              isZalo ? "bg-[#0068FF] hover:bg-[#0055D4]" : 
              "bg-neutral-900 hover:bg-amber-600"
            )}
          >
            {isZalo ? <ZaloIcon size={16} /> : isFacebook ? <FacebookIcon size={16} /> : <MessageCircle className="w-4 h-4" />}
            Liên hệ tư vấn
          </a>
        </div>
      </div>
    </div>
  );
}
