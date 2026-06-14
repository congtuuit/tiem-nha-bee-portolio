import { ImageWithSkeleton } from './ui/ImageWithSkeleton';
import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { ZaloIcon, FacebookIcon } from '@/components/Icons';
import { cn } from '@/lib/utils';
import { generateImageAlt } from '@/lib/seo';

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
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-amber-900/5 hover:-translate-y-1 transition-all duration-500 border border-neutral-100/80 flex flex-col h-full">
      {/* Image Link */}
      <Link href={`/san-pham/${product.slug}`} className="relative aspect-square overflow-hidden bg-neutral-50 block">
        {product.cover_image ? (
          <ImageWithSkeleton
            src={product.cover_image}
            alt={generateImageAlt(product.name)}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">
            No Image
          </div>
        )}
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-amber-600 shadow-sm">
            {product.category?.name || "Handmade"}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow space-y-2">
        <Link href={`/san-pham/${product.slug}`} className="flex-grow">
          <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col gap-3 mt-auto pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-black text-amber-600">{priceFormatted}</span>
          </div>
          
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] group/btn",
              isFacebook ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" : 
              isZalo ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" : 
              "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"
            )}
          >
            {isZalo ? <ZaloIcon size={16} /> : isFacebook ? <FacebookIcon size={16} /> : <MessageCircle className="w-4 h-4" />}
            <span>Liên hệ ngay</span>
          </a>
        </div>
      </div>
    </div>
  );
}
