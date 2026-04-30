import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

export function ProductCard({ product }: { product: Product }) {
  const priceFormatted = product.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
    : 'Liên hệ';

  return (
    <Link href={`/san-pham/${product.slug}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-medium text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-amber-600 font-semibold">{priceFormatted}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
